import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Message } from 'src/app/chatbot/api/messages';
import { sendMessage } from 'src/app/chatbot/store/actions';
import { AppState } from 'src/app/chatbot/store/reducers';

@Component({
  selector: 'chatbot-message-choice',
  template: `
    <ul *ngIf="message && message.type === 'choice'">
      <li *ngFor="let choice of message.choices">
        <button mat-stroked-button (click)="onLabel(choice.value)">
          {{ choice.label }}
        </button>
      </li>
    </ul>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      ul {
        margin-top: 0;
        margin-bottom: 0;
      }

      li {
        margin-bottom: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotMessageChoiceComponent {
  @Input() message: Message | undefined;

  constructor(private store: Store<AppState>) {}

  onLabel(value: string) {
    this.store.dispatch(
      sendMessage({
        payload: value,
      })
    );
  }
}
