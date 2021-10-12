import FibHeapNode from './fibonacci';
import {fuelFactor} from './config';
// const fuelFactor = 0.2;

class Plane {
    name: string;
    type: 'takeoff' | 'landing';
    time: number;
    fuel: number; // will be ignored during takeoff.
    nice: number;
    waitTime: number;
    heapNode: FibHeapNode;
    inQueue: boolean;

    constructor(name: string,
        type: 'takeoff' | 'landing',
        time: number,
        fuel: number,
        nice: number) {
      this.name = name;
      this.type = type;
      this.time = time;
      this.fuel = fuel;
      this.waitTime = 0;
      this.nice = nice;
      this.heapNode = null;
      this.inQueue = false;
    }

    priority(): number {
      return this.waitTime /
          ( this.type == 'landing' ?
            Math.exp(fuelFactor * (this.fuel - 20)) /
              Math.exp(fuelFactor * (this.fuel - 20)) + 1 : 1
          ) - 2 * this.nice;
    }
}

export {
  Plane,
  Plane as default,
};
