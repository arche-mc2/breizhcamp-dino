import { Coords, Dimension, GameObject } from './gameobject';
import { Player } from './player';
import { Util } from './util';
import { Wall } from './wall';

const BOUND_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'];

export const MOVE_PAD = 5; // distance in pixel of a single move

const AVAILABLE_BGS = [
    'gta.jpg',
    'pokemon.webp',
    'pokemon-2.jfif',
    'dinan.png',
    'st-malo.jpg_large',
    'new-york.jpg',
    'tokyo.jpg',
    'jurassic-park-1.jpg',
    'jurassic-park-2.jpg',
    'jurassic-park-3.jpg'
];

export class Game {
    private player: Player;
    private pressingKeys: {[key: string]: boolean} = {};
    private gameObjects: GameObject[] = [];
    private _areaSize: Dimension;

    private static _instance: Game;

    constructor() {
    }

    static new() {
        this._instance = new Game();
        return this._instance;
    }

    start() {
        this.loadBackground();
        this.updateGameSize();

        this.player = new Player();
        this.addGameObject(this.player);

        this.addWalls(3);

        this.initGravity();
        this.initListeners();

        return this;
    }

    // @TODO: make something smart, like we're always able to climb to the top :) (enoug platform and not too far away)
    // method like isReachable() ? based on a max jump / distance possible
    addWalls(count: number) {
        Util.rangeArray(1, count).forEach(i => this.addGameObject(Wall.random((i + 1) * 30)));
    }

    addGameObject(go: GameObject, autoDisplay = true) {
        if (!go.uuid) {
            go.uuid = Util.uuid();
        }

        if (autoDisplay) {
            go.display();
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

        setInterval(() => {
            const pressingKeys = this.getPressingKeys();

            if (pressingKeys.length) {
                pressingKeys.forEach(code => this.handleCommand(code));
            } else {
                setTimeout(() => this.player.stop(), 10);
            }
        }, 15);
    }

    handleCommand(keyCode: string) {
        const moveX = keyCode === 'ArrowLeft' ? -MOVE_PAD : (keyCode === 'ArrowRight' ? MOVE_PAD : null);

        if (moveX && this.player.canMove({ x: moveX })) {
            this.player.moveX(moveX);
        } else if (keyCode === 'ArrowDown' && this.player.canMove({ y: -MOVE_PAD })) {
            this.player.moveY(-MOVE_PAD);
        }

        if (keyCode === 'Space') {
            this.player.jump();
        }
    }

    updateGameSize() {
        this._areaSize = { width: window.innerWidth, height: window.innerHeight };
    }

    // @TODO: place in a global main loop ?
    initGravity() {
        setInterval(() => {
            this.gameObjects.filter(go => go.shouldFall && !go.falling).forEach(go => go.fall());
        }, 100);
    }

    outOfBounds(go: GameObject) {
        return this.outOfBoundsData(go.coords, go.dimension);
    }

    outOfBoundsData(coords: Coords, dimension: Dimension) {
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
    collidesData(uuid: string, coords: Coords, dimension: Dimension) {
        return this.gameObjects.some(go => {
            if (go.uuid != uuid && Util.checkCollision(coords, dimension, go.coords, go.dimension)) {
                console.log('Collision found : ', coords, dimension, go, uuid);
                return true;
            }

            return false;
        });
    }

    getPressingKeys() {
        return Object.keys(this.pressingKeys).filter(x => this.pressingKeys[x]);
    }

    isBoundKey(keyCode: string) {
        return BOUND_KEYS.includes(keyCode);
    }

    /** @return {Game} */
    static getInstance() {
        return this._instance;
    }

    get areaSize() {
        return this._areaSize;
    }
}
