const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const MOVE_PAD = 10;
const FPS = 15;

export class Player {
    /** @type {{x: number, y: number}} */
    coords = { x: 0, y: 0 };
    /** @type {HTMLDivElement} */
    el;
    /** @type {number} */
    currentAnim = 0;
    /** @type {number} */
    spriteNumber = 0;

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
        if (this.animRunner) {
            clearInterval(this.animRunner);
        }
        
        this.currentAnim = anim;

        this.animRunner = setInterval(_ => this.refreshSprite(), 1000 / CharAnim.MAX[anim]);
    }

    handleCommand(keyCode) {
        if (keyCode === 'ArrowLeft') {
            this.moveX(-MOVE_PAD);
        } else if (keyCode === 'ArrowRight') {
            this.moveX(MOVE_PAD);
        } else if (keyCode === 'ArrowDown') {
            this.moveY(MOVE_PAD);
        } else if (keyCode === 'ArrowUp') {
            this.moveY(-MOVE_PAD);
        }
    }

    moveX(amount) {
        this.coords.x += amount;

        // l'afficher à l'envers, comme s'il partait sur la gauche
        this.el.classList.toggle('backward', amount < 0);

        this.updateCoords();

        this.playAnim(CharAnim.RUN);
    }

    moveY(amount) {
        this.coords.y += amount;

        this.updateCoords();
        
        this.playAnim(CharAnim.RUN);
    }

    updateCoords() {
        this.el.style.top = this.coords.y + 'px';
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