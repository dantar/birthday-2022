import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameBaloon } from 'src/app/models/baloon.model';
import { TickersService } from 'src/app/services/tickers.service';
import { AudioPlayService } from 'src/app/services/audio-play.service';
import { MoveFromTo } from 'src/app/models/animate.model';

@Component({
  selector: '[app-baloon]',
  templateUrl: './baloon.component.svg',
  styleUrls: ['./baloon.component.scss']
})
export class BaloonComponent implements OnInit {

  @Input() baloon: GameBaloon;
  @Output() score = new EventEmitter<BaloonComponent>();

  position: MoveFromTo;

  constructor(
    private tickers: TickersService,
    private audio: AudioPlayService,) { }

  ngOnInit(): void {
    this.position = new MoveFromTo(this.tickers)
    .add('x', this.baloon.start.x , this.baloon.finish.x)
    .add('y', this.baloon.start.y , this.baloon.finish.y)
    ;
    this.position.go(this.baloon.time);
  }

  clickBaloon(event: any) {
    this.score.emit(this);
  }

  fixBaloon() {
    this.audio.stop('inflating');
    this.audio.stop('deflating');
    this.tickers.stop('inflate');
    this.tickers.stop('deflate');
  }

  transform(): string {
    return `translate(${this.position.values['x'].value},${this.position.values['y'].value}) scale(0.15,0.15)`;
  }

}

