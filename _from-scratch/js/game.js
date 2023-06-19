import { Coords, Dimension, GameObject } from './item.js';
import { Player } from './player.js';
import { Util } from './util.js';
import { Wall } from './wall.js';

const BOUND_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'];

const AVAILABLE_BGS = [
    'gta.jpg',
    'pokemon.webp',
    'pokemon-2.jfif',
    'dinan.png',
    'st-malo.jpg_large',
    'paris.jfif',
    'new-york.jpg',
    'tokyo.jpg',
    'jurassic-park-1.jpg',
    'jurassic-park-2.jpg',
    'jurassic-park-3.jpg'
];

export class Game {
    /** @type {Player} */
    player;

    /** @type {[key: string]: boolean} pressingKeys */
    pressingKeys = {};

    /** @type {Dimension} */
    areaSize;

    /** @type {GameObject[]} */
    gameObjects = [];

    constructor() {
    }

    start() {
        this.loadBackground();
        this.updateGameSize();

        this.player = new Player().init();
        this.addGameObject(this.player);

        this.addWalls(3);

        this.initGravity();
        this.initListeners();

        return this;
    }

    addWalls(count) {
        [...Array(count)]
            .map(_ => Wall.random())
            .forEach(w => {
                w.print();
                this.addGameObject(w);
            });
    }

    /** @param {GameObject} go */
    addGameObject(go) {
        if (!go.uuid) {
            go.uuid = Util.uuid();
        }

        this.gameObjects.push(go);
    }

    loadBackground() {
        const randomBackIndex = Math.floor(Math.random() * AVAILABLE_BGS.length - 1) + 1;
        document.body.style.backgroundImage = 'url(images/bg/' + AVAILABLE_BGS[randomBackIndex] + ')'
    }

    initListeners() {
        window.addEventListener('resize', e => this.updateGameSize());

        document.addEventListener('keydown', e => {
            if (this.isBoundKey(e.code)) {
                this.pressingKeys[e.code] = true;
            }
        });

        document.addEventListener('keyup', e => {
            this.pressingKeys[e.code] = false;
        });

        setInterval(_ => {
            const pressingKeys = this.getPressingKeys();

            if (pressingKeys.length) {
                pressingKeys.forEach(code => this.player.handleCommand(code));
            } else {
                setTimeout(_ => this.player.stop(), 10);
            }
        }, 50);
    }

    updateGameSize() {
        this.areaSize = { width: window.innerWidth, height: window.innerHeight };
    }

    initGravity() {
        setInterval(_ => {
            if (!this.player.raising) {
                this.fall(this.player);
            }
        }, 50);
    }

    /** @param {GameObject} gameo */
    fall(gameObject) {
        gameObject.falling = true;

        let fallSpeed = 10;

        while (!this.outOfBoundsData(gameObject.potentialCoords({ y: -1 * fallSpeed++ }), gameObject.dimension)
            && !this.collides(gameObject.potentialCoords)) {
            gameObject.moveY(-1 * (fallSpeed));
        }

        gameObject.falling = false;
    }

    /** @param {GameObject} go */
    outOfBounds(go) {
        return this.outOfBoundsData(go.coords, go.dimension);
    }

    /**
     * @param {Coords} coords 
     * @param {Dimension} dimension 
     */
    outOfBoundsData(coords, dimension) {
        return coords.x < 0 || coords.x + dimension.width > this.areaSize.width
            || coords.y < 0 || coords.y + dimension.height > this.areaSize.height;
    }

    collides() {
        return false;
    }

    /**
     * @param {Coords} coords 
     * @param {Dimension} dimension 
     * @returns boolean
     */
    collidesData(uuid, coords, dimension) {
        return this.gameObjects.some(go => {
            if (go.uuid != uuid && Util.checkCollision(coords, dimension, go.coords, go.dimension)) {
                // ca déconne forcément vu que j'ai pas mis les mêmes unités -_- (% pour les walls, px pour le player ...)
                console.log('Collision found : ', go, uuid, coords, dimension);
                return true;
            }

            return false;
        });
    }

    getPressingKeys() {
        return Object.keys(this.pressingKeys).filter(x => this.pressingKeys[x]);
    }

    isBoundKey(keyCode) {
        return BOUND_KEYS.includes(keyCode);
    }

    /** @return {Game} */
    static getInstance() {
        return window.game;
    }
}
