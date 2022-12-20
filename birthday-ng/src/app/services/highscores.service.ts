import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HighscoresService {

  highscores: HighScoresDto;

  constructor(private http: HttpClient) {
    let stored = localStorage.getItem(environment.highscore);
    if (stored) {
      this.highscores = JSON.parse(stored);
    } else {
      this.highscores = new HighScoresDto();
      this._save();
    }
    this.refresh();
  }

  private _save() {
    localStorage.setItem(environment.highscore, JSON.stringify(this.highscores));
  }

  refresh() {
    this.highscores.highscores.sort(this.compare);
    this.http.post<HighScoresDto>(`${environment.endpoint}/highscores`, this.highscores)
    .subscribe(
      {
        next: ((hs: HighScoresDto) => {
          HighScoresDto.update(this.highscores, hs);
          this._save();
        }),
        error: ((error: any) => {
          console.log(error);
        })
      }
    );
  }

  player(player: string) {
    HighScoresDto.player(this.highscores, player);
    this._save();
    this.refresh();
  }

  compare(h1: HighScoreDto, h2: HighScoreDto) {
    if (h1.score < h2.score) return -1;
    if (h1.score > h2.score) return 1;
    return 0;
  }

  score(score: number) {
    let yours = this.highscores.highscores.filter(h => h.key === this.highscores.key);
    if (yours.length > 0) {
      yours.forEach(h => {
        h.score = Math.max(h.score, score);
        h.player = this.highscores.player;
      })
    } else {
      this.highscores.highscores.push({key: this.highscores.key, player: this.highscores.player, score: score});
    }
    this._save();
    this.refresh();
  }

}

export class HighScoresDto {

  player: string;
  key: string;
  highscores: HighScoreDto[];

  constructor() {
    this.key = uuid.v4();
    this.player = '';
    this.highscores = [];
  }

  static score(hs: HighScoresDto, score: number) {
    hs.highscores.push(new HighScoreDto(hs, score));
  }

  static update(hs: HighScoresDto, source: HighScoresDto) {
    hs.highscores = source.highscores;
  }

  static player(hs: HighScoresDto, player: string) {
    hs.player = player;
    hs.highscores.forEach(s => s.player = player);
  }

}

export class HighScoreDto {

  key: string;
  player: string;
  score: number;

  constructor(hs: HighScoresDto, score: number) {
    this.key = hs.key;
    this.player = hs.player;
    this.score = score;
  }

}
