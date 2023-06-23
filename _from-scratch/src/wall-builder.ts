import { Game } from "./game";
import { Util } from "./util";
import { Wall } from "./wall";

export class WallBuilder {
    buildWalls(count: number): Wall[] {
        const walls = [this.generate()];

        for (let i = 1; i <= count; i++) {
            walls.push(this.nextWall(walls[i - 1]));
        }

        return walls;
    }

    nextWall(wall: Wall): Wall {
        return this.generate();
        let newWall = this.generate();

        // @TODO: distanceBetween must be more than x and  less than y
        while (true) {
            const distance = Util.distanceBetween(wall.coords, wall.dimension, newWall.coords, newWall.dimension);

            if (distance > 30 && distance < 100) {
                return newWall;
            }
        }
    }


    generate(maxHeight?: number) {
        const w = new Wall();

        w.blockCount = Util.rand(1, 15);

        const areaSize = Game.getInstance().areaSize;

        w.coords = {
            x: areaSize.width * Util.rand(10, 90) / 100,
            y: areaSize.height * Util.rand(10, maxHeight || 90) / 100
        };

        w.blockSize = Util.rand(15, 35);
        w.blockCount = Util.rand(1, 15);

        w.dimension = {
            width: w.blockCount * w.blockSize,
            height: w.blockSize
        };

        return w;
    }
}
