import * as PIXI from 'pixi.js';
import '@/style/main.scss';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let app: PIXI.Application;
if (window.devicePixelRatio == 2) {
  PIXI.settings.RESOLUTION = 2;
  app = new PIXI.Application({width: 800, height: 800});
  app.view.classList.add('scale-2');
  console.log(app.view.classList);
} else {
  app = new PIXI.Application({width: 800, height: 800});
}
document.querySelector('#app').appendChild(app.view);

// @ts-ignore
window.app = app;

// initially, we go to stage1.
import stage1 from './stages/loadStage';
stage1(app);


