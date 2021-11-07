import * as PIXI from 'pixi.js';
import '@/style/main.scss';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({width: 800, height: 800});
document.querySelector('#app').appendChild(app.view);
app.stage.scale.set(1);

// initially, we go to stage1.
import stage1 from './stages/stage1';
stage1(app);
