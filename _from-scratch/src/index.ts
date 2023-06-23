import { Game } from './game';

const game = Game.new().start();

(window as any).game = game;

let lastRefresh = 0;

function refresh(now: any) {
    const delta = now - lastRefresh;
    lastRefresh = now;

    game.update();
    game.render(delta);
    
    requestAnimationFrame(refresh);
}

requestAnimationFrame(refresh);
