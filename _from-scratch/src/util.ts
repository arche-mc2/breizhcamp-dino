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

    static distanceOnAxis(axisType: number, coords1: Coords, dim1: Dimension, coords2: Coords, dim2: Dimension) {
        return axisType === 0 ?
            this.distanceBetweenAxis(coords1.x, dim1.width, coords2.x, dim2.width) :
            this.distanceBetweenAxis(coords1.y, dim1.height, coords2.y, dim2.height);
    }

    static distanceBetweenAxis(pos: number, dim: number, pos2: number, dim2: number) {
        return Math.abs(pos < pos2 ? pos2 - (pos + dim) : pos - (pos2 + dim2));
    }

    static distanceBetween(coords1: Coords, dimension1: Dimension, coords2: Coords, dimension2: Dimension) {
        return Math.abs((coords1.x + dimension1.width) - (coords2.x + dimension2.width))
            + Math.abs((coords1.y + dimension1.height) - (coords2.y + dimension2.height));
    }
}
