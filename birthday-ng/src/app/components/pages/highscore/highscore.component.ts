import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HighscoresService } from 'src/app/services/highscores.service';

@Component({
  selector: '[app-highscore]',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit, AfterViewInit {

  @ViewChild('yourscore') yourscore: ElementRef;
  prova: string;

  edit: boolean;

  constructor(public hs: HighscoresService) { }
  
  ngOnInit(): void {
    this.edit = this.hs.highscores.player ? false: true;
    // todo: mostrare input se nome è vuoto altrimenti (cambia)
  }

  ngAfterViewInit(): void {
    if (this.yourscore) {
      this.yourscore.nativeElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  enterPlayer() {
    this.edit = false;
    this.hs.player(this.hs.highscores.player);
  }

}
