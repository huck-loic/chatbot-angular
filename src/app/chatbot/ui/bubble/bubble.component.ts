import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import type { Author } from '../../api/messages';

@Component({
  selector: 'bubble',
  template: `
    <div [class]="author">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }

      div {
        padding: 10px 16px;
        margin-bottom: 8px;
        border-radius: 24px;
      }

      .chatbot {
        border-top-left-radius: 3px;
        color: #fff;
        background-color: #3f51b5;
        align-self: flex-start;
        margin-right: 48px;
      }

      .user {
        border-bottom-right-radius: 3px;
        color: black;
        background-color: rgba(0, 0, 0, 0.08);
        align-self: flex-end;
        margin-left: 48px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleComponent {
  @Input() author: Author = 'chatbot';
}
