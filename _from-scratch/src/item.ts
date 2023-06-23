import { Game } from "./game";
import { GameObject } from "./gameobject";

export class Item extends GameObject {

    imgPath?: string;

    init(): void {
        this.el = document.createElement('div');
        this.el.classList.add('item');

        if (this.imgPath) {
            const img = document.createElement('img');
            img.src = this.imgPath;
            this.el.appendChild(img);
        }

        document.body.appendChild(this.el);

        // @TODO: change all units to "blocks", only translate these when rendering (or not, simply using vh / vw)
        this.coords = {x: Game.getInstance().areaSize.width - 150, y: Game.getInstance().areaSize.height - 150};
        this.dimension = {width: 100, height: 100};
    }
}
