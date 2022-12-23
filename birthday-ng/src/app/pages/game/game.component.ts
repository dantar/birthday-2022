import { Component, OnInit } from '@angular/core';
import { BaloonComponent } from 'src/app/components/baloon/baloon.component';
import { BaloonCoordinates, GameBaloon, Prize } from 'src/app/models/baloon.model';
import { AudioPlayService } from 'src/app/services/audio-play.service';
import { GamesCommonService } from 'src/app/services/games-common.service';
import { HighscoresService } from 'src/app/services/highscores.service';
import { TickersService } from 'src/app/services/tickers.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  static AUGURI = 'TANTIAUGURI';
  tantiauguri: string;
  baloons: GameBaloon[] = [];
  streak: GameBaloon[] = [];
  collected: ScoredBaloon[];

  stage: number;
  auguri: string[];
  prizes: Prize[];

  showHighscores: boolean;
  showFinalScore: boolean;
  showNewRound: boolean;

  score: number;

  trails: Trails[] = [
    new Trails(topRange, bottomRange),
    new Trails(bottomRange, topRange),
    new Trails(leftRange, rightRange),
    new Trails(rightRange, leftRange),
  ];

  constructor(
    public highscores: HighscoresService,
    public games: GamesCommonService,
    public tickers: TickersService,
    public audio: AudioPlayService,
  ) { }

  ngOnInit(): void {
    this.showHighscores = false;
    this.showFinalScore = false;
    this.showNewRound = true;
    this.resetGame();
  }

  totalScore(): number {
    return this.score;
  }

  resetGame() {
    this.tantiauguri = '';
    this.score = 0;
    this.stage = 0;
    this.auguri = [...GameComponent.AUGURI];
    this.prizes = [];
    this.newRound();
  }

  newRound() {
    this.collected = [];
    this.baloons = [];
    this.showNewRound = false;
    this.stage = this.stage +1;
    this.streak = [];
    for (let index = 0; index < this.stage; index++) {
      let trail: Trails = this.trails[this.games.randomInt(0,3)];
      let baloon = new GameBaloon(
        this.randomCoordinate(trail.start), 
        this.randomCoordinate(trail.finish), 
        this.games.randomInt(4000, 8000));
      if (index === 0) {
        baloon
        .setText(GameComponent.AUGURI.substring(this.stage-1, this.stage))
        .setScore(10);
      } else {
        if (index % 2 === 0) {
          baloon.setIcon('rain');
          baloon.setScore(-2);
        } else {
          baloon.setIcon('sun');
          baloon.setScore(1);
        }
      }
      this.streak.push(baloon);      
    }
    this.startRound();
  }

  startRound() {
    this.tickers.loop('baloons', 200, ()=>{
      let baloon = this.games.randomPop(this.streak);
      this.baloons.push(baloon);
      if (this.streak.length === 0) {
        this.tickers.stop('baloons');
        this.delayToNewStage(baloon.time);
      }
    });
  }

  delayToNewStage(time: number) {
    if (!this.showNewRound && this.stage < GameComponent.AUGURI.length) {
      this.tickers.once('newstage', time + 300, () => {
        this.showNewRound = true;
      })
    }
  }

  randomCoordinate(range: Range): BaloonCoordinates {
    return new BaloonCoordinates(
      this.games.randomInt(range.x, range.x + range.dx),
      this.games.randomInt(range.y, range.y + range.dy)
      );
  }

  toggleHighscores() {
    this.highscores.refresh();
    this.showHighscores = !this.showHighscores;
  }

  scoreBaloon(event: BaloonComponent) {
    let baloon = event.baloon;
    this.audio.play('pop');
    this.score = this.score + baloon.score;
    if (baloon.score < 0) {
      this.audio.play('oops');
    } else {
      this.audio.play('arpeggio');
    }
    this.baloons.splice(this.baloons.indexOf(baloon), 1);
    this.collected.push(new ScoredBaloon(baloon.score, 
      new BaloonCoordinates(event.position.values['x'].value, event.position.values['y'].value)));
    if (baloon.text != '') {
      this.tantiauguri = this.tantiauguri + baloon.text;
      this.prizes.push(new Prize(baloon));
    }
    if (this.baloons.length === 0) {
      this.delayToNewStage(0);
    }
  }

  doneBaloon(event: BaloonComponent) {
    let baloon = event.baloon;
    this.baloons.splice(this.baloons.indexOf(baloon), 1);
    if (this.baloons.length === 0) {
      this.delayToNewStage(0);
    }
  }

  transformPrize(index: number, prize: Prize): string {
    return `translate(10, ${50 + index * 5}) scale(0.15,0.15)`;
  }

}

class ScoredBaloon {
  score: number;
  position: BaloonCoordinates;
  constructor(score: number, position: BaloonCoordinates) {
    this.score = score;
    this.position = position;
  }
}

class Trails {
  start: Range;
  finish: Range;
  constructor(start: Range, finish: Range) {
    this.start = start;
    this.finish = finish;
  }
}

class Range {
  x: number;
  dx: number;
  y: number;
  dy: number;
  constructor(x: number, dx: number, y: number, dy: number) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
}

const topRange: Range = new Range(10, 90, -25, 0);
const bottomRange: Range = new Range(10, 90, 125, 0);
const leftRange: Range = new Range(-25, 0, 10, 90);
const rightRange: Range = new Range(125, 0, 10, 90);
