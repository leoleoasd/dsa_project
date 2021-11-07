import * as PIXI from 'pixi.js';
import {Airport} from '../lib/airport';
import Plane from '../lib/plane';
import {parseTime} from '../utils/time';

export default (app: PIXI.Application, airport: Airport) => {
  const airportSprite = PIXI.Sprite.from('/assets/airport.png');
  app.stage.addChild(airportSprite);
  const bitmapFontText = new PIXI.Text(`${airport.currentTime.format('HH:mm')}, \
${airport.servedCount} / ${airport.queue.n} / ${airport.crashedPlanes.length} / ${airport.planes.length}`, {fontSize: 55, fill: 'white', align: 'left'});
  bitmapFontText.x = 56;
  bitmapFontText.y = 40;
  app.stage.addChild(bitmapFontText);
  const plane = new Plane('SU1234', 'takeoff', parseTime('00:01'), 100, 0);
  const container = plane.getSprite();
  container.x = 15 * 8;
  container.y = 31 * 8;
  app.stage.addChild(container);
  // console.log(bitmapFontText.width);
  // setTimeout(() => {
  //   bitmapFontText.text = '123123123';
  // }, 5000);
};
