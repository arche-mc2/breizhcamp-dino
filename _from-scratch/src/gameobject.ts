import { Game, MOVE_PAD } from "./game";

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

    uuid: string;
    dimension: Dimension;
    coords: Coords = { x: 0, y: 0 };

    // subject to gravity
    shouldFall = false;
    falling = false;
    // must handle collision
    hasCollision = true;

    potentialCoords(coords: Coords) {
        return {
            x: this.coords.x + (coords.x || 0),
            y: this.coords.y + (coords.y || 0)
        };
    }

    updateCoords() {
        this.el.style.bottom = this.coords.y + 'px';
        this.el.style.left = this.coords.x + 'px';
    }

    moveX(amount: number) {
        this.coords.x += amount;
        this.updateCoords();
    }

    moveY(amount: number) {
        this.coords.y += amount;
        this.updateCoords();
    }

    // @TODO: change this to get max move left before collision ? :)
    canMove(coords: Coords) {
        const potentialCoords = this.potentialCoords(coords);

        return !Game.getInstance().outOfBoundsData(potentialCoords, this.dimension)
            && !Game.getInstance().collidesData(this.uuid, potentialCoords, this.dimension);
    }

    // @TODO: change this & jump to have a decreasing speed (effect of gravity = faster when fall, slower when jump)
    fall() {
        if (!this.shouldFall || this.falling) {
            return;
        }

        this.falling = true;

        const fallLoop = setInterval(_ => {
            if (this.canMove({ y: -MOVE_PAD })) {
                this.moveY(-MOVE_PAD);
            } else {
                this.falling = false;
                clearInterval(fallLoop);
            }
        }, 15);
    }

    abstract display(): void;
}

class Item {

}