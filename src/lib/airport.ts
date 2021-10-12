import Plane from './plane';
import FibHeap from './fibonacci';
import {loadFactor} from './config';
import * as _ from 'lodash';

type addPlaneOption = {
    name: string,
    time: number;
    type: 'takeoff' | 'landing',
    fuel: number;
    nice: number;
}
class Airport {
    planes: Array<Plane>;
    queue: FibHeap;
    takeoffLoad: number;
    landingLoad: number;
    currentTime: number;

    constructor() {
      this.planes = [];
      this.queue = new FibHeap();
    }

    addPlane(options: addPlaneOption) {
      const p = new Plane(
          options.name,
          options.type,
          options.time,
          options.fuel,
          options.nice,
      );
      this.planes.push(p);
    }

    interval() {
      // calculate load
      this.takeoffLoad = loadFactor * this.takeoffLoad +
            (1 - loadFactor) * _.sum(
                this.planes.map((p) =>
                    p.type === 'takeoff' ? 1 : 0));
      this.landingLoad = loadFactor * this.landingLoad +
          (1 - loadFactor) * _.sum(
              this.planes.map((p) =>
                  p.type === 'landing' ? 1 : 0));
      this.planes.filter((p) => p.inQueue).forEach((p) => {
        p.waitTime += p.type == 'takeoff' ?
            this.takeoffLoad : this.landingLoad;
      });
      this.planes.filter((p) => p.type == 'takeoff').forEach((p) => {
        this.queue.insert(p.priority());
      });
    }
}
