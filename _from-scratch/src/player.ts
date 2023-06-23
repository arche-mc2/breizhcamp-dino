import { Anim } from './anim';
import { MOVE_PAD } from './game';
import { GameObject } from './gameobject';

const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const FPS = 15;
const MAX_JUMP_HEIGHT = 300;

export class Player extends GameObject {
    currentAnim: number
    
    /** @type {number} */
    spriteNumber = 0;

    deltaSinceLastAnimRefresh = 0;

    dimension = { width: SPRITE_WIDTH, height: SPRITE_HEIGHT };

    animRunner: any; // setInterval() ref

    lookLeft = false; // replace with look direction ;o

    jumpHeight: number;
    jumpSpeed: number;

    constructor() {
        super();

        // subject to gravity
        this.shouldFall = true;
    }

    init() {
        this.el = this.createElement();
        document.body.appendChild(this.el);

        this.idle();

        return this;
    }

    createElement() {
        const el = document.createElement('div');
        el.classList.add('player');

        return el;
    }

    idle() {
        this.playAnim(CharAnim.IDLE);
    }

    playAnim(anim: number) {
        if (this.currentAnim === anim) {
            return;
        }

        if (this.animRunner) {
            clearInterval(this.animRunner);
        }

        this.currentAnim = anim;

        // this.animRunner = setInterval(_ => this.refreshSprite(), 800 / CharAnim.MAX[anim]);
    }

    moveX(amount: number, to = false) {
        this.playAnim(CharAnim.RUN);

        super.moveX(amount, to);
    }

    moveY(amount: number) {
        this.playAnim(CharAnim.RUN);

        super.moveY(amount);
    }

    stop() {
        this.playAnim(CharAnim.IDLE);
    }

    updateLookDirection(lookLeft: boolean) {
        this.lookLeft = lookLeft;

        this.el.classList.toggle('backward', lookLeft);
    }

    canJump() {
        // not jumping already, and we're on the floor
        return (!this.jumpSpeed || this.jumpSpeed <= 0) && !this.canMove({y: -MOVE_PAD});
    }

    updateJump() {
        this.jumpHeight += this.jumpSpeed;

        if (this.jumpHeight > MAX_JUMP_HEIGHT) {
            this.jumpHeight = MAX_JUMP_HEIGHT;
        }

        if (this.canMove({y: this.jumpSpeed})) {
            this.moveY(this.jumpSpeed);
        }
        
        this.jumpSpeed -= 2;
    }

    initJump() {
        this.jumpHeight = 0;
        this.jumpSpeed = 30;
    }

    refreshSprite(delta?: number) {
        this.deltaSinceLastAnimRefresh += delta;

        if (this.deltaSinceLastAnimRefresh < 500 / CharAnim.MAX[this.currentAnim]) {
            return;
        }

        this.deltaSinceLastAnimRefresh = 0;

        if (this.spriteNumber > CharAnim.MAX[this.currentAnim] - 1) {
            this.spriteNumber = 0;
        }

        this.el.style.backgroundPositionX = -(this.spriteNumber++ * SPRITE_WIDTH) + 'px';
        this.el.style.backgroundPositionY = -(this.currentAnim * SPRITE_HEIGHT) + 'px';
    }

    render(delta?: number) {
        super.render();

        // huhuuuuuuuu
        this.refreshSprite(delta);
    }
}

class CharAnim {
    static IDLE = 0;
    static FALL = 1;
    static RUN = 2;
    static JUMP = 3;

    static MAX = [5, 6, 9, 13];
}