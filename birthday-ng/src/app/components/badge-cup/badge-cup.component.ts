import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-badge-cup]',
  templateUrl: './badge-cup.component.svg',
  styleUrls: ['./badge-cup.component.scss']
})
export class BadgeCupComponent implements OnInit {

  @Input() score: number;
  @Input() sign = false;

  constructor() { }

  ngOnInit(): void {
  }

}
