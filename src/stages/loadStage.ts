import * as PIXI from 'pixi.js';
import {Airport} from '../lib/airport';
import main from './main';
import homeIcon from '../assets/home.png';
import loadIcon from '../assets/load.png';
import loadHoverIcon from '../assets/load-hover.png';

export default (app: PIXI.Application) => {
  const home = PIXI.Sprite.from(homeIcon);
  home.anchor.set(0.5);
  home.x = app.screen.width / 2;
  home.y = app.screen.height / 2;
  app.stage.addChild(home);
  const loadTexture = PIXI.Texture.from(loadIcon);
  const loadHoverTexture = PIXI.Texture.from(loadHoverIcon);

  const load = PIXI.Sprite.from(loadTexture);
  load.scale.set(0.5);
  load.anchor.set(0.5);
  load.x = app.screen.width / 2;
  load.y = app.screen.height / 2 + 100;
  load.interactive = true;
  load.buttonMode = true;
  load.on('pointerover', (event) => {
    load.texture = loadHoverTexture;
  });
  load.on('pointerout', () => {
    load.texture = loadTexture;
  });
  load.on('pointerdown', async (event) => {
    // console.log(event);
    const fileName: File = await new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.style.display = 'none';
      document.body.appendChild(input);
      input.onchange = () => {
        resolve(input.files[0]);
        input.remove();
      };
      input.click();
    });
    const text: string = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = (x) => resolve(fr.result.toString());
      fr.readAsText(fileName);
    });
    //     const text = `CA1935 00:00 0
    // CZ7101 00:01 0
    // CA1501 00:02 0
    // FM9501 00:03 0
    // HU7604 0 00:05
    // MU5104 0 00:10 100
    // `;
    const airport = new Airport();
    const pattern = /^([A-Z0-9]+) (\d\d:\d\d|0) (\d\d:\d\d|0)( \d+|)$/;
    for (const [i, line] of text.split('\n').entries()) {
      if (!line) continue;
      const match = line.match(pattern);
      if (match) {
        const [, name, takeoff, landing, nice] = match;
        if (takeoff == '0' && landing == '0') {
          alert(`?????????????????????${i}???:${line}`);
          return;
        }
        airport.addPlane({
          name,
          type: takeoff == '0' ? 'landing' : 'takeoff',
          fuel: 100,
          nice: parseInt(nice) || 0,
          time: takeoff == '0' ? landing : takeoff,
        });
      } else {
        alert(`?????????????????????${i}???:${line}`);
        return;
      }
    }
    airport.planes.sort((a, b) => a.time > b.time ? 1 : -1);
    // console.log(airport);
    // console.log(text);
    app.stage.removeChild(load);
    app.stage.removeChild(home);
    main(app, airport);
  });
  app.stage.addChild(load);
};
