import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setOpen } from '../../store/actions';
import { AppState } from '../../store/reducers';
import { fullscreenSelector, openSelector } from '../../store/selectors';

@Component({
  selector: 'chatbot-window',
  template: `
    <div
      *ngIf="open$ | async"
      class="window"
      [ngClass]="(fullscreen$ | async) ? 'fullscreen' : ''"
    >
      <mat-card class="popin">
        <ng-content></ng-content>
      </mat-card>
    </div>
    <button
      *ngIf="!(open$ | async)"
      mat-mini-fab
      color="primary"
      aria-label="Example icon button with a menu icon"
      class="button"
      (click)="handleOpen()"
    >
      <mat-icon>chat</mat-icon>
    </button>
  `,
  styles: [
    `
      .window {
        box-sizing: border-box;
        position: fixed;
        display: flex;
        flex-direction: column;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        max-width: 400px;
        max-height: 600px;
        padding: 20px;

        &.fullscreen {
          box-sizing: border-box;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          max-width: none;
          max-height: none;
          padding: 0;
          background: white;
        }
      }

      .popin {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        padding: 0;
      }

      .button {
        position: fixed;
        width: 48px;
        height: 48px;
        bottom: 20px;
        right: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotWindowComponent {
  open$: Observable<boolean>;
  fullscreen$: Observable<boolean>;

  handleOpen() {
    this.store.dispatch(setOpen({ payload: true }));
  }

  constructor(private store: Store<AppState>) {
    this.open$ = store.pipe(select(openSelector));
    this.fullscreen$ = store.pipe(select(fullscreenSelector));
  }
}
