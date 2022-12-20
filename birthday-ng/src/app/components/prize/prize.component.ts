import { Component, Input, OnInit } from '@angular/core';
import { Prize } from 'src/app/models/baloon.model';

@Component({
  selector: '[app-prize]',
  templateUrl: './prize.component.svg',
  styleUrls: ['./prize.component.scss']
})
export class PrizeComponent implements OnInit {

  @Input() prize: Prize;

  constructor() { }

  ngOnInit(): void {
  }

}
