import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Message, MessageAlbums } from 'src/app/chatbot/api/messages';
import { sendMessage } from 'src/app/chatbot/store/actions';
import { AppState } from 'src/app/chatbot/store/reducers';

@Component({
  selector: 'chatbot-message-albums',
  template: `
    <ul *ngIf="message && message.type === 'albums'">
      <li *ngFor="let album of message.albums">
        <button mat-stroked-button (click)="onAlbum(album)">
          {{ album.name }}
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
export class ChatbotMessageAlbumsComponent {
  @Input() message: Message | undefined;

  constructor(private store: Store<AppState>) {}

  onAlbum(album: MessageAlbums['albums'][number]) {
    this.store.dispatch(
      sendMessage({
        payload: `Play a song from ${album.artist} on the album ${album.name}`,
      })
    );
  }
}
