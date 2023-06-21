import { Game } from './game';

const game = Game.new().start();

(window as any).game = game;
