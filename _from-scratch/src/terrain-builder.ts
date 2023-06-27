import { Game } from "./game";
import { Dimension } from "./gameobject";
import { ArcheGoal, CodeCoin } from "./item";
import { Util } from "./util";
import { Wall } from "./wall";

export class TerrainBuilder {
    buildGround() {

    }

    buildWalls(count: number): Wall[] {
        const walls = [this.generate()];

        for (let i = 1; i <= count; i++) {
            walls.push(this.nextWall(walls[i - 1]));
        }

        return walls;
    }

    // @TODO: make something smart, like we're always able to climb to the top :) (enough platform and not too far away)
    // method like isReachable() ? based on a max jump / distance possible
    nextWall(fromWall: Wall): Wall {
        const newWall = this.generate();
        console.log('Next wall : ', newWall);
        return newWall;
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

        w.computeDimension();

        return w;
    }

    spawnCoins() {
        this.getGroundAndWalls().forEach(wall => {
            const coin = new CodeCoin()
                .setCoords({ x: wall.coords.x + wall.dimension.width / 2, y: wall.coords.y + 30 })
                .setDimension({ width: 30, height: 30 });

            Game.getInstance().addGameObject(coin);
        });
    }

    spanwGoal() {
        const game = Game.getInstance();

        const dims = {width: 300, height: 180} as Dimension;

        const archeLogo = new ArcheGoal()
            .setDimension(dims)
            .setCoords({ x: game.areaSize.width - dims.width, y: game.areaSize.height - dims.height - (game.areaSize.height * .05) });

        Game.getInstance().addGameObject(archeLogo);
    }

    getGroundAndWalls() {
        return Game.getInstance().currentLvl.groundAndWalls;
    }
}
