import * as PIXI from 'pixi.js';
import {Airport} from '../lib/airport';
import tree from '../lib/tree';

export default (app: PIXI.Application, airport: Airport) => {
  const airportSprite = PIXI.Sprite.from('/assets/airport.png');
  app.stage.addChild(airportSprite);
  const text = new PIXI.Text(`${airport.currentTime.format('HH:mm')}, \
${airport.servedCount} / ${airport.queue.n} / ${airport.crashedPlanes.length} / ${airport.planes.length}`, {fontSize: 55, fill: 'white', align: 'left'});
  text.x = 56;
  text.y = 40;
  app.stage.addChild(text);
  let elapsed = 0.0;
  let lastMinute = 0;
  let lastInterval = -5000;
  const ticker = (delta: number) => {
    // @ts-ignore
    if (app.ticker.speed != document.getElementById('speed').value) {
      // @ts-ignore
      app.ticker.speed = document.getElementById('speed').value;
    }
    elapsed += app.ticker.deltaMS;

    if (elapsed - lastMinute > 1000) {
      lastMinute = elapsed;
      airport.currentTime.add(1, 'm');
      text.text = `${airport.currentTime.format('HH:mm')}, \
${airport.servedCount} / ${airport.queue.n} / ${airport.crashedPlanes.length} / ${airport.planes.length}`;
    }
    if (elapsed - lastInterval >= 5000) {
      lastInterval = elapsed;
      for (const plane of airport.planesOutQueue) {
        app.stage.removeChild(plane.getSprite());
      }
      airport.interval();
      for (const plane of airport.planesOutQueue) {
        app.stage.addChild(plane.getSprite());
      }
      document.getElementById('tree').innerHTML = '';
      tree(airport.queue);
      text.text = `${airport.currentTime.format('HH:mm')}, \
${airport.servedCount} / ${airport.queue.n} / ${airport.crashedPlanes.length} / ${airport.planes.length}`;
    }

    for (const [index, plane] of airport.planesOutQueue.entries()) {
      plane.getSprite().x = 15 * 8 + (plane.type == 'takeoff' ?
          Math.pow(((elapsed - lastInterval) / 5000), 2) :
          1 - Math.pow(1 - ((elapsed - lastInterval) / 5000), 2)) * 55 * 8;
      plane.getSprite().y = (31 + 17 * index) * 8 - (plane.type == 'takeoff' ?
          Math.pow(((elapsed - lastInterval) / 5000), 2) :
          Math.pow(1 - ((elapsed - lastInterval) / 5000), 4)) * 10 * 8;
    }
    if (airport.servedCount == airport.planes.length && airport.planesOutQueue.length == 0) {
      alert('模拟完成！');
      app.ticker.remove(ticker);
    }
  };
  app.ticker.add(ticker);
};
