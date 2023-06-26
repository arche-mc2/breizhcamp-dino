import { BehaviorSubject, of } from "rxjs";

export class Anim {
    name: string;
    length: number;
    loopFrom: number;

    constructor(name: string, length: number, loopFrom?: number) {
        this.name = name;
        this.length = length;
        this.loopFrom = loopFrom;
    }

    // spriteOffsets: number[];
}

export enum CharAnim {
    IDLE = 0,
    CROUCH = 1,
    WALK = 2,
    JUMP = 3
};

export class AnimRunner {
    running: Anim;
    currentIndex: number;
    deltaSinceLastAnimRefresh = 0;

    anims: { [key in CharAnim]: Anim } = {
        [CharAnim.IDLE]: new Anim('idle', 4),
        [CharAnim.WALK]: new Anim('walk', 9),
        [CharAnim.CROUCH]: new Anim('crouch', 6, 4),
        [CharAnim.JUMP]: new Anim('jump', 13)
    };

    run(anim: Anim) {
        if (this.running === anim) {
            return;
        }

        this.currentIndex = 1;
        this.running = anim;
    }

    runIndex(name: CharAnim) {
        const anim = this.anims[name];

        if (anim) {
            this.run(anim);
        } else {
            throw new Error(`Anim not implemented : ${name}`);
        }
    }

    refresh(delta: number) {
        this.deltaSinceLastAnimRefresh += delta;

        if (this.deltaSinceLastAnimRefresh < 500 / this.running.length) {
            return null;
        }

        this.currentIndex++;
        this.deltaSinceLastAnimRefresh = 0;

        if (this.currentIndex > this.running.length) {
            this.currentIndex = this.running.loopFrom || 1;
        }

        return this.currentIndex;
    }
}
