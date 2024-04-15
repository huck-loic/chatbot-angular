import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { currentPlayerSelector } from '../store/selectors';

import type { AppState } from '../store/reducers';

let apiLoaded = false;

function youtube_parser(url: string) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : '';
}

@Component({
  selector: 'app-youtube-player',
  template: ` <div *ngIf="hasId">
    <youtube-player
      [videoId]="youtubeId"
      [playerVars]="playerVars"
    ></youtube-player>
    <div></div>
  </div>`,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        display: block;
        transform: translateY(-100%);
        z-index: -1;
        opacity: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent implements OnInit {
  private ngUnsubscribe$ = new Subject<void>();

  youtubeId: string = '';
  playing = false;

  get hasId() {
    return !!this.youtubeId;
  }

  get playerVars() {
    return {
      autoplay: this.playing ? 1 : 0,
    };
  }

  constructor(
    private store: Store<AppState>,
    private change: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }

    this.store
      .pipe(select(currentPlayerSelector), takeUntil(this.ngUnsubscribe$))
      .subscribe((val) => {
        const id =
          val.youtubeId !== null && val.youtubeId.includes('youtu')
            ? youtube_parser(val.youtubeId)
            : val.youtubeId;
        this.youtubeId = id ?? '';
        this.playing = val.playing;
        this.change.markForCheck();
        console.log('val', val, id);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
