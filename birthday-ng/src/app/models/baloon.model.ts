import { StateFromTo } from "./animate.model";

export class GameBaloon {

    start: BaloonCoordinates;
    finish: BaloonCoordinates;
    pattern: string;
    time: number;

    score: number;
    s: number = 1;
    text: string = '';
    icon: string = '';
    state: 'new' | 'ready' | 'empty' | 'full' | 'score' | 'final' | 'zoomed' = 'new';

    picture: string;

    constructor(start: BaloonCoordinates, finish: BaloonCoordinates, time: number) {
        this.start = start;
        this.finish = finish;
        this.time = time;
        this.text = '';
        this.icon = '';
        this.state = 'new';
        this.score = 0;
    }

    setText(text: string): GameBaloon {
        this.text = text;
        return this;
    }

    setIcon(text: string): GameBaloon {
        this.icon = text;
        return this;
    }

    setScore(score: number): GameBaloon {
        this.score = score;
        return this;
    }

    setPattern(pattern: string): GameBaloon {
        this.pattern = pattern;
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

