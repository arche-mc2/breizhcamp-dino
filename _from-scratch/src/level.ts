import { GameObject } from "./gameobject";
import { ArcheGoal, CodeCoin } from "./item";
import { Player } from "./player";
import { TerrainBuilder } from "./terrain-builder";
import { Util } from "./util";
import { Wall } from "./wall";

const AVAILABLE_BGS = [
    'gta.jpg',
    'pokemon.webp',
    'pokemon-2.jfif',
    'dinan.png',
    'st-malo.jpg_large',
    'tokyo.jpg',
    'jurassic-park-1.jpg',
    'jurassic-park-2.jpg',
    'jurassic-park-3.jpg',
    'dino-world.jpg',
    'flat-level-trees.svg',
    'retro.jpg' // would need a size: contain attribute !
];

export class Level {

    terrainBuilder = new TerrainBuilder();
    gameObjects: GameObject[] = [];

    archeGoal: ArcheGoal;
    codeCoins: CodeCoin[];
    groundAndWalls: Wall[];

    generate() {
        this.loadBackground();

        this.terrainBuilder.buildWalls(7).forEach(wall => this.addGameObject(wall));

        this.terrainBuilder.spanwGoal();
        this.terrainBuilder.spawnCoins();
    }

    loadBackground() {
        const randomBackIndex = Math.floor(Math.random() * AVAILABLE_BGS.length - 1) + 1;
        document.body.style.backgroundImage = 'url(images/bg/' + AVAILABLE_BGS[randomBackIndex] + ')'
    }

    addGameObject(go: GameObject, autoDisplay = true) {
        if (!go.uuid) {
            go.uuid = Util.uuid();
        }

        if (autoDisplay) {
            go.init();
        }

        this.gameObjects.push(go);

        this.refreshObjectCollections();
    }

    removeGameObject(obj: GameObject) {
        this.gameObjects.splice(this.gameObjects.indexOf(obj), 1);
        obj.delete();

        this.refreshObjectCollections();
    }

    refreshObjectCollections() {
        this.archeGoal = this.gameObjects.find(go => go instanceof ArcheGoal) as ArcheGoal;
        this.codeCoins = this.gameObjects.filter(go => go instanceof CodeCoin) as CodeCoin[];
        this.groundAndWalls = this.gameObjects.filter(go => go instanceof Wall) as Wall[];
    }

    delete() {
        this.gameObjects.forEach(go => go.delete());
    }
}
