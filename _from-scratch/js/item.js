import { Game, MOVE_PAD } from "./game.js";

export class Coords {
    /** @type {number} */
    x;
    /** @type {number} */
    y;
}

export class Dimension {
    /** @type {number} */
    width;
    /** @type {number} */
    height;
}

export class GameObject {
    /** @type {string} */
    uuid;
    /** @type {Dimension} */
    dimension;
    /** @type {Coords} */
    coords = { x: 0, y: 0 };

    // subject to gravity
    shouldFall = false;
    falling = false;
    // must handle collision
    hasCollision = true;

    potentialCoords(coords) {
        return {
            x: this.coords.x + (coords.x || 0),
            y: this.coords.y + (coords.y || 0)
        };
    }

    /** @param {number} amount */
    moveX(amount) {
        this.coords.x += amount;
        this.updateCoords();
    }

    /** @param {number} amount */
    moveY(amount) {
        this.coords.y += amount;
        this.updateCoords();
    }

    // @TODO: change this to get max move left before collision ? :)
    canMove(coords) {
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
}

class Item {

}
