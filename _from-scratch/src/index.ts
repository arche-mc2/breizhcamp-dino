import { Game } from './game';

const FPS = 60;
const FPS_DELTA = 1000 / FPS;

const game = Game.new().start();

(window as any).game = game;

let lastRefresh = 0;
let frames = 0;
let delta: number;
let excessTime: number;

function refresh(now: any) {
    requestAnimationFrame(refresh);

    delta = now - lastRefresh;

    if (delta < FPS_DELTA) return;

    excessTime = delta % FPS_DELTA;
    lastRefresh = now - excessTime;

    game.update();
    game.render(delta);

    frames++;
}

setInterval(() => {
    console.log(frames);
    frames = 0;
}, 1000);

requestAnimationFrame(refresh);
