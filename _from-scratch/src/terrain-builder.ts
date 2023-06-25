import { Game } from "./game";
import { SpriteItem } from "./item";
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

        w.dimension = {
            width: w.blockCount * w.blockSize,
            height: w.blockSize
        };

        return w;
    }

    spawnCoins() {
        this.getGroundAndWalls().forEach(wall => {
            const coin = new SpriteItem()
                .setImgPath('images/logo-code.png')
                .addClassName('code-coin')
                .setCoords({ x: wall.coords.x + wall.dimension.width / 2, y: wall.coords.y + 30 })
                .setDimension({ width: 30, height: 30 });

            Game.getInstance().addGameObject(coin);
        });
    }

    spanwGoal() {
        const game = Game.getInstance();
        
        console.log('Area size : ', game.areaSize);

        setTimeout(() => {
            const archeLogo = new SpriteItem('arche-logo')
                .setImgPath('images/arche-logo.png')
                .setDimension({ width: 100, height: 100 })
                .setCoords({ x: game.areaSize.width - 120, y: game.areaSize.height - 120 });

            Game.getInstance().addGameObject(archeLogo);
        }, 100);
    }

    getGroundAndWalls() {
        return Game.getInstance().getGameObjects().filter(go => go instanceof Wall);
    }
}