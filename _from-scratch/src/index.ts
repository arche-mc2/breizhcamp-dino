import { Game } from './game';

const game = Game.new().start();

(window as any).game = game;

function bonsoir() {
    game.update();
    game.render();
    
    requestAnimationFrame(bonsoir);
}

requestAnimationFrame(bonsoir);
