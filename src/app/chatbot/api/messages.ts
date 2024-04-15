import { nanoid } from 'nanoid';
import type { WitAIResponse } from './witai';
import { ARTISTS } from './artists';
import { getArtistInfo } from './audiodb';
import { randomFromArray } from '../../utils/random';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { setCurrentPlayer, setCurrentPlaying } from '../store/actions';

export type Author = 'user' | 'chatbot';

type MessagBase = {
  type: string;
  id: string;
  timestamp: number;
  author: Author;
};

export type MessageText = MessagBase & {
  type: 'text';
  text: string;
};

export type MessageLoading = MessagBase & {
  type: 'loading';
};

export type MessageChoice = MessagBase & {
  type: 'choice';
  choices: { value: string; label: string }[];
};

export type MessageAlbum = MessagBase & {
  type: 'album';
  album: {
    id: string;
    name: string;
    year: string;
    artist: string;
    artistId: string;
    thumb: string;
  };
};

export type MessageAlbums = MessagBase & {
  type: 'albums';
  albums: {
    id: string;
    name: string;
    year: string;
    artist: string;
    artistId: string;
    thumb: string;
  }[];
};

export type MessagePlayer = MessagBase & {
  type: 'player';
  player: {
    id: string;
    youtubeId: string;
    title: string;
    artist: string;
    artistId: string;
    thumb: string;
  };
};

export type Message =
  | MessageText
  | MessageLoading
  | MessageChoice
  | MessagePlayer
  | MessageAlbum
  | MessageAlbums;

export type MessageType = Message['type'];

export type Group = {
  id: string;
  author: Author;
  children: Message[];
};

export type ThunkAPI = {
  store: Store<AppState>;
  state: AppState;
  response: WitAIResponse;
};

export function createTextMessage(
  text: string,
  author: Author = 'chatbot',
  id?: string,
  timestamp?: number
): Message {
  return {
    id: id ?? nanoid(),
    timestamp: timestamp ?? Date.now(),
    type: 'text',
    author,
    text,
  };
}

export function createDefaultMessage(id?: string, timestamp?: number): Message {
  return createTextMessage(
    "I'm sorry, I didn't get that message",
    'chatbot',
    id,
    timestamp
  );
}

function playLastSong(thunkAPI: ThunkAPI, id?: string, timestamp?: number) {
  const state = thunkAPI.state.chatbot;
  const lastPlayerId = state.playerIds[state.playerIds.length - 1];
  const message = state.messages.entities[lastPlayerId];
  if (!message || message.type !== 'player') {
    return [
      createTextMessage(`Sorry, no song to play`, 'chatbot', id, timestamp),
    ];
  }

  thunkAPI.store.dispatch(
    setCurrentPlayer({
      payload: {
        messageId: message.id,
        youtubeId: message.player.youtubeId,
        playing: true,
      },
    })
  );

  return [
    createTextMessage(
      `Now playing ${message.player.title} from ${message.player.artist}`,
      'chatbot',
      id,
      timestamp
    ),
  ];
}

function pauseSong(thunkAPI: ThunkAPI, id?: string, timestamp?: number) {
  const state = thunkAPI.state.chatbot;
  if (state.currentPlayer.playing) {
    thunkAPI.store.dispatch(setCurrentPlaying({ payload: false }));

    if (state.currentPlayer.messageId) {
      const currentMessage =
        state.messages.entities[state.currentPlayer.messageId];
      if (currentMessage && currentMessage.type === 'player') {
        return [
          createTextMessage(
            `Song ${currentMessage.player.title} paused`,
            'chatbot',
            id,
            timestamp
          ),
        ];
      }
    }
  }

  return [createTextMessage(`No song is playing`, 'chatbot', id, timestamp)];
}

const INTENT_TO_MESSAGES: Record<
  string,
  (
    thunkAPI: ThunkAPI,
    id?: string,
    timestamp?: number
  ) => Message[] | Promise<Message[]>
