import * as PIXI from 'pixi.js';
import '@/style/main.scss';

const app = new PIXI.Application({width: 256, height: 256});
document.querySelector('#app').appendChild(app.view);
