import { Component, OnInit } from '@angular/core';
import { BaloonCoordinates, GameBaloon, Prize } from 'src/app/models/baloon.model';
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
  baloons: GameBaloon[] = [];
  streak: GameBaloon[] = [];

  stage: number;
  auguri: string[];
  prizes: Prize[];


  showHighscores: boolean;
  showFinalScore: boolean;
  showNewRound: boolean;

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
  ) { }

  ngOnInit(): void {
    this.showHighscores = false;
    this.showFinalScore = false;
    this.showNewRound = true;
    this.resetGame();
  }

  totalScore(): number {
    return 100;
  }

  resetGame() {
    this.stage = 0;
    this.auguri = [...GameComponent.AUGURI];
    this.prizes = [];
    this.newRound();
  }

  newRound() {
    this.showNewRound = false;
    this.stage = this.stage +1;
    this.streak = [];
    for (let index = 0; index < this.stage; index++) {
      let trail: Trails = this.trails[this.games.randomInt(0,3)];
      this.streak.push(new GameBaloon(
        this.randomCoordinate(trail.start), 
        this.randomCoordinate(trail.finish), 
        this.games.randomInt(1500, 3200))
        .setText(index === 0 ? GameComponent.AUGURI.substring(this.stage, this.stage +1) : '')
        );      
    }
    this.startRound();
  }

  startRound() {
    this.tickers.loop('baloons', 200, ()=>{
      this.baloons.push(this.games.randomPop(this.streak));
      if (this.streak.length === 0) {
        this.tickers.stop('baloons');
        if (this.stage < GameComponent.AUGURI.length) {
          this.tickers.once('newstage', 2000, () => {
            this.showNewRound = true;
          })
        }
      }
    });
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

  scoreBaloon(baloon: GameBaloon, event: any) {
    console.log(baloon);
  }

  clickBaloon(baloon: GameBaloon) {
    if (baloon.text != '') {
      this.prizes.push(new Prize(baloon));
    }
  }

  transformPrize(index: number, prize: Prize): string {
    return `translate(10, ${50 + index * 5}) scale(0.15,0.15)`;
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
