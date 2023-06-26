import { distinct, distinctUntilChanged } from 'rxjs';
import { Anim, AnimRunner, CharAnim } from './anim';
import { MOVE_PAD } from './game';
import { GameObject } from './gameobject';

const SPRITE_WIDTH = 80;
const SPRITE_HEIGHT = 80;
const FPS = 15;
const MAX_JUMP_HEIGHT = 300;

export class Player extends GameObject {
    currentAnim: number;

    deltaSinceLastAnimRefresh = 0;

    dimension = { width: SPRITE_WIDTH, height: SPRITE_HEIGHT };

    animRunner = new AnimRunner();

    lookLeft = false; // replace with look direction ;o

    spriteEl: HTMLImageElement;

    jumpHeight: number;
    jumpSpeed: number;

    constructor() {
        super();

        // subject to gravity
        this.shouldFall = true;
    }

    init() {
        this.el = this.createElement();

        this.spriteEl = document.createElement('img');
        this.el.appendChild(this.spriteEl);

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

    playAnim(anim: CharAnim | Anim) {
        if (anim instanceof Anim) {
            this.animRunner.run(anim);
        } else {
            this.animRunner.runIndex(anim);
        }
    }

    moveX(amount: number, to = false) {
        this.playAnim(CharAnim.WALK);

        super.moveX(amount, to);
    }

    moveY(amount: number) {
        // this.playAnim(CharAnim.WALK);

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
        return (!this.jumpSpeed || this.jumpSpeed <= 0) && !this.canMove({ y: -MOVE_PAD });
    }

    updateJump() {
        this.jumpHeight += this.jumpSpeed;

        if (this.jumpHeight > MAX_JUMP_HEIGHT) {
            this.jumpHeight = MAX_JUMP_HEIGHT;
        }

        if (this.canMove({ y: this.jumpSpeed })) {
            this.moveY(this.jumpSpeed);
        }

        this.jumpSpeed -= 2;
    }

    initJump() {
        this.jumpHeight = 0;
        this.jumpSpeed = 30;

        // this.playAnim(CharAnim.JUMP);
    }

    refreshSprite(delta?: number) {
        const index = this.animRunner.refresh(delta);

        if (index) {
            this.spriteEl.src = `images/sprites/${this.animRunner.running.name}/${index}.avif`;
        }
    }

    render(delta?: number) {
        super.render();

        // huhuuuuuuuu
        this.refreshSprite(delta);
    }
}
