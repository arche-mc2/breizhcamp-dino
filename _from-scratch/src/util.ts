import { Coords, Dimension } from "./gameobject";

export class Util {
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    */
    static rand(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static rangeArray(min: number, max: number) {
        return Array.from(Array(max - min + 1).keys()).map(i => i + min);
    }

    static uuid() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    static checkCollision(coords1: Coords, dimension1: Dimension, coords2: Coords, dimension2: Dimension) {
        return this.checkPointCollides(coords1.x, coords1.x + dimension1.width, coords2.x, coords2.x + dimension2.width)
            && this.checkPointCollides(coords1.y, coords1.y + dimension1.height, coords2.y, coords2.y + dimension2.height);
    }

    static checkPointCollides(start1: number, end1: number, start2: number, end2: number) {
        return (start1 > start2 && start1 < end2)
            || (start2 > start1 && start2 < end1);
    }
}
