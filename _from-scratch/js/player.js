import { GameObject } from './item.js';

const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const MOVE_PAD = 10; // distance in pixel of a single move
const FPS = 15;

export class Player extends GameObject {
    /** @type {HTMLDivElement} */
    el;
    /** @type {number} */
    currentAnim = 0;
    /** @type {number} */
    spriteNumber = 0;

    dimension = { width: SPRITE_WIDTH, height: SPRITE_HEIGHT };

    animRunner;

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

    playAnim(anim) {
        if (this.currentAnim === anim) {
            return;
        }

        if (this.animRunner) {
            clearInterval(this.animRunner);
        }

        this.currentAnim = anim;

        // this.animRunner = setInterval(_ => this.refreshSprite(), 800 / CharAnim.MAX[anim]);
    }

    handleCommand(keyCode) {
        if (keyCode === 'ArrowLeft') {
            this.moveX(-MOVE_PAD);
        } else if (keyCode === 'ArrowRight') {
            this.moveX(MOVE_PAD);
        } else if (keyCode === 'ArrowDown') {
            this.moveY(-MOVE_PAD);
        } else if (keyCode === 'ArrowUp') {
            this.moveY(MOVE_PAD);
        } else if (keyCode === 'Space') {
            this.jump();
        }
    }

    moveX(amount) {
        // l'afficher à l'envers, comme s'il partait sur la gauche
        this.el.classList.toggle('backward', amount < 0);

        this.playAnim(CharAnim.RUN);

        if (!super.moveX(amount)) {
            this.stop();
        }
    }

    moveY(amount) {
        this.playAnim(CharAnim.RUN);

        if (!super.moveY(amount)) {
            this.stop();
        }
    }

    stop() {
        this.playAnim(CharAnim.IDLE);
    }

    jump() {
        this.raising = true;

        const jumpLoop = setInterval(_ => this.moveY(MOVE_PAD), 30);

        setTimeout(_ => {
            this.raising = false;
            clearInterval(jumpLoop);
        }, 500);
    }

    updateCoords() {
        this.el.style.bottom = this.coords.y + 'px';
        this.el.style.left = this.coords.x + 'px';
    }

    refreshSprite() {
        if (this.spriteNumber > CharAnim.MAX[this.currentAnim] - 1) {
            this.spriteNumber = 0;
        }

        this.el.style.backgroundPositionX = -(this.spriteNumber++ * SPRITE_WIDTH) + 'px';
        this.el.style.backgroundPositionY = -(this.currentAnim * SPRITE_HEIGHT) + 'px';
    }
}

class CharAnim {
    static IDLE = 0;
    static FALL = 1;
    static RUN = 2;
    static JUMP = 3;

    static MAX = [5, 6, 9, 13];
}