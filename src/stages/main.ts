import * as PIXI from 'pixi.js';
import {Airport} from '../lib/airport';
import {Plane} from '../lib/plane';
import tree from '../lib/tree';
import {time} from 'd3';

const labelOffset = (new PIXI.Text(' / ', {fontSize: 55, fill: 'white', align: 'left', fontFamily: 'novem__'})).width / 2 + 5;

const putAfter = (a: PIXI.Text, b: PIXI.Text) => {
  b.x = a.x + a.width;
  b.y = a.y;
};

const putUnder = (a: PIXI.Text, b: PIXI.Text, last: boolean = false) => {
  b.anchor.set(0.5);
  b.x = a.x + a.width / 2 - (last ? 0 : labelOffset);
  b.y = a.y + a.height;
};

const makeTable = (planes: Iterable<Plane>, header1: string, header2: string, displayFuel: boolean = false) => {
  const tbl = document.createElement('table');
  tbl.style.width = '100vv';
  tbl.style.border = '1px solid black';
  const header = tbl.insertRow();
  header.insertCell().innerHTML = header1;
  header.insertCell().innerHTML = header2;
  if (displayFuel) {
    header.insertCell().innerHTML = '剩余燃油';
  }
  for (const plane of planes) {
    const tr = tbl.insertRow();
    const name = tr.insertCell();
    name.appendChild(document.createTextNode(plane.name));
    const time = tr.insertCell();
    time.appendChild(document.createTextNode(plane.time.format('HH:mm')));
    if (displayFuel) {
      const fuel = tr.insertCell();
      fuel.appendChild(document.createTextNode(plane.type == 'landing' ? plane.fuel.toString() : 'N/A'));
    }
  }
  return tbl;
};

export default (app: PIXI.Application, airport: Airport) => {
  const airportSprite = PIXI.Sprite.from('/assets/airport.png');
  app.stage.addChild(airportSprite);
  const timeText = new PIXI.Text(`${airport.currentTime.format('HH:mm')}, `, {fontSize: 55, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const servedText = new PIXI.Text(`${airport.servedCount} / `, {fontSize: 55, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const queueingText = new PIXI.Text(`${airport.queue.n} / `, {fontSize: 55, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const crashedText = new PIXI.Text(`${airport.crashedPlanes.length} / `, {fontSize: 55, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const allText = new PIXI.Text(`${airport.planes.length}`, {fontSize: 55, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const servedLabel = new PIXI.Text('served', {fontSize: 20, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const queueingLabel = new PIXI.Text('queue', {fontSize: 20, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const crashedLabel = new PIXI.Text('crashed', {fontSize: 20, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const allLabel = new PIXI.Text('all', {fontSize: 16, fill: 'white', align: 'left', fontFamily: 'novem__'});
  const adjustTexts = () => {
    timeText.x = 56;
    timeText.y = 40;
    putAfter(timeText, servedText);
    putAfter(servedText, queueingText);
    putAfter(queueingText, crashedText);
    putAfter(crashedText, allText);
    putUnder(servedText, servedLabel);
    putUnder(queueingText, queueingLabel);
    putUnder(crashedText, crashedLabel);
    putUnder(allText, allLabel, true);
  };
  adjustTexts();
  app.stage.addChild(timeText);
  app.stage.addChild(servedText);
  app.stage.addChild(queueingText);
  app.stage.addChild(crashedText);
  app.stage.addChild(allText);
  app.stage.addChild(servedLabel);
  app.stage.addChild(queueingLabel);
  app.stage.addChild(crashedLabel);
  app.stage.addChild(allLabel);
  let elapsed = 0.0;
  let minuteCount = 0;
  let intervalCount = 0;
  const ticker = (delta: number) => {
    // @ts-ignore
    if (app.ticker.speed != document.getElementById('speed').value) {
      // @ts-ignore
      app.ticker.speed = document.getElementById('speed').value;
    }
    elapsed += app.ticker.deltaMS;
    airport.currentTime.hour(0);
    airport.currentTime.minute(Math.floor(elapsed / 1000));
    while (elapsed > minuteCount * 1000) {
      minuteCount ++;
      timeText.text = `${airport.currentTime.format('HH:mm')}, `;
      adjustTexts();
    }
    while (elapsed > intervalCount * 5000) {
      // console.log(elapsed, lastInterval);
      // lastInterval = elapsed;
      intervalCount++;
      for (const plane of airport.planesOutQueue) {
        app.stage.removeChild(plane.getSprite());
      }
      airport.interval();
      for (const plane of airport.planesOutQueue) {
        app.stage.addChild(plane.getSprite());
      }
      document.getElementById('tree').innerHTML = '';
      tree(airport.queue);
      servedText.text = `${airport.servedCount} / `;
      queueingText.text = `${airport.queue.n} / `;
      crashedText.text = `${airport.crashedPlanes.length} / `;
      adjustTexts();
      document.getElementById('tables').innerHTML = '';
      const takeOffTable = makeTable(airport.planes.filter((p) => p.type == 'takeoff' && p.status == 'waiting'), '起飞队列', '起飞时间');
      const landingTable = makeTable(airport.planes.filter((p) => p.type == 'landing' && p.status == 'waiting'), '降落队列', '降落时间');
      const queueingTable = makeTable(airport.planes.filter((p) => p.status == 'queueing'), '队列', '起飞 / 降落时间', true);
      document.getElementById('tables').appendChild(takeOffTable);
      document.getElementById('tables').appendChild(landingTable);
      document.getElementById('tables').appendChild(queueingTable);
    }

    for (const [index, plane] of airport.planesOutQueue.entries()) {
      plane.getSprite().x = 15 * 8 + (plane.type == 'takeoff' ?
          Math.pow(((elapsed - intervalCount * 5000 + 5000) / 5000), 2) :
          1 - Math.pow(1 - ((elapsed - intervalCount * 5000 + 5000) / 5000), 2)) * 55 * 8;
      plane.getSprite().y = (31 + 17 * index) * 8 - (plane.type == 'takeoff' ?
          Math.pow(((elapsed - intervalCount * 5000 + 5000) / 5000), 4) :
          Math.pow(1 - ((elapsed - intervalCount * 5000 + 5000) / 5000), 4)) * 10 * 8;
    }
    if (airport.servedCount + airport.crashedPlanes.length == airport.planes.length && airport.planesOutQueue.length == 0) {
      alert('模拟完成！');
      app.ticker.remove(ticker);
    }
  };
  app.ticker.add(ticker);
};
