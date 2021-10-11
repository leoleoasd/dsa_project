import * as PIXI from 'pixi.js';
import '@/style/main.scss';
import {FibHeap, FibHeapNode} from './lib/fibonacci';
import {cloneDeep} from 'lodash';

const app = new PIXI.Application({width: 256, height: 256});
document.querySelector('#app').appendChild(app.view);

const hp = new FibHeap();
for (let i = 0; i < 10; ++ i) {
  hp.insert(i, '' + i);
}
while (hp.n != 0) {
  console.log('min', hp.findMin());
  hp.extractMin();
}
console.log(hp);
hp.walk();
const a: Array<FibHeapNode> = [];
for (let i = 0; i < 10; ++ i) {
  a[i] = hp.insert(i, '' + i);
}
hp.insert(-10, '');
hp.extractMin();
hp.walk();
hp.decreaseKey(a[5], -100);
hp.walk();
hp.decreaseKey(a[6], -101);
hp.walk();
while (hp.n != 0) {
  console.log('min', hp.findMin().data);
  hp.extractMin();
}
console.log(hp);
hp.walk();
