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

  constructor(private sanitizer: DomSanitizer) {

  }

  lettersClasses(): {[id: string]: boolean} {
    let result: {[id: string]: boolean} = {};
    this.letters.forEach(letter => result[`show-${letter.code}`] = letter.visible);
    return result;
  }

  styleMe(letter: AuguriLetter) {
    return this.sanitizer.bypassSecurityTrustStyle(`.show-${letter.code} .letter-${letter.code} {opacity: 1;}`);
  }
}
