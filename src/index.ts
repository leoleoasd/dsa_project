import * as PIXI from 'pixi.js';
import '@/style/main.scss';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({width: 800, height: 800});
document.querySelector('#app').appendChild(app.view);
app.stage.scale.set(1);

// @ts-ignore
window.app = app;

// initially, we go to stage1.
import stage1 from './stages/loadStage';
stage1(app);


