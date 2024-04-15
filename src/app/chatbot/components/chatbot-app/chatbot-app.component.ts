import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chatbot-app',
  template: `
    <chatbot-window>
      <chatbot-header></chatbot-header>
      <chatbot-messages></chatbot-messages>
      <chatbot-input></chatbot-input>
    </chatbot-window>
    <app-youtube-player></app-youtube-player>
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
export class ChatbotAppComponent {}
