import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Message } from 'src/app/chatbot/api/messages';

@Component({
  selector: 'chatbot-message',
  template: `
    <chatbot-message-loading
      *ngIf="message && message.type === 'loading'"
      [message]="message"
    ></chatbot-message-loading>
    <chatbot-message-text
      *ngIf="message && message.type === 'text'"
      [message]="message"
    ></chatbot-message-text>
    <chatbot-message-choice
      *ngIf="message && message.type === 'choice'"
      [message]="message"
    ></chatbot-message-choice>
    <chatbot-message-album
      *ngIf="message && message.type === 'album'"
      [message]="message"
    ></chatbot-message-album>
    <chatbot-message-albums
      *ngIf="message && message.type === 'albums'"
      [message]="message"
    ></chatbot-message-albums>
    <chatbot-message-player
      *ngIf="message && message.type === 'player'"
      [message]="message"
    ></chatbot-message-player>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotMessageComponent {
  @Input() message: Message | undefined;
}
