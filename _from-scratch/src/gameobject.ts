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
            && !Game.getInstance().collidesData(this.uuid, potentialCoords, this.dimension);
    }

    render() {
        this.el.style.left = this.coords.x + 'px';
        this.el.style.bottom = this.coords.y + 'px';
    }

    abstract init(): void;
}

class Item {

}
