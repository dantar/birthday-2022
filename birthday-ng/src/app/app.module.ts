import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BaloonComponent } from './components/baloon/baloon.component';
import { GameComponent } from './pages/game/game.component';
import { HighscoreComponent } from './components/pages/highscore/highscore.component';
import { BadgeCupComponent } from './components/badge-cup/badge-cup.component';
import { ResetGameComponent } from './components/reset-game/reset-game.component';
import { TileFlipComponent } from './components/tile-flip/tile-flip.component';
import { PrizeComponent } from './components/prize/prize.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    BaloonComponent,
    GameComponent,
    HighscoreComponent,
    BadgeCupComponent,
    ResetGameComponent,
    TileFlipComponent,
    PrizeComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
