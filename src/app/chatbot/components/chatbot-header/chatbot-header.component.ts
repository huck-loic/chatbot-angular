import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { setFullscreen, setOpen } from '../../store/actions';
import { AppState } from '../../store/reducers';
import { fullscreenSelector, openSelector } from '../../store/selectors';

@Component({
  selector: 'chatbot-header',
  template: `
    <mat-toolbar color="primary">
      <span>Musicbot</span>
      <div class="button">
        <button
          mat-icon-button
          matSuffix
          type="submit"
          [attr.aria-label]="'Fullscreen'"
          (click)="handleToggleFullscreen()"
        >
          <mat-icon matSuffix color="white" *ngIf="fullscreen"
            >close_fullscreen</mat-icon
          >
          <mat-icon matSuffix color="white" *ngIf="!fullscreen"
            >open_in_full</mat-icon
          >
        </button>

        <button
          mat-icon-button
          matSuffix
          type="submit"
          [attr.aria-label]="'Close'"
          (click)="handleClose()"
        >
          <mat-icon matSuffix color="white">close</mat-icon>
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      mat-toolbar {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotHeaderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();

  fullscreen = false;

  handleClose() {
    this.store.dispatch(setOpen({ payload: false }));
  }

  handleToggleFullscreen() {
    this.store.dispatch(setFullscreen({ payload: !this.fullscreen }));
  }

  constructor(
    private store: Store<AppState>,
    private change: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fullscreenSelector), takeUntil(this.ngUnsubscribe$))
      .subscribe((val) => {
        this.fullscreen = val;
        this.change.markForCheck();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
