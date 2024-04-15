import { createSelector } from '@ngrx/store';
import { AppState, messagesAdapter } from './reducers';

export const selectChatbotState = (state: AppState) => state.chatbot;

// messages: EntityState<Message>;
// playerIds: string[];
// avatars: Record<Author, string>;
// currentPlayer: {
//   messageId: string | null;
//   youtubeId: string | null;
//   playing: boolean;
// };
// fullscreen: boolean;
// open: boolean;

export const selectMessagesState = createSelector(
  selectChatbotState,
  (state) => state.messages
);

export const messagesSelector =
  messagesAdapter.getSelectors(selectMessagesState);

export const playerIdsSelector = createSelector(
  selectChatbotState,
  (state) => state.playerIds
);

export const avatarsSelector = createSelector(
  selectChatbotState,
  (state) => state.avatars
);

export const currentPlayerSelector = createSelector(
  selectChatbotState,
  (state) => state.currentPlayer
);

export const fullscreenSelector = createSelector(
  selectChatbotState,
  (state) => state.fullscreen
);

export const openSelector = createSelector(
  selectChatbotState,
  (state) => state.open
);
