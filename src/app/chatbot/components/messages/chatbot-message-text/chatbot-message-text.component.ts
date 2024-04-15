import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Message } from 'src/app/chatbot/api/messages';

@Component({
  selector: 'chatbot-message-text',
  template: `<bubble
    *ngIf="message && message.type === 'text'"
    [author]="message.author"
    >{{ message.text }}</bubble
  >`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotMessageTextComponent {
  @Input() message: Message | undefined;
}
