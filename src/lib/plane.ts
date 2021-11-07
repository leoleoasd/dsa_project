import {FibHeapNode} from './fibonacci';
import {fuelFactor} from './config';
import * as moment from 'moment';
import * as PIXI from 'pixi.js';
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
    status: 'waiting' | 'queueing' | 'served' | 'crashed';
    sprite: PIXI.Container;

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

    getSprite(): PIXI.Container {
      if (this.sprite) return this.sprite;
      const container = new PIXI.Container();
      const ps = PIXI.Sprite.from('/assets/plane.png');
      ps.x = 0;
      ps.y = 0;
      const tailSprite = PIXI.Sprite.from(`https://content.airhex.com/content/logos/airlines_${this.name.slice(0, 2)}_32_32_t.png`);
      const text = new PIXI.Text(this.name, {fontSize: 16, fill: 'white', align: 'left'});
      text.x = 50;
      text.y = 10;
      tailSprite.scale.x = -1;
      tailSprite.x = 110;
      tailSprite.y = 6 * 5;
      container.addChild(ps);
      container.addChild(tailSprite);
      container.addChild(text);
      this.sprite = container;
      container.pivot.x = 0;
      container.pivot.y = 50;
      // if (this.type == 'takeoff') {
      text.scale.x = -1;
      container.scale.x = -1;
      container.pivot.x = 100;
      // }
      return container;
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
