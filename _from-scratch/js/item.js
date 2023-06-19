import { Game } from "./game.js";

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
    coords = { x: 0, y: 0 }

    potentialCoords(coords) {
        return {
            x: this.coords.x + coords.x || 0,
            y: this.coords.y + coords.y || 0
        };
    }

    moveX(amount) {
        const potentialCoords = this.potentialCoords({ x: amount });

        if (Game.getInstance().outOfBoundsData(this.uuid, potentialCoords, this.dimension)
            || Game.getInstance().collidesData(this.uuid, potentialCoords, this.dimension)
        ) {
            return false;
        }

        this.coords.x += amount;
        this.updateCoords();

        return true;
    }

    /** @param {number} amount */
    moveY(amount) {
        const potentialCoords = this.potentialCoords({ y: amount });

        if (Game.getInstance().outOfBoundsData(this.uuid, potentialCoords, this.dimension)
            || Game.getInstance().collidesData(this.uuid, potentialCoords, this.dimension)
        ) {
            return false;
        }

        this.coords.y += amount;
        this.updateCoords();

        return true;
    }
}

class Item {

}
