import * as PIXI from 'pixi.js';
import '@/style/main.scss';
import {FibHeap, FibHeapNode} from './lib/fibonacci';
import {cloneDeep} from 'lodash';
import {Airport} from './lib/airport';

const app = new PIXI.Application({width: 256, height: 256});
document.querySelector('#app').appendChild(app.view);

const a = new Airport();
const times = [
  '00:00',
  '00:00',
  '00:00',
  '00:00',
  '00:00',
  '00:06',
  '00:06',
  '00:06',
  '00:06',
  '00:06',
  '00:11',
  '00:11',
  '00:11',
  '00:11',
  '00:11',
  '00:11',
  '00:11',
  '00:11',
  '00:11',
  '00:11',
];
for (let i = 0; i < 20; ++i) {
  a.addPlane({
    name: `Plane ${i}`,
    time: times[i],
    type: 'takeoff',
    fuel: 100,
    nice: 0,
  });
}

for (let i = 0; i < 5; ++ i) {
  a.interval();
  // console.log(a);
  console.log(a.landingLoad);
  console.log(a.takeoffLoad);
  console.log('Queue:');
  a.queue.walk((n) => {
    console.log(n.data.toString());
  });
}

//
// const hp = new FibHeap();
// for (let i = 0; i < 10; ++ i) {
//   hp.insert(i, '' + i);
// }
// while (hp.n != 0) {
//   console.log('min', hp.findMax());
//   hp.extractMax();
// }
// console.log(hp);
// hp.walk();
// const a: Array<FibHeapNode> = [];
// for (let i = 0; i < 10; ++ i) {
//   a[i] = hp.insert(i, '' + i);
// }
// hp.insert(-10, '');
// hp.extractMax();
// hp.walk();
// hp.decreaseKey(a[5], -100);
// hp.walk();
// hp.decreaseKey(a[6], -101);
// hp.walk();
// while (hp.n != 0) {
//   console.log('min', hp.findMax().data);
//   hp.extractMax();
// }
// console.log(hp);
// hp.walk();
