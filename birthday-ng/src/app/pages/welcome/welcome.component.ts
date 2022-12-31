import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HighscoresService } from 'src/app/services/highscores.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  showHighscores: boolean;

  constructor(
    private router: Router,
    private highscores: HighscoresService,
  ) { }

  ngOnInit(): void {
    this.showHighscores = false;
  }

  clickWelcome() {
    this.router.navigate(['play']);
  }

  toggleHighscores() {
    this.highscores.refresh();
    this.showHighscores = !this.showHighscores;
  }

}
