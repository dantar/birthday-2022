import { Component, OnInit } from '@angular/core';
import { MoveFromTo } from 'src/app/models/animate.model';
import { TickersService } from 'src/app/services/tickers.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-tile-flip',
  templateUrl: './tile-flip.component.svg',
  styleUrls: ['./tile-flip.component.scss']
})
export class TileFlipComponent implements OnInit {

  uuid: string;
  a: MoveFromTo;

  constructor(
    private tickers: TickersService,
  ) { }

  ngOnInit(): void {
    this.uuid = uuid.v4();
  }

  flip(time: number) {
    this.a.add('s', 100, 0);
  }

  transform():string {
    return `scale(${this.a.values['s'].value / 100}, 1)`;
  }

}
