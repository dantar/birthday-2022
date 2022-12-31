import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuguriLetter } from 'src/app/models/baloon.model';

@Component({
  selector: '[app-tanti-auguri]',
  templateUrl: './tanti-auguri.component.svg',
  styleUrls: ['./tanti-auguri.component.scss']
})
export class TantiAuguriComponent {

  @Input() letters: AuguriLetter[];

  lettersClasses(): {[id: string]: boolean} {
    let result: {[id: string]: boolean} = {};
    this.letters.forEach(letter => result[`show-${letter.code}`] = letter.visible);
    return result;
  }

}
