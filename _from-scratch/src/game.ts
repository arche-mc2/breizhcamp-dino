import { Coords, Dimension, GameObject } from './gameobject';
import { CodeCoin, SpriteItem } from './item';
import { Player } from './player';
import { Util } from './util';
import { TerrainBuilder } from './terrain-builder';
import { Ui } from './ui';
import { tap, filter, takeWhile, timer } from 'rxjs';

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
    private pressingKeys: { [key: string]: boolean } = {};
    private gameObjects: GameObject[] = [];

    private _areaSize: Dimension;
    private _currentScore: number;

    private static _instance: Game;

    private timeLeft = 300;
    private timeOver = false;
    private paused = false;

    private ui: Ui;

    private terrainBuilder = new TerrainBuilder();

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

        this.terrainBuilder.buildWalls(7).forEach(wall => this.addGameObject(wall));

        this.terrainBuilder.spanwGoal();
        this.terrainBuilder.spawnCoins();

        this.initListeners();
        this.initUi();

        this.initTimer();

        return this;
    }

    // @TODO: make something smart, like we're always able to climb to the top :) (enoug platform and not too far away)
    // method like isReachable() ? based on a max jump / distance possible
    addWalls(count: number) {
        // Util.rangeArray(1, count).forEach(i => this.addGameObject(Wall.random((i + 1) * 30)));
    }

    addGameObject(go: GameObject, autoDisplay = true) {
        if (!go.uuid) {
            go.uuid = Util.uuid();
        }

        if (autoDisplay) {
            go.init();
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
            if (e.code === 'Escape') {
                this.handlePause();
                e.stopPropagation();
                return;
            }

            if (this.isBoundKey(e.code)) {
                this.pressingKeys[e.code] = true;
            }
        });

        document.addEventListener('keyup', e => {
            if (this.isBoundKey(e.code)) {
                this.pressingKeys[e.code] = false;
            }
        });
    }

    initUi() {
        this.ui = new Ui();

        this.updateScore(1000);
    }

    updateScore(score: number) {
        this.ui.refreshScore(score);
    }

    initTimer() {
        this.ui.refreshTime(this.timeLeft);

        // launch timer
        timer(1000, 1000).pipe(
            filter(() => !this.paused),
            tap(() => this.updateTime()),
            takeWhile(() => !this.timeOver)
        ).subscribe();
    }

    updateTime() {
        this.timeLeft--;
        this.ui.refreshTime(this.timeLeft);

        if (this.timeLeft <= 0) {
            this.timeOver = true;
            this.ui.openMenuDialog('Time oveeeeeeer :(');
        }
    }

    handlePause() {
        this.paused = !this.paused;

        if (this.paused) {
            this.ui.pause();
        } else {
            this.ui.unpause();
        }
    }

    handleCommand(keyCode: string) {
        const moveX = keyCode === 'ArrowLeft' ? -MOVE_PAD : (keyCode === 'ArrowRight' ? MOVE_PAD : null);

        if (moveX) {
            this.player.updateLookDirection(moveX < 0);
        }

        if (moveX && this.player.canMove({ x: moveX })) {
            this.player.moveX(moveX);
        } else if (keyCode === 'ArrowDown' && this.player.canMove({ y: -MOVE_PAD })) {
            this.player.moveY(-MOVE_PAD);
        }

        if (keyCode === 'Space' && this.player.canJump()) {
            this.player.initJump();
        }
    }

    updateGameSize() {
        this._areaSize = { width: window.innerWidth, height: window.innerHeight };
    }

    update() {
        if (this.paused || this.timeOver) {
            return;
        }

        const pressingKeys = this.getPressingKeys();

        if (pressingKeys.length) {
            pressingKeys.forEach(code => this.handleCommand(code));
        } else {
            // not the best place ?
            this.player.stop();
        }

        if (this.player.jumpSpeed > 0) {
            this.player.updateJump();
        }

        this.gameObjects.forEach(go => {
            if (go instanceof Player && go.jumpSpeed > 0) {
                // don't fall while jumping
                return;
            }

            if (go.shouldFall && go.canMove({ y: -MOVE_PAD })) {
                go.moveY(-MOVE_PAD);
            }
        });
    }

    render(delta?: number) {
        if (this.paused || this.timeOver) {
            return;
        }

        this.gameObjects.forEach(go => go.render(delta));
    }

    outOfBounds(go: GameObject) {
        return this.outOfBoundsData(go.coords, go.dimension);
    }

    outOfBoundsData(coords: Coords, dimension: Dimension) {
        return coords.x < 0 || coords.x + dimension.width > this.areaSize.width
            || coords.y < 0 || coords.y + dimension.height > this.areaSize.height;
    }

    /**
     * @param {Coords} coords
     * @param {Dimension} dimension
     * @returns boolean
     */
    collidesData(uuid: string, coords: Coords, dimension: Dimension) {
        return this.gameObjects.some(go => go.hasCollision && go.uuid != uuid && Util.checkCollision(coords, dimension, go.coords, go.dimension));
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

    getGameObjects() {
        return this.gameObjects;
    }

    get areaSize() {
        return this._areaSize;
    }

    get currentScore() {
        return this._currentScore;
    }
}
