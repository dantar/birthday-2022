export class GameBaloon {

    start: BaloonCoordinates;
    finish: BaloonCoordinates;
    time: number;

    score: number;
    s: number = 1;
    text: string = '';
    state: 'new' | 'ready' | 'empty' | 'full' | 'score' | 'final' | 'zoomed' = 'new';

    picture: string;

    constructor(start: BaloonCoordinates, finish: BaloonCoordinates, time: number) {
        this.start = start;
        this.finish = finish;
        this.time = time;
        this.text = '';
        this.state = 'new';
        this.score = 0;
    }

    setText(text: string): GameBaloon {
        this.text = text;
        return this;
    }

    setScore(score: number): GameBaloon {
        this.score = score;
        return this;
    }

}

export class BaloonCoordinates {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Prize {
    baloon: GameBaloon;
    constructor(baloon: GameBaloon) {
        this.baloon = baloon;
    }
}
