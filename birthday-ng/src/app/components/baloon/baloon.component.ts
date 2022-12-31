import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GameBaloon } from 'src/app/models/baloon.model';
import { TickersService } from 'src/app/services/tickers.service';
import { AudioPlayService } from 'src/app/services/audio-play.service';
import { ConstantTimedValue, GracefulFromTo, LinearTimedValue, MoveFromTo, StateFromTo, TimedState } from 'src/app/models/animate.model';
import { endWith } from 'rxjs';

@Component({
  selector: '[app-baloon]',
  templateUrl: './baloon.component.svg',
  styleUrls: ['./baloon.component.scss']
})
export class BaloonComponent implements OnInit {

  @Input() baloon: GameBaloon;
  @Output() score = new EventEmitter<BaloonComponent>();
  @Output() done = new EventEmitter<BaloonComponent>();

  position: MoveFromTo;
  state: StateFromTo;
  flip: GracefulFromTo;
  hidden: boolean;

  constructor(
    private tickers: TickersService,
    private audio: AudioPlayService,
    private changes: ChangeDetectorRef,
    private zone: NgZone,
    ) { }

  ngOnInit(): void {
    this.position = new MoveFromTo(this.tickers)
    .add('x', this.baloon.start.x , this.baloon.finish.x)
    .add('y', this.baloon.start.y , this.baloon.finish.y)
    ;
    this.initFromPattern(this.baloon.pattern);
    this.state.go(this.zone, () => {
      this.done.emit(this);
    });
    this.position.go(this.zone, this.baloon.time);
    this.flip.go(this.zone, () => {});
  }

  initFromPattern(pattern: string) {
    this.state = new StateFromTo(this.tickers);
    this.flip = new GracefulFromTo(this.tickers);
    const fliptime = 500;
    switch (pattern) {
      case 'shown':
        this.state.add(new TimedState(this.baloon.time, 'shown'));
        this.flip.add(new ConstantTimedValue(this.baloon.time, 1.0));
        break;
      case 'hidden-shown-hidden':
        this.state
        .add(new TimedState(this.baloon.time / 3, 'hidden'))
        .add(new TimedState(this.baloon.time / 3, 'shown'))
        .add(new TimedState(this.baloon.time / 3, 'hidden'))
        ;
        this.flip
        .add(new ConstantTimedValue(this.baloon.time / 3 - fliptime, 1.0))
        .add(new LinearTimedValue(fliptime, 1.0, 0.0))
        .add(new LinearTimedValue(fliptime, 0.0, 1.0))
        .add(new ConstantTimedValue(this.baloon.time / 3 - 2 * fliptime, 1.0))
        .add(new LinearTimedValue(fliptime, 1.0, 0.0))
        .add(new LinearTimedValue(fliptime, 0.0, 1.0))
        ;
        break;
      case 'shown-hidden-shown':
        this.state
        .add(new TimedState(this.baloon.time / 3, 'shown'))
        .add(new TimedState(this.baloon.time / 3, 'hidden'))
        .add(new TimedState(this.baloon.time / 3, 'shown'))
        ;
        this.flip
        .add(new ConstantTimedValue(this.baloon.time / 3 - fliptime, 1.0))
        .add(new LinearTimedValue(fliptime, 1.0, 0.0))
        .add(new LinearTimedValue(fliptime, 0.0, 1.0))
        .add(new ConstantTimedValue(this.baloon.time / 3 - 2 * fliptime, 1.0))
        .add(new LinearTimedValue(fliptime, 1.0, 0.0))
        .add(new LinearTimedValue(fliptime, 0.0, 1.0))
        ;
        break;
      case 'hidden-first':
        this.state
        .add(new TimedState(this.baloon.time / 2, 'hidden'))
        .add(new TimedState(this.baloon.time / 2, 'shown'))
        ;
        this.flip
        .add(new ConstantTimedValue(this.baloon.time / 2 - fliptime, 1.0))
        .add(new LinearTimedValue(fliptime, 1.0, 0.0))
        .add(new LinearTimedValue(fliptime, 0.0, 1.0))
        ;
        break;
      case 'shown-first':
      default:
        this.state
        .add(new TimedState(this.baloon.time / 2, 'shown'))
        .add(new TimedState(this.baloon.time / 2, 'hidden'))
        ;
        this.flip
        .add(new ConstantTimedValue(this.baloon.time / 2 - fliptime, 1.0))
        //.add(new LinearTimedValue(this.baloon.time / 2 - fliptime, 1.0, 1.0))
        .add(new LinearTimedValue(fliptime, 1.0, 0.0))
        .add(new LinearTimedValue(fliptime, 0.0, 1.0))
        ;
    }
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

  contentTransform(): string {
    return `scale(0.8,0.8) scale(${this.flip.current.value}, 1.0)`;
  }

}

