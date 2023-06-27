import { Coords, Dimension, GameObject } from './gameobject';
import { CodeCoin } from './item';
import { Player } from './player';
import { Util } from './util';
import { TerrainBuilder } from './terrain-builder';
import { Ui } from './ui';
import { tap, filter, takeWhile, timer } from 'rxjs';
import { SoundManager } from './sound-manager';
import { Level } from './level';

const BOUND_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'];

export const MOVE_PAD = 5; // distance in pixel of a single move
export const FALL_PAD = 5;

const INITIAL_TIMER = 30;

const PLAYER_KEY = "current-player";

export class Game {
    private player: Player;
    private level: Level;

    private pressingKeys: { [key: string]: boolean } = {};
    // private gameObjects: GameObject[] = [];

    private _areaSize: Dimension;
    private currentScore: number;
    private currentLevelNumber = 1;

    private static _instance: Game;

    private timeLeft = INITIAL_TIMER;
    private timeOver = false;
    private paused = false;

    private ui: Ui;

    private terrainBuilder = new TerrainBuilder();
    private soundManager = new SoundManager();

    constructor() {
    }

    static new() {
        this._instance = new Game();
        return this._instance;
    }

    start() {
        this.computeAreaSize();
        this.initUi();

        this.player = new Player();

        this.nextLevel();

        this.initListeners();
        this.initTimer();

        return this;
    }

    initListeners() {
        window.addEventListener('resize', e => this.computeAreaSize());

        document.addEventListener('keydown', e => {
            if (e.code === 'Escape' && !this.timeOver) {
                this.handlePause();
                e.stopPropagation();
                return;
            }

            if (this.paused) {
                return;
            }

            if (e.key === 'w') {
                const newWall = this.terrainBuilder.generate();
                newWall.blockCount = 3;
                newWall.computeDimension();

                const adjustCoords = this.player.inFrontOf();
                if (this.player.lookLeft) {
                    adjustCoords.x -= newWall.dimension.width;
                }
                newWall.coords = adjustCoords;

                this.level.addGameObject(newWall);
            }

            if (this.isBoundKey(e.code)) {
                this.pressingKeys[e.code] = true;
            }
        });

        document.addEventListener('keyup', e => {
            if (this.isBoundKey(e.code)) {
                this.pressingKeys[e.code] = false;
            }

            if (e.code === 'ArrowDown') {
                this.player.uncrouch();
            }
        });
    }

    initUi() {
        this.ui = new Ui();

        this.updateScore(0);
        this.ui.loadHighscores();
    }

    updateScore(score: number) {
        this.currentScore = score;
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
            this.ui.openTimeOverDialog(this.currentScore, this.currentLevelNumber);
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
        } else if (keyCode === 'ArrowDown') {
            this.player.crouch();

            if (this.player.canMove({ y: -MOVE_PAD })) {
                this.player.moveY(-MOVE_PAD);
            }
        }

        if (keyCode === 'ArrowUp' && this.hitsAny(this.player, [this.level.archeGoal])) {
            this.onReachGoal();
        }

        if (keyCode === 'Space' && this.player.canJump()) {
            this.player.initJump();
        }
    }

    onReachGoal() {
        this.nextLevel();
    }

    nextLevel() {
        if (this.level) {
            this.level.delete();
            this.currentLevelNumber++;
        }

        this.ui.refreshLevel(this.currentLevelNumber);
        this.level = new Level();
        this.level.generate();
        this.level.addGameObject(this.player);

        this.resetLevel();
    }

    resetLevel() {
        this.timeLeft = INITIAL_TIMER - (this.currentLevelNumber - 1);
        this.player.coords = { x: 0, y: 0 };
    }

    computeAreaSize() {
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
            this.player.idle();
        }

        if (this.player.jumpSpeed > 0) {
            this.player.updateJump();
        } else if (this.player.canMove({ y: -FALL_PAD })) {
            this.player.moveY(-FALL_PAD);
        }

        const touchCoin = this.hitsAny(this.player, this.level.codeCoins);

        if (touchCoin) {
            this.onCollectCoin(touchCoin as CodeCoin);
        }
    }

    onCollectCoin(coin: CodeCoin) {
        this.soundManager.playCoin();
        this.updateScore(this.currentScore + 1000);
        this.level.removeGameObject(coin);
    }

    render(delta?: number) {
        if (this.paused || this.timeOver) {
            return;
        }

        this.level.gameObjects.forEach(go => go.render(delta));
    }

    outOfBounds(go: GameObject) {
        return this.outOfBoundsData(go.coords, go.dimension);
    }

    outOfBoundsData(coords: Coords, dimension: Dimension) {
        return coords.x < 0 || coords.x + dimension.width > this.areaSize.width
            || coords.y < 0 || coords.y + dimension.height > this.areaSize.height;
    }

    hitsCollision(obj: GameObject, newCoords: Coords) {
        return this.level.gameObjects.find(go =>
            go.uuid != obj.uuid && go.hasCollision
            && Util.checkCollision(newCoords, obj.dimension, go.coords, go.dimension)
        );
    }

    hitsAny(obj: GameObject, others: GameObject[]) {
        return others.find(go => go.uuid != obj.uuid && Util.checkCollision(obj.coords, obj.dimension, go.coords, go.dimension));
    }

    getPressingKeys() {
        return Object.keys(this.pressingKeys).filter(x => this.pressingKeys[x]);
    }

    isBoundKey(keyCode: string) {
        return BOUND_KEYS.includes(keyCode);
    }

    addGameObject(go: GameObject) {
        this.level.addGameObject(go);
    }

    /** @return {Game} */
    static getInstance() {
        return this._instance;
    }

    get areaSize() {
        return this._areaSize;
    }

    get currentLvl() {
        return this.level;
    }
}
