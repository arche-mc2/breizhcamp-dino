import { Game } from './game';
import { GameObject } from './gameobject';
import { Util } from './util';

const BLOCK_COLORS = ['cyan', 'magenta', 'pink', 'turquoise', 'purple']; // etc, we want shiny colors :)

export class Wall extends GameObject {

    blockCount: number;

    orientation = 0; // 0: horizontal, 1: vertical

    display() {
        const el = document.createElement('div');
        el.classList.add('wall');

        const squareDim = Util.rand(1, 3) * 10;

        for (let i = 0; i < this.blockCount; i++) {
            const wallBlock = document.createElement('div');
            wallBlock.style.backgroundColor = BLOCK_COLORS[Util.rand(1, BLOCK_COLORS.length) - 1];
            wallBlock.style.width = squareDim + 'px';
            el.appendChild(wallBlock);
        }

        el.style.height = squareDim + 'px';
        el.style.bottom = this.coords.y + 'px';
        el.style.left = this.coords.x + 'px';

        document.body.appendChild(el);

        setTimeout(() => this.dimension = { width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height });

        return el;
    }

    static random(maxHeight?: number) {
        const w = new Wall();

        w.blockCount = Util.rand(1, 10);

        const areaSize = Game.getInstance().areaSize;

        w.coords = {
            x: areaSize.width * Util.rand(10, 90) / 100,
            y: areaSize.height * Util.rand(10, maxHeight || 90) / 100
        };

        return w;
    }
}
