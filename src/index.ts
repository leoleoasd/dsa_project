import * as PIXI from 'pixi.js';
import '@/style/main.scss';
import FibHeap from './lib/fibonacci';
import {cloneDeep} from 'lodash';
const app = new PIXI.Application({width: 256, height: 256});
document.querySelector('#app').appendChild(app.view);

const hp = new FibHeap();
for (let i = 0; i < 10; ++ i) {
  hp.insert(i);
}
while (hp.n != 0) {
  console.log('min', hp.findMin());
  hp.extractMin();
}
console.log(hp);
hp.walk();
for (let i = 0; i < 11; ++ i) {
  hp.insert(i);
}
hp.extractMin();
console.log(cloneDeep(hp));
while (hp.n != 0) {
  console.log('min', hp.findMin());
  hp.extractMin();
}
console.log(hp);
hp.walk();
