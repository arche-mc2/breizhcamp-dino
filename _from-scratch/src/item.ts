import { Game } from "./game";
import { GameObject } from "./gameobject";

export class Item extends GameObject {

    hasCollision = false;

    init(): void {
        this.el = document.createElement('div');
        this.el.classList.add('item');

        if (this.className) {
            this.el.classList.add(this.className);
        }

        document.body.appendChild(this.el);
    }
}

export class SpriteItem extends Item {

    protected imgPath: string;

    init() {
        super.init();

        if (this.imgPath) {
            const img = document.createElement('img');
            img.src = this.imgPath;
            this.el.appendChild(img);
        }

        return this;
    }

    setImgPath(path: string) {
        this.imgPath = path;
        return this;
    }
}

export class CodeCoin extends SpriteItem {
    constructor(name?: string) {
        super(name);

        this.imgPath = 'images/logo-code.png';
        this.className = 'code-coin';
    }
}

export class ArcheGoal extends SpriteItem {
    constructor(name?: string) {
        super(name || 'arche-logo');

        this.imgPath = 'images/arche-logo.png';
    }
}
