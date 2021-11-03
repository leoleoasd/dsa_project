import {FibHeapNode} from './fibonacci';
import {fuelFactor} from './config';
import * as moment from 'moment';
// const fuelFactor = 0.2;

class Plane {
    name: string;
    type: 'takeoff' | 'landing';
    time: moment.Moment;
    fuel: number; // will be ignored during takeoff.
    nice: number;
    waitTime: number;
    heapNode: FibHeapNode;
    // inQueue: boolean;
    status: 'waiting' | 'queueing' | 'served';

    constructor(name: string,
        type: 'takeoff' | 'landing',
        time: moment.Moment,
        fuel: number,
        nice: number) {
      this.name = name;
      this.type = type;
      this.time = time;
      this.fuel = fuel;
      this.waitTime = 0;
      this.nice = nice;
      this.heapNode = null;
      this.status = 'waiting';
    }

    priority(): number {
      return this.waitTime /
          ( this.type == 'landing' ?
            Math.exp(fuelFactor * (this.fuel - 20)) /
                  (Math.exp(fuelFactor * (this.fuel - 20)) + 1) : 1
          ) - 2 * this.nice;
    }

    toString(): string {
      // eslint-disable-next-line max-len
      return `Plane{${this.name}, ${this.time.format('HH:mm')}, ${this.type}, ${this.fuel}, ${this.nice}, ${this.priority()}}`;
    }
}

export {
  Plane,
  Plane as default,
};
