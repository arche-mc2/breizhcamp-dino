import { Player } from './player.js';

const BOUND_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];

const AVAILABLE_BGS = [
    'gta.jpg',
    'pokemon.webp',
    'pokemon-2.jfif',
    'dinan.png',
    'st-malo.jpg_large',
    'paris.jfif',
    'new-york.jpg',
    'tokyo.jpg'
];

export class Game {
    /** @type {Player} */
    player;

    constructor() {
    }

    start() {
        this.loadBackground();

        this.player = new Player().init();

        this.initListeners();

        return this;
    }

    loadBackground() {
        const randomBackIndex = Math.floor(Math.random() * AVAILABLE_BGS.length) + 1;
        document.body.style.backgroundImage = 'url(images/city/' + AVAILABLE_BGS[randomBackIndex] + ')'
    }

    initListeners() {
        document.addEventListener('keydown', e => {
            console.log('KEYDOWN : ', e);

            if (this.isBoundKey(e.code)) {
                this.player.handleCommand(e.code);
            }
        });
    }

    isBoundKey(keyCode) {
        return BOUND_KEYS.includes(keyCode);
    }
}
