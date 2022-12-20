import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GamesCommonService {

  constructor() { }

  shuffle<T>(a: T[]):void {
    GamesCommonService.shuffle(a);
  }

  randomInt(min: number, max: number): number {
    return GamesCommonService.randomInt(min, max);
  }

  randomPop<T>(a: T[]): T {
    return GamesCommonService.randomPop(a);
  }

  randomPick<T>(a: T[]): T {
    return GamesCommonService.randomPick(a);
  }

  static shuffle<T>(a: T[]): void {
    let rindex: number;
    for (let index = a.length; index > 1 ; index--) {
      rindex = this.randomInt(0, index - 1);
      a.push(a[rindex]);
      a.splice(rindex, 1);
    }
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomPop<T>(a: T[]): T {
    return a.splice(this.randomInt(0, a.length-1), 1)[0];
  }

  static randomPick<T>(a: T[]): T {
    return a[this.randomInt(0, a.length-1)];
  }

}
