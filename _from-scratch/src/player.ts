import { Anim, AnimRunner, CharAnim } from './anim';
import { FALL_PAD } from './game';
import { GameObject } from './gameobject';

const SPRITE_WIDTH = 80;
const SPRITE_HEIGHT = 80;
const FPS = 15;
const MAX_JUMP_HEIGHT = 300;

export class Player extends GameObject {
    currentAnim: number;

    deltaSinceLastAnimRefresh = 0;

    animRunner = new AnimRunner();

    lookLeft = false; // replace with look direction ;o

    spriteEl: HTMLImageElement;

    jumpHeight: number;
    jumpSpeed: number;

    crouched = false;

    constructor() {
        super();

        this.resetDimension();

        // subject to gravity
        this.hasGravity = true;
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

    resetDimension() {        
        this.dimension = { width: SPRITE_WIDTH, height: SPRITE_HEIGHT };
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
        if (!this.crouched) {
            this.playAnim(CharAnim.WALK);
        }

        super.moveX(amount, to);
    }

    moveY(amount: number) {
        // this.playAnim(CharAnim.WALK);

        super.moveY(amount);
    }

    updateLookDirection(lookLeft: boolean) {
        this.lookLeft = lookLeft;

        this.el.classList.toggle('backward', lookLeft);
    }

    canJump() {
        // not jumping already, and we're on the floor
        return (!this.jumpSpeed || this.jumpSpeed <= 0) && !this.canMove({ y: -FALL_PAD });
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

    crouch() {
        if (!this.crouched) {
            this.crouched = true;
            this.dimension = { width: 85, height: 60 };
            this.playAnim(CharAnim.CROUCH);
            this.el.classList.add('crouch');
        }
    }

    uncrouch() {
        this.crouched = false;
        this.resetDimension();
        this.idle();
        this.el.classList.remove('crouch');
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

    inFrontOf() {
        return this.lookLeft ? this.left() : this.right();
    }
}
