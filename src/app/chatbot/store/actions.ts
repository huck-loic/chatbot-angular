import { createAction, props } from '@ngrx/store';
import type { Message } from '../api/messages';

// action: PayloadAction<Message>
export const addMessage = createAction(
  'chatbot/addMessage',
  props<{ payload: Message }>()
);

// action: PayloadAction<Message[]>
export const addMessages = createAction(
  'chatbot/addMessages',
  props<{ payload: Message[] }>()
);

// action: PayloadAction<boolean>
export const setFullscreen = createAction(
  'chatbot/setFullscreen',
  props<{ payload: boolean }>()
);

// action: PayloadAction<boolean>
export const setOpen = createAction(
  'chatbot/setOpen',
  props<{ payload: boolean }>()
);

// action: PayloadAction<{ messageId: string; youtubeId: string; playing?: boolean }>
export const setCurrentPlayer = createAction(
  'chatbot/setCurrentPlayer',
  props<{
    payload: { messageId: string; youtubeId: string; playing?: boolean };
  }>()
);

// action: PayloadAction<boolean | undefined>
export const setCurrentPlayerToLast = createAction(
  'chatbot/setCurrentPlayerToLast',
  props<{ payload: boolean | undefined }>()
);

// action: PayloadAction<boolean>
export const setCurrentPlaying = createAction(
  'chatbot/setCurrentPlaying',
  props<{ payload: boolean }>()
);

//
// ASYNC
//
export const sendMessage = createAction(
  'chatbot/sendMessage',
  props<{ payload: string }>()
);

export const sendMessageFulfilled = createAction(
  'chatbot/sendMessage/fulfilled',
  props<{ payload: Message[] }>()
);

export const sendMessageRejected = createAction('chatbot/sendMessage/rejected');
