import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { sendMessage } from '../../store/actions';

import type { AppState } from '../../store/reducers';

@Component({
  selector: 'chatbot-input',
  template: `
    <container>
      <form [formGroup]="chatForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Ask about music</mat-label>
          <input
            matInput
            formControlName="userMessage"
            placeholder="Placeholder"
          />
          <button
            mat-icon-button
            matSuffix
            type="submit"
            [attr.aria-label]="'Send'"
          >
            <mat-icon matSuffix [color]="iconColor">send</mat-icon>
          </button>
        </mat-form-field>
      </form>
    </container>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
      }

      mat-form-field {
        width: 100%;
      }

      mat-icon {
        display: block;
        text-decoration: none;
      }

      input {
        width: 100%;
      }

      ::ng-deep .mat-form-field-appearance-outline .mat-form-field-wrapper {
        padding: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotInputComponent {
  chatForm = new FormGroup({
    userMessage: new FormControl(''),
  });

  constructor(private store: Store<AppState>) {}

  get iconColor() {
    return this.chatForm.value.userMessage === '' ? 'disabled' : 'primary';
  }

  onSubmit() {
    if (!this.chatForm.value.userMessage) return;

    this.store.dispatch(
      sendMessage({
        payload: this.chatForm.value.userMessage,
      })
    );

    this.chatForm.setValue({ userMessage: '' });
  }
}