> = {
  greet: (_thunkAPI, id, timestamp) => [
    createTextMessage(
      'Hello, what do you want to listen today?',
      'chatbot',
      id,
      timestamp
    ),
  ],
  purpose: (_thunkAPI, id, timestamp) => {
    const artist = ARTISTS[Math.floor(Math.random() * ARTISTS.length)];
    return [
      createTextMessage(
        `I can help you find an artist, an album, a song, and listen to it. You can try for ${artist.name}:`,
        'chatbot',
        id,
        timestamp
      ),
      {
        id: nanoid(),
        timestamp: timestamp ? timestamp + 0.1 : Date.now(),
        type: 'choice',
        author: 'chatbot',
        choices: [
          {
            value: `What is the latest album from ${artist.name}`,
            label: `Latest album`,
          },
          {
            value: `List songs from ${artist.name}`,
            label: 'List songs',
          },
          {
            value: `Play a random song from ${artist.name}`,
            label: 'Play song',
          },
        ],
      },
    ];
  },
  get_album: async (thunkAPI, id, timestamp) => {
    try {
      console.log('get_song');
      const [artist] = thunkAPI.response.entities['artist:artist'];
      console.log('artist', artist);

      if (!artist) {
        throw new Error('No artist to search');
      }

      const result = await getArtistInfo(artist.value.toString());
      console.log('result', result);
      const albums = Array.from(result.albums.values());
      const messages = [
        createTextMessage(
          `Searching for an album from ${artist.value}`,
          'chatbot',
          id,
          timestamp
        ),
      ];

      if (albums.length > 0) {
        const [action] = thunkAPI.response.entities['action:action'];
        console.log(
          'action:action',
          action.value.toString().trim().toLowerCase()
        );
        if (action && action.value.toString().trim().toLowerCase() === 'play') {
          const [randomAlbum] = randomFromArray(albums, 1);
          if (randomAlbum && randomAlbum.tracks) {
            const [randomTrack] = randomFromArray(randomAlbum.tracks, 1);

            messages.push(
              createTextMessage(
                `Found ${randomAlbum.strAlbum}`,
                'chatbot',
                nanoid(),
                timestamp ? timestamp + 0.1 : timestamp
              )
            );
            messages.push({
              id: nanoid(),
              timestamp: timestamp ? timestamp + 0.2 : Date.now(),
              author: 'chatbot',
              type: 'album',
              album: {
                id: randomAlbum.idAlbum,
                name: randomAlbum.strAlbum,
                year: randomAlbum.intYearReleased || '',
                artist: randomAlbum.strArtist,
                artistId: randomAlbum.idArtist,
                thumb: randomAlbum.strAlbumThumb || '',
              },
            });

            messages.push(
              createTextMessage(
                `Found ${randomAlbum.strAlbum}`,
                'chatbot',
                nanoid(),
                timestamp ? timestamp + 0.3 : timestamp
              )
            );

            const playerMessageId = nanoid();

            messages.push({
              id: playerMessageId,
              timestamp: timestamp ? timestamp + 0.4 : Date.now(),
              author: 'chatbot',
              type: 'player',
              player: {
                id: randomTrack.idTrack,
                youtubeId: randomTrack.strMusicVid || '',
                title: randomTrack.strTrack || '',
                artist: randomTrack.strArtist || '',
                artistId: randomTrack.idArtist || '',
                thumb: randomTrack.strTrackThumb || '',
              },
            });

            thunkAPI.store.dispatch(
              setCurrentPlayer({
                payload: {
                  messageId: playerMessageId,
                  youtubeId: randomTrack.strMusicVid || '',
                  playing: true,
                },
              })
            );

            return messages;
          }
        } else {
          const randomAlbums = randomFromArray(albums, 3);
          messages.push(
            createTextMessage(
              `Here are ${randomAlbums.length} random album you can choose from`,
              'chatbot',
              nanoid(),
              timestamp ? timestamp + 0.1 : timestamp
            )
          );
          messages.push({
            id: nanoid(),
            timestamp: timestamp ? timestamp + 0.2 : Date.now(),
            author: 'chatbot',
            type: 'albums',
            albums: randomAlbums.map((album) => ({
              id: album.idAlbum,
              name: album.strAlbum,
              year: album.intYearReleased || '',
              artist: album.strArtist,
              artistId: album.idArtist,
              thumb: album.strAlbumThumb || '',
            })),
          });

          return messages;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return [
      createTextMessage(
        `Sorry but i didn't find any albums`,
        'chatbot',
        id,
        timestamp
      ),
    ];
  },
  get_song: async (thunkAPI, id, timestamp) => {
    try {
      console.log('get_song');
      const [artist] = thunkAPI.response.entities['artist:artist'];
      console.log('artist', artist);
      if (!artist) {
        throw new Error('No artist to search');
      }

      const result = await getArtistInfo(artist.value.toString());
      const messages = [
        createTextMessage(
          `Searching for a song from ${artist.value}`,
          'chatbot',
          id,
          timestamp
        ),
      ];

      if (result.tracks.length > 0) {
        const [action] = thunkAPI.response.entities['action:action'];
        if (action && action.value.toString().trim().toLowerCase() === 'play') {
          const [randomSong] = randomFromArray(result.tracks, 1);

          messages.push(
            createTextMessage(
              `Found ${randomSong.strTrack}`,
              'chatbot',
              nanoid(),
              timestamp ? timestamp + 0.1 : timestamp
            )
          );
          const playerMessageId = nanoid();
          messages.push({
            id: playerMessageId,
            timestamp: timestamp ? timestamp + 0.2 : Date.now(),
            author: 'chatbot',
            type: 'player',
            player: {
              id: randomSong.idTrack,
              youtubeId: randomSong.strMusicVid || '',
              title: randomSong.strTrack || '',
              artist: randomSong.strArtist || '',
              artistId: randomSong.idArtist || '',
              thumb: randomSong.strTrackThumb || '',
            },
          });

          thunkAPI.store.dispatch(
            setCurrentPlayer({
              payload: {
                messageId: playerMessageId,
                youtubeId: randomSong.strMusicVid || '',
                playing: true,
              },
            })
          );

          return messages;
        } else {
          const randomSongs = randomFromArray(result.tracks, 3);
          messages.push(
            createTextMessage(
              `Here are ${randomSongs.length} random song you can choose from`,
              'chatbot',
              nanoid(),
              timestamp ? timestamp + 0.1 : timestamp
            )
          );

          randomSongs.forEach((song, index) => {
            messages.push({
              id: nanoid(),
              timestamp: timestamp ? timestamp + 0.2 + index * 0.1 : Date.now(),
              author: 'chatbot',
              type: 'player',
              player: {
                id: song.idTrack,
                youtubeId: song.strMusicVid || '',
                title: song.strTrack || '',
                artist: song.strArtist || '',
                artistId: song.idArtist || '',
                thumb: song.strTrackThumb || '',
              },
            });
          });

          return messages;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return [
      createTextMessage(
        `Sorry but i didn't find any song`,
        'chatbot',
        id,
        timestamp
      ),
    ];
  },
  wit$confirmation: playLastSong,
  wit$play: playLastSong,
  wit$pause: pauseSong,
  wit$stop: pauseSong,
  wit$go_back: (thunkAPI, id, timestamp) => {
    const state = thunkAPI.state.chatbot;
    if (state.currentPlayer) {
      return [
        createTextMessage(
          `Sorry you didn't ask for song yet`,
          'chatbot',
          id,
          timestamp
        ),
      ];
    }
    const index = state.playerIds.indexOf(state.currentPlayer);
    const prevMessage = state.playerIds[index - 1];
    const message = state.messages.entities[prevMessage];
    if (!message || message.type !== 'player') {
      return [createTextMessage(`No previous song`, 'chatbot', id, timestamp)];
    }
    thunkAPI.store.dispatch(
      setCurrentPlayer({
        payload: {
          messageId: message.id,
          youtubeId: message.player.youtubeId,
        },
      })
    );
    return [
      createTextMessage(
        `Now playing ${message.player.title} from ${message.player.artist}`,
        'chatbot',
        id,
        timestamp
      ),
    ];
  },
  wit$go_forward: (thunkAPI, id, timestamp) => {
    const state = thunkAPI.state.chatbot;
    if (state.currentPlayer) {
      return [
        createTextMessage(
          `Sorry you didn't ask for song yet`,
          'chatbot',
          id,
          timestamp
        ),
      ];
    }

    const index = state.playerIds.indexOf(state.currentPlayer);
    const nextMessage = state.playerIds[index + 1];
    const message = state.messages.entities[nextMessage];
    if (!message || message.type !== 'player') {
      return [createTextMessage(`No next song`, 'chatbot', id, timestamp)];
    }

    thunkAPI.store.dispatch(
      setCurrentPlayer({
        payload: {
          messageId: message.id,
          youtubeId: message.player.youtubeId,
        },
      })
    );

    return [
      createTextMessage(
        `Now playing ${message.player.title} from ${message.player.artist}`,
        'chatbot',
        id,
        timestamp
      ),
    ];
  },
};

export async function buildMessageFromResponse(
  thunkAPI: ThunkAPI,
  id?: string,
  timestamp?: number
): Promise<Message[]> {
  try {
    console.log('response', thunkAPI.response);
    if (thunkAPI.response.intents.length > 0) {
      const intent = thunkAPI.response.intents[0];
      const messageBuilder = INTENT_TO_MESSAGES[intent.name];
      if (!messageBuilder) {
        throw new Error(
          `Intent "${intent.name}" not found in INTENT_TO_MESSAGE`
        );
      }
      return Promise.resolve(messageBuilder(thunkAPI, id, timestamp));
    }
  } catch (error) {
    console.error(error);
  }

  return [createDefaultMessage(id, timestamp)];
}
