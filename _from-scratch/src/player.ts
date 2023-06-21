import { GameObject } from './gameobject';

const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const FPS = 15;

export class Player extends GameObject {
    currentAnim: number = 0;
    /** @type {number} */
    spriteNumber = 0;

    dimension = { width: SPRITE_WIDTH, height: SPRITE_HEIGHT };

    canJump = true;

    animRunner: any; // setInterval() ref

    constructor() {
        super();

        // subject to gravity
        this.shouldFall = true;
    }

    display() {
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

    moveX(amount: number) {
        // l'afficher à l'envers, comme s'il partait sur la gauche
        this.el.classList.toggle('backward', amount < 0);

        this.playAnim(CharAnim.RUN);

        super.moveX(amount);
    }

    moveY(amount: number) {
        this.playAnim(CharAnim.RUN);

        super.moveY(amount);
    }

    stop() {
        this.playAnim(CharAnim.IDLE);
    }

    // @TODO: ca va pas, il faut interdire de sauter tant qu'on saute ET tant qu'on tombe, ce qui doit arriver tout de suite après
    // or pour l'instant on a la latence de la boucle principale qui permet un mini double saut ... (bref c'est moche et y'a trop d'attributs)
    // @TODO: maybe add a "onTheFloor" boolean to make sure we can jump ?
    jump() {
        console.log('CanJump ? Falling ? Coords !', this.canJump, this.falling, this.coords);

        if (!this.canJump || this.falling) {
            return;
        }

        this.canJump = false;

        let jumpSpeed = 30;

        // go high for a certain amount of time .. @TODO: replace with amount of space
        const jumpLoop = setInterval(_ => {
            if (this.canMove({ y: --jumpSpeed })) {
                this.moveY(jumpSpeed);
            }
        }, 30);

        setTimeout(() => {
            this.canJump = true;
            clearInterval(jumpLoop);
        }, 300);
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