import { TickersService } from "../services/tickers.service";
import * as uuid from 'uuid';

export class MinMaxValue {

    start: number;
    finish: number;
    value: number;

    constructor(start: number, finish: number) {
        this.start = start;
        this.finish = finish;
        this.value = start;
    }

    update(max: number, at: number) {
        this.value = this.start + (this.finish - this.start) * at / max;
    }

    reset() {
        this.value = this.start;
    }

}


export class MoveFromTo {

    frame = 25;

    values: { [id: string]: MinMaxValue };

    uuid: string;
    time: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    tickers: TickersService;

    elapsed: number;

    constructor(tickers: TickersService) {
        this.tickers = tickers;
        this.uuid = uuid.v4();
        this.values = {};
    }

    add(name: string, min: number, max: number): MoveFromTo {
        this.values[name] = new MinMaxValue(min, max);
        return this;
    }

    addMinMax(name: string, minmax: MinMaxValue): MoveFromTo {
        this.values[name] = minmax;
        return this;
    }

    go(time: number) {
        Object.keys(this.values).forEach(key => this.values[key].reset());
        this.elapsed = 0;
        this.time = time;
        this.tickers.loop(this.uuid, this.frame, () => {
            this.updatePosition(this);
        });
    }

    updatePosition(move: MoveFromTo) {
        move.elapsed = Math.min(this.time, move.elapsed + move.frame);
        Object.keys(this.values).forEach(key => this.values[key].update(this.time, this.elapsed));
        if (move.elapsed >= move.time) {
            move.tickers.stop(move.uuid);
        }
    }

}
