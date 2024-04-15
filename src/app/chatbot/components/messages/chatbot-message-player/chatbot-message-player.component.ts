import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { currentPlayerSelector } from '../../../store/selectors';

import type { Message } from 'src/app/chatbot/api/messages';
import type { AppState } from 'src/app/chatbot/store/reducers';
import {
  setCurrentPlayer,
  setCurrentPlaying,
} from 'src/app/chatbot/store/actions';

@Component({
  selector: 'chatbot-message-player',
  template: `
    <mat-card *ngIf="message && message.type === 'player'">
      <mat-card-content>
        <mat-card-title>{{ message.player.title }}</mat-card-title>
        <mat-card-subtitle>{{ message.player.artist }}</mat-card-subtitle>
        <button
          mat-icon-button
          matSuffix
          (click)="handleTogglePlaying()"
          [attr.aria-label]="'Play/pause'"
        >
          <mat-icon *ngIf="!isPlaying">play_circle</mat-icon>
          <mat-icon *ngIf="isPlaying">pause_circle</mat-icon>
        </button>
      </mat-card-content>
      <img
        mat-card-image
        [src]="message.player.thumb + '/preview'"
        [alt]="message.player.title"
      />
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      mat-card {
        position: relative;
        display: flex;
        padding: 0;
        margin-bottom: 8px;
        overflow: hidden;
      }

      mat-card-content {
        flex: 1 1 auto;
        padding: 16px;
        margin: 0;
      }

      img {
        max-width: 40%;
        width: 100%;
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotMessagePlayerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();

  @Input() message: Message | undefined;

  messageId: string = '';
  playing = false;

  get isPlaying() {
    return this.playing && this.messageId === this.message?.id;
  }

  handleTogglePlaying() {
    if (!this.message || this.message.type !== 'player') return;

    if (this.isPlaying) {
      this.store.dispatch(setCurrentPlaying({ payload: false }));
    } else {
      this.store.dispatch(
        setCurrentPlayer({
          payload: {
            messageId: this.message.id,
            youtubeId: this.message.player.youtubeId,
            playing: true,
          },
        })
      );
    }
  }

  constructor(
    private store: Store<AppState>,
    private change: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(currentPlayerSelector), takeUntil(this.ngUnsubscribe$))
      .subscribe((val) => {
        this.messageId = val.messageId || '';
        this.playing = val.playing;
        this.change.markForCheck();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
