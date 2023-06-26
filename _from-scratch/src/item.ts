import { GameObject } from "./gameobject";

export class Item extends GameObject {

    hasCollision = false;

    init(): void {
        this.el = document.createElement('div');
        this.el.classList.add('item');

        if (this.className) {
            this.el.classList.add(this.className);
        }

        if (this.dimension) {
            this.el.style.width = this.dimension.width + 'px';
            this.el.style.height = this.dimension.height + 'px';
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

        this.imgPath = 'images/code-coin.png';
        this.className = 'code-coin';
    }
}

export class ArcheGoal extends SpriteItem {
    constructor(name?: string) {
        super(name || 'arche-logo');

        this.imgPath = 'images/building-arche-glow.png';
    }
}
