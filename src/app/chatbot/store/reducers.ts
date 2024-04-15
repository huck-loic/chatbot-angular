import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import {
  addMessage,
  addMessages,
  setFullscreen,
  setOpen,
  setCurrentPlayer,
  setCurrentPlayerToLast,
  setCurrentPlaying,
  sendMessage,
  sendMessageFulfilled,
  sendMessageRejected,
} from './actions';

import type { EntityState } from '@ngrx/entity';
import type { Message, Author } from '../api/messages';
import { getRandomAvataaarsUrl } from 'src/app/utils/get-random-avataaars-url';

export type AppState = {
  chatbot: ChatbotState;
};

export type ChatbotState = {
  messages: EntityState<Message>;
  playerIds: string[];
  avatars: Record<Author, string>;
  currentPlayer: {
    messageId: string | null;
    youtubeId: string | null;
    playing: boolean;
  };
  fullscreen: boolean;
  open: boolean;
};

export const messagesAdapter = createEntityAdapter({
  selectId: (message: Message) => message.id,
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});

export const initialState: ChatbotState = {
  messages: messagesAdapter.getInitialState(),
  playerIds: [],
  avatars: {
    user: getRandomAvataaarsUrl(),
    chatbot: getRandomAvataaarsUrl(),
  },
  currentPlayer: {
    messageId: null,
    youtubeId: null,
    playing: false,
  },
  fullscreen: false,
  open: true,
};

export const reducers = createReducer(
  initialState,
  on(addMessage, (state, action) => ({
    ...state,
    messages: messagesAdapter.addOne(action.payload, state.messages),
  })),
  on(addMessages, (state, action) => ({
    ...state,
    messages: messagesAdapter.addMany(action.payload, state.messages),
  })),
  on(setFullscreen, (state, action) => ({
    ...state,
    fullscreen: action.payload,
  })),
  on(setOpen, (state, action) => ({
    ...state,
    open: action.payload,
  })),
  on(setCurrentPlayer, (state, action) => ({
    ...state,
    currentPlayer: {
      messageId: action.payload.messageId,
      youtubeId: action.payload.youtubeId,
      playing: action.payload.playing ?? state.currentPlayer.playing,
    },
  })),
  on(setCurrentPlayerToLast, (state, action) => {
    const lastPlayerId = state.playerIds[state.playerIds.length - 1];
    const message = lastPlayerId ? state.messages.entities[lastPlayerId] : null;
    if (!message || message.type !== 'player') {
      return state;
    }

    return {
      ...state,
      currentPlayer: {
        messageId: message.id,
        youtubeId: message.player.id,
        playing: action.payload ?? state.currentPlayer.playing,
      },
    };
  }),
  on(setCurrentPlaying, (state, action) => ({
    ...state,
    currentPlayer: {
      ...state.currentPlayer,
      playing: action.payload,
    },
  })),
  on(sendMessage, (state, action) => ({ ...state })),
  on(sendMessageFulfilled, (state, action) => {
    const playerIds = [...state.playerIds];
    for (const message of action.payload) {
      if (message.type === 'player') {
        playerIds.push(message.id);
      }
    }

    return {
      ...state,
      playerIds,
      messages: messagesAdapter.upsertMany(action.payload, state.messages),
    };
  }),
  on(sendMessageRejected, (state, action) => {
    return { ...state };
  })
);
