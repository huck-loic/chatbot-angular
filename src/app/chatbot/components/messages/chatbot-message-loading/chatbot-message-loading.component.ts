import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Message } from 'src/app/chatbot/api/messages';

@Component({
  selector: 'chatbot-message-loading',
  template: `<bubble
    *ngIf="message && message.type === 'loading'"
    [author]="message.author"
    ><icon-loading></icon-loading
  ></bubble>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotMessageLoadingComponent {
  @Input() message: Message | undefined;
}
