import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../../api/messages';
import { AppState } from '../../store/reducers';
import { messagesSelector } from '../../store/selectors';

@Component({
  selector: 'chatbot-messages',
  template: `
    <div class="scroll" #scrollframe>
      <container>
        <div class="group">
          <chatbot-message
            *ngFor="let message of messages$ | async"
            [message]="message"
          ></chatbot-message>
        </div>
      </container>
      <div></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: auto;
      }

      .scroll {
        flex: 1 1 auto;
        overflow: auto;
      }

      container {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: auto;
        min-height: 100%;
      }

      .group {
        display: flex;
        flex-direction: column;
        padding: 16px 16px 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChatbotMessagesComponent implements AfterViewInit {
  @ViewChild('scrollframe', { static: false }) scrollFrame:
    | ElementRef<HTMLIFrameElement>
    | undefined;

  messages$: Observable<Message[]>;

  constructor(private store: Store<AppState>) {
    this.messages$ = this.store.pipe(select(messagesSelector.selectAll));
  }

  private scrollContainer: HTMLIFrameElement | undefined;

  ngAfterViewInit() {
    if (this.scrollFrame) this.scrollContainer = this.scrollFrame.nativeElement;
    this.messages$.subscribe((_) => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (!this.scrollContainer) {
        return;
      }
      this.scrollContainer.scroll({
        top: this.scrollContainer.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 100);
  }
}
