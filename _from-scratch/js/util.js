import { Coords, Dimension } from "./item.js";

export class Util {
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    */
    static rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static uuid() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * 
     * @param {Coords} coords1
     * @param {Dimension} dimension1
     * @param {Coords} coords2
     * @param {Dimension} dimension2
     * @returns boolean
     */
    static checkCollision(coords1, dimension1, coords2, dimension2) {
        return this.checkPointCollides(coords1.x, coords1.x + dimension1.width, coords2.x, coords2.x + dimension2.width)
            && this.checkPointCollides(coords1.y, coords1.y + dimension1.height, coords2.y, coords2.y + dimension2.height);
        // return coords1.x + dimension1.width >= coords2.x && coords1.x <= coords2.x + dimension2.width
        //     && coords1.y + dimension1.height >= coords2.y && coords1.y <= coords2.y + dimension2.height;
    }

    static checkPointCollides(start1, end1, start2, end2) {
        return (start1 > start2 && start1 < end2)
            || (start2 > start1 && start2 < end1);
    }
}
