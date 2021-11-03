import * as moment from 'moment';
import {Airport} from './lib/airport';
import * as _ from 'lodash';

const a = new Airport();
// const times = [
//   '00:00',
//   '00:00',
//   '00:00',
//   '00:00',
//   '00:00',
//   '00:06',
//   '00:06',
//   '00:06',
//   '00:06',
//   '00:06',
//   '00:11',
//   '00:11',
//   '00:11',
//   '00:11',
//   '00:11',
//   '00:11',
//   '00:11',
//   '00:11',
//   '00:11',
//   '00:11',
// ];
let minute = 0;
for (let i = 0; i < 30; ++ i) {
  minute += 1;
  const hour = Math.floor(minute / 60);
  // console.log(i, `${('00' + hour).slice(-2)}:${('00' + minute % 60).slice(-2)}`);
  a.addPlane({
    name: `Plane ${i}`,
    time: `${('00' + hour).slice(-2)}:${('00' + minute % 60).slice(-2)}`,
    // time: `00:${('00' + Math.floor((i*5 / 4))).slice(-2)}`,
    type: 'takeoff',
    fuel: 100,
    nice: 0,
  });
}
for (let i = 30; i < 1000; ++i) {
  minute += [1, 1, 1, 2][i % 4];
  const hour = Math.floor(minute / 60);
  // minute %= 60;
  console.log(i, `${('00' + hour).slice(-2)}:${('00' + minute % 60).slice(-2)}`);
  a.addPlane({
    name: `Plane ${i}`,
    time: `${('00' + hour).slice(-2)}:${('00' + minute % 60).slice(-2)}`,
    // time: `00:${('00' + Math.floor((i*5 / 4))).slice(-2)}`,
    type: i % 4 == 0 ? (
        Math.floor(i / 100) % 2 == 0 ? 'landing' : 'takeoff'
    ) : (
        Math.floor(i / 100) % 2 == 1 ? 'landing' : 'takeoff'
    ),
    fuel: 100,
    nice: 0,
  });
}

let f = 0;
for (let i = 0; a.servedCount != 1000; ++ i) {
  a.interval();
  // console.log(a);
  // console.log(a.landingLoad);
  // console.log(a.takeoffLoad);
  // console.log('Queue:');
  // a.queue.walk((n) => {
  //   console.log(n.data.toString());
  // });
  const c1 = _.sum(a.planesOutQueue.map((p) => p.type == 'landing' ? 1 : 0));
  const c2 = _.sum(a.planesOutQueue.map((p) => p.type == 'takeoff' ? 1 : 0));
  console.log(i, c1, c2, a.queue.n);
  if (a.queue.n > 6 && f == 0) {
    console.log(a.planesOutQueue[0].name);
    f = 1;
  }
}
