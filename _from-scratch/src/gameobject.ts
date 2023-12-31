import { Subject } from "rxjs";
import { Game } from "./game";
import { Util } from "./util";

export class Coords {
    x?: number;
    y?: number;
}

export class Dimension {
    width: number;
    height: number;
}

export abstract class GameObject {
    protected el: HTMLElement;

    name?: string;
    className?: string;

    uuid: string;
    dimension: Dimension;
    coords: Coords = { x: 0, y: 0 };

    // subject to gravity
    hasGravity = false;
    falling = false;
    // must handle collision
    hasCollision = true;

    constructor(name?: string) {
        this.name = name;
    }

    potentialCoords(coords: Coords) {
        return {
            x: this.coords.x + (coords.x || 0),
            y: this.coords.y + (coords.y || 0)
        };
    }

    moveX(amount: number, to = false) {
        if (to) {
            this.coords.x = amount;
        } else {
            this.coords.x += amount;
        }
    }

    moveY(amount: number) {
        this.coords.y += amount;
    }

    addClassName(name: string) {
        this.className = name;
        return this;
    }

    // getMaxMoveX(move: number) {
    //     return Math.min(
    //         // compare to screen
    //         Game.getInstance().distanceBeforeScreenLimit(this.coords.x, move, this.dimension),
    //         Game.getInstance().distanceFromObstacle(this.uuid, this.coords.x, move, this.dimension)
    //     );
    // }

    // getMaxMoveY(move: number) {

    // }

    // @TODO: change this to get max move left before collision ? :)
    canMove(move: Coords) {
        const potentialCoords = this.potentialCoords(move);

        return !Game.getInstance().outOfBoundsData(potentialCoords, this.dimension)
            && !Game.getInstance().hitsCollision(this, potentialCoords);
    }

    render(delta?: number) {
        this.el.style.left = this.coords.x + 'px';
        this.el.style.bottom = this.coords.y + 'px';
    }

    setDimension(dim: Dimension) {
        this.dimension = dim;
        return this;
    }

    setCoords(coords: Coords) {
        this.coords = coords;
        return this;
    }

    abstract init(): void;

    delete() {
        document.body.removeChild(this.el);
    }

    left() {
        return { x: this.coords.x - 1, y: this.coords.y };
    }

    right() {
        return { x: this.coords.x + this.dimension.width, y: this.coords.y };
    }

    below() {
        return { x: this.coords.x, y: this.coords.y - 1 };
    }

    above() {
        return { x: this.coords.x, y: this.coords.y + this.dimension.height };
    }
}