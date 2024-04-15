import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChatbotAppComponent } from './components/chatbot-app/chatbot-app.component';
import { ChatbotHeaderComponent } from './components/chatbot-header/chatbot-header.component';
import { ChatbotInputComponent } from './components/chatbot-input/chatbot-input.component';
import { ChatbotWindowComponent } from './components/chatbot-window/chatbot-window.component';
import { ChatbotMessagesComponent } from './components/chatbot-messages/chatbot-messages.component';
import { ChatbotMessageComponent } from './components/messages/chatbot-message/chatbot-message.component';
import { ChatbotMessageTextComponent } from './components/messages/chatbot-message-text/chatbot-message-text.component';
import { ChatbotMessageLoadingComponent } from './components/messages/chatbot-message-loading/chatbot-message-loading.component';
import { ChatbotMessageChoiceComponent } from './components/messages/chatbot-message-choice/chatbot-message-choice.component';
import { ChatbotMessageAlbumsComponent } from './components/messages/chatbot-message-albums/chatbot-message-albums.component';
import { ChatbotMessageAlbumComponent } from './components/messages/chatbot-message-album/chatbot-message-album.component';
import { ChatbotMessagePlayerComponent } from './components/messages/chatbot-message-player/chatbot-message-player.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChatbotEffects } from './store/effects';
import { reducers } from './store/reducers';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BubbleComponent } from './ui/bubble/bubble.component';
import { IconLoadingComponent } from './ui/icon-loading/icon-loading.component';
import { ContainerComponent } from './ui/container/container.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    MatFormFieldModule,
    MatCommonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    StoreModule.forFeature('chatbot', reducers),
    EffectsModule.forFeature([ChatbotEffects]),
  ],
  providers: [],
  declarations: [
    ChatbotAppComponent,
    ChatbotWindowComponent,
    ChatbotHeaderComponent,
    ChatbotInputComponent,
    ChatbotMessagesComponent,
    ChatbotMessageComponent,
    ChatbotMessageTextComponent,
    ChatbotMessageLoadingComponent,
    ChatbotMessageChoiceComponent,
    ChatbotMessageAlbumsComponent,
    ChatbotMessageAlbumComponent,
    ChatbotMessageAlbumsComponent,
    ChatbotMessagePlayerComponent,
    BubbleComponent,
    IconLoadingComponent,
    ContainerComponent,
    YoutubePlayerComponent,
  ],
  exports: [ChatbotAppComponent],
})
export class ChatbotModule {}
