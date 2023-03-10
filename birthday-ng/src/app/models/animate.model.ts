import { TickersService } from "../services/tickers.service";
import * as uuid from 'uuid';
import { ChangeDetectorRef, NgZone } from "@angular/core";

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

export class TimedState {
    time: number;
    state: string;
    constructor(time: number, state: string) {
        this.time = time;
        this.state = state;
    }
}

export class StateFromTo {

    tickers: TickersService;
    uuid: string;
    states: TimedState[];
    current: TimedState;

    constructor(tickers: TickersService) {
        this.tickers = tickers;
        this.uuid = uuid.v4();
        this.states = [];
    }

    add(s: TimedState): StateFromTo {
        this.states.push(s);
        this.current = this.states[0];
        return this;
    }

    go(zone: NgZone, callback: ()=>void) {
        zone.run(() => {
            if (this.states.length > 0) {
                this.current = this.states.splice(0, 1)[0];
                this.tickers.once(this.uuid, this.current.time, () => {                
                    this.go(zone, callback);
                });
            } else {
                callback();
            }
        }
        );
    }

    stop() {
        this.tickers.stop(this.uuid);
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

    go(zone: NgZone, time: number) {
        Object.keys(this.values).forEach(key => this.values[key].reset());
        this.elapsed = 0;
        this.time = time;
        this.tickers.loop(this.uuid, this.frame, () => {
            zone.run(() => {
                this.elapsed = Math.min(this.time, this.elapsed + this.frame);
                Object.keys(this.values).forEach(key => this.values[key].update(this.time, this.elapsed));
                if (this.elapsed >= this.time) {
                    this.tickers.stop(this.uuid);
                }
            });
        });
    }

}

export class TimedValue {
    value: number;
    time: number;

    constructor(time: number) {
        this.time = time;
    }

    go(zone:NgZone, tickers: TickersService, uuid: string, callback: () => void) {
        tickers.once(uuid, this.time, callback);
    }
}

export class ConstantTimedValue extends TimedValue {
    firstValue: number;
    constructor(time: number, value: number) {
        super(time);
        this.firstValue = value;
    }
    override go(zone:NgZone, tickers: TickersService, uuid: string, callback: () => void) {
        this.value = this.firstValue;
        tickers.once(uuid, this.time, () => {
            zone.run(callback);
        });
    }
}

export class LinearTimedValue extends TimedValue {
    elapsed: number;
    valueStart: number;
    valueFinish: number;
    constructor(time: number, valueStart: number, valueFinish: number) {
        super(time);
        this.value = valueStart;
        this.valueStart = valueStart;
        this.valueFinish = valueFinish;
    }
    override go(zone:NgZone, tickers: TickersService, uuid: string, callback: () => void) {
        this.value = this.valueStart;
        const frame = 25;
        this.elapsed = 0;
        tickers.loop(uuid, frame, () => {
            zone.run(() => {
                this.elapsed = this.elapsed + frame;
                if (this.elapsed >= this.time) {
                    this.value = this.valueFinish;
                    tickers.stop(uuid);
                    callback();
                } else {
                    this.value = this.valueStart + (this.valueFinish - this.valueStart) * this.elapsed / this.time;
                }
            });
        });
    }
}

export class GracefulFromTo {

    tickers: TickersService;
    uuid: string;
    values: TimedValue[];
    current: TimedValue;

    constructor(tickers: TickersService) {
        this.tickers = tickers;
        this.uuid = uuid.v4();
        this.values = [];
    }

    add(s: TimedValue): GracefulFromTo {
        this.values.push(s);
        return this;
    }

    go(zone: NgZone, callback: ()=>void) {
        zone.run(() => {
            if (this.values.length > 0) {
                this.current = this.values.splice(0, 1)[0];
                this.current.go(zone, this.tickers, this.uuid, () => {
                    this.go(zone, callback);
                });
            } else {
                callback();
            }
        });
    }

    stop() {
        this.tickers.stop(this.uuid);
    }

}
