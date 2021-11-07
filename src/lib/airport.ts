import Plane from './plane';
import FibHeap from './fibonacci';
import {fuelConsumption, loadFactor} from './config';
import * as _ from 'lodash';
import {parseTime} from '../utils/time';
import * as moment from 'moment';

type addPlaneOption = {
    name: string,
    time: string;
    type: 'takeoff' | 'landing',
    fuel: number;
    nice: number;
}

export class Airport {
    planes: Array<Plane>;
    queue: FibHeap;
    takeoffLoad: number;
    landingLoad: number;
    currentTime: moment.Moment;
    planesOutQueue: Array<Plane>;
    servedCount: number;
    crashedPlanes: Array<Plane>;

    constructor() {
      this.planes = [];
      this.queue = new FibHeap();
      this.takeoffLoad = 0;
      this.landingLoad = 0;
      this.servedCount = 0;
      this.currentTime = moment(new Date(1970, 0, 1));
      this.planesOutQueue = [];
      this.crashedPlanes = [];
    }

    addPlane(options: addPlaneOption) {
      const p = new Plane(
          options.name,
          options.type,
          parseTime(options.time),
          options.fuel,
          options.nice,
      );
      this.planes.push(p);
    }

    interval(debug: boolean = false) {
      // calculate load
      this.takeoffLoad = loadFactor * this.takeoffLoad +
            (1 - loadFactor) * _.sum(
                this.planes.filter((p) => p.status == 'queueing').map((p) =>
                    p.type === 'takeoff' ? 1 : 0));
      this.landingLoad = loadFactor * this.landingLoad +
          (1 - loadFactor) * _.sum(
              this.planes.filter((p) => p.status == 'queueing').map((p) =>
                  p.type === 'landing' ? 1 : 0));

      // Update plane's wait time and fuel consumption.
      this.planes.filter((p) => p.status == 'queueing').forEach((p) => {
        p.waitTime += p.type == 'takeoff' ?
            this.takeoffLoad : this.landingLoad;
        // p.fuel -= p.type == 'takeoff' ? 0 : fuelConsumption;
        if (p.type == 'landing') {
          p.fuel -= fuelConsumption;
          if (p.fuel < 0) {
            // CRASHED!
            this.queue.remove(p.heapNode);
            this.crashedPlanes.push(p);
            p.status = 'crashed';
          }
        }
        this.queue.decreaseKey(p.heapNode, p.priority());
      });
      // Push plane into queue if needed.
      this.planes.filter(
          (p) => p.time <= this.currentTime && p.status == 'waiting',
      ).forEach((p) => {
        debug && console.log(`${p.name} is added to queue.`);
        // Pushing plane into queue.
        p.heapNode = this.queue.insert(p.priority(), p);
        p.status = 'queueing';
      });

      // Pop 3 planes for normal lane.
      let haveEmergency = false;
      const planeOutQueue: Array<Plane> = [];
      for (let i = 0; i < 3; ++ i) {
        if (this.queue.empty()) break;
        const p = this.queue.findMax().data;

        if (p.type != 'landing' || p.fuel <= 10) {
          haveEmergency = true;
        }
        planeOutQueue.push(p);
        this.queue.extractMax();
      }
      if (haveEmergency) {
        // we already have a emergency landing plane on the 4th lane.
        // so we need to find any other plane.
        if (!this.queue.empty()) {
          const p = this.queue.findMax().data;
          this.queue.extractMax();
          planeOutQueue.push(p);
        }
      } else {
        // we don't have a emergency plane.
        // we need a emergency landing plane or a takeoff plane.
        const planes = [];
        while (!this.queue.empty()) {
          const p = this.queue.findMax().data;
          this.queue.extractMax();
          if (p.type != 'landing' || p.fuel <= 10) {
            // is landing or takeoff && emergency
            // Gotcha!
            planeOutQueue.push(p);
            break;
          } else {
            planes.push(p);
          }
        }
        planes.forEach((p) => {
          p.heapNode = this.queue.insert(p.priority(), p);
        });
      }
      planeOutQueue.forEach((p) => p.status = 'served');
      this.servedCount += planeOutQueue.length;
      this.planesOutQueue = planeOutQueue;
      debug && console.log(`At time ${this.currentTime.format('HH:mm')},
planes out queue are`);
      debug && this.planesOutQueue.forEach((p) => {
        console.log(p.toString());
      });
    }
}
