import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { nanoid } from 'nanoid';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import {
  buildMessageFromResponse,
  createDefaultMessage,
  createTextMessage,
} from '../api/messages';
import { getWitAiResponse } from '../api/witai';
import {
  addMessage,
  sendMessage,
  sendMessageFulfilled,
  sendMessageRejected,
} from './actions';
import { AppState } from './reducers';

async function queryMessage(
  query: string,
  store: Store<AppState>,
  state: AppState
) {
  store.dispatch(addMessage({ payload: createTextMessage(query, 'user') }));
  console.log('queryMessage');

  const queryID = nanoid();
  const timestamp = Date.now() + 0.1;

  store.dispatch(
    addMessage({
      payload: {
        id: queryID,
        timestamp,
        author: 'chatbot',
        type: 'loading',
      },
    })
  );

  try {
    const response = await getWitAiResponse(query);
    return buildMessageFromResponse(
      {
        store,
        state,
        response,
      },
      queryID,
      timestamp
    );
  } catch (error) {
    console.error(error);
    const errorMessage = createDefaultMessage();
    errorMessage.id = queryID;
    errorMessage.timestamp = timestamp;
    return [errorMessage];
  }
}

@Injectable()
export class ChatbotEffects {
  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendMessage),

      withLatestFrom(this.store),
      switchMap(
        async ([action, state]) =>
          await queryMessage(action.payload, this.store, state)
      ),
      map((messages) => sendMessageFulfilled({ payload: messages })),
      catchError((error) => of(sendMessageRejected()))
    )
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}
