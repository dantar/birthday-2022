import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaloonComponent } from 'src/app/components/baloon/baloon.component';
import { AuguriLetter, AuguriLettersBuilder, BaloonCoordinates, GameBaloon, Prize } from 'src/app/models/baloon.model';
import { AudioPlayService } from 'src/app/services/audio-play.service';
import { GamesCommonService } from 'src/app/services/games-common.service';
import { HighscoresService } from 'src/app/services/highscores.service';
import { TickersService } from 'src/app/services/tickers.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {

  static AUGURI = 'TANTIAUGURI';
  letters: AuguriLetter[];
  baloons: GameBaloon[] = [];
  streak: GameBaloon[] = [];
  collected: ScoredBaloon[];
  patterns: string[];

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
    private router: Router,
    private changes: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.patterns = ['shown-first', 'hidden-first', 'shown-hidden-shown', 'hidden-shown-hidden'];
    this.showHighscores = false;
    this.showFinalScore = false;
    this.showNewRound = true;
    this.resetGame();
  }

  ngOnDestroy(): void {
  }

  totalScore(): number {
    return this.score;
  }

  resetGame() {
    this.letters = new AuguriLettersBuilder().addAll(GameComponent.AUGURI).letters;
    this.score = 0;
    this.stage = 0;
    this.auguri = [...GameComponent.AUGURI];
    this.prizes = [];
    this.newRound();
  }

  clickStageScore () {
    if (this.stage < GameComponent.AUGURI.length) {
      this.newRound();
    } else {
      this.highscores.score(this.score);
      this.showFinalScore = false;
      this.showHighscores = true;
    }
  }

  newRound() {
    this.collected = [];
    this.baloons = [];
    this.showNewRound = false;
    this.stage = this.stage +1;
    this.streak = [];
    for (let index = 0; index < this.stage +2; index++) {
      if (index === 0) {
        this.streak.push(this.addTextBaloon());
      } else {
        if (index % 2 === 0) {
          this.streak.push(this.addRainBaloon());
        } else {
          this.streak.push(this.addSunBaloon());
        }
      }
    }
    this.games.shuffle(this.streak);
    this.startRound();
  }

  aNewBaloon(): GameBaloon {
    let trail: Trails = this.trails[this.games.randomInt(0,3)];
    return new GameBaloon(
      this.randomCoordinate(trail.start), 
      this.randomCoordinate(trail.finish), 
      this.games.randomInt(6000, 8000))
      .setPattern(this.patterns[this.games.randomInt(0,this.patterns.length-1)])
      ;
  }

  addTextBaloon(): GameBaloon {
    return this.aNewBaloon()
    .setPattern(this.patterns[0])
    .setLetter(this.letters[this.stage-1])
    .setScore(5);
  }

  addSunBaloon(): GameBaloon {
    return this.aNewBaloon()
      .setIcon('sun')
      .setScore(1);
  }

  addRainBaloon(): GameBaloon {
    return this.aNewBaloon()
      .setIcon('rain')
      .setScore(-2);
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
    if (!this.showNewRound) {
      this.tickers.once('newstage', time + 300, () => {
        this.showNewRound = true;
        if (this.stage >= GameComponent.AUGURI.length) {
          this.audio.play('ta-dah');
        }
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
      new BaloonCoordinates(event.position.values['x'].value, event.position.values['y'].value))
      );
    if (baloon.letter) {
      baloon.letter.visible = true;
      //this.tantiauguri = this.tantiauguri + baloon.text;
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

  transformCollected(item: ScoredBaloon): string {
    return `translate(${item.position.x},${item.position.y}) scale(0.15,0.15) translate(-50,-50)`;
  }

  exitGame() {
    this.router.navigate(['']);
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
