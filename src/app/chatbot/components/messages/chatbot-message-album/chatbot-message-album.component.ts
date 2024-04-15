import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Message } from 'src/app/chatbot/api/messages';

@Component({
  selector: 'chatbot-message-album',
  template: `
    <mat-card *ngIf="message && message.type === 'album'">
      <img
        mat-card-image
        [src]="message.album.thumb + '/preview'"
        [alt]="message.album.name"
      />
      <mat-card-title>{{ message.album.name }}</mat-card-title>
      <mat-card-subtitle>{{ message.album.artist }}</mat-card-subtitle>
      <mat-card-content>{{ message.album.year }}</mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 8px;
      }

      mat-card {
        max-width: 185px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotMessageAlbumComponent {
  @Input() message: Message | undefined;
}
