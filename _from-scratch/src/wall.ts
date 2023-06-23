import { Game } from './game';
import { GameObject } from './gameobject';
import { Util } from './util';

const BLOCK_COLORS = ['cyan', 'magenta', 'pink', 'turquoise', 'purple']; // etc, we want shiny colors :)

export class Wall extends GameObject {

    blockSize: number;
    blockCount: number;

    orientation = 0; // 0: horizontal, 1: vertical

    init() {
        const el = document.createElement('div');
        el.classList.add('wall');

        for (let i = 0; i < this.blockCount; i++) {
            const wallBlock = document.createElement('div');
            wallBlock.style.backgroundColor = BLOCK_COLORS[Util.rand(1, BLOCK_COLORS.length) - 1];
            wallBlock.style.width = this.blockSize + 'px';
            el.appendChild(wallBlock);
        }

        el.style.height = this.blockSize + 'px';
        el.style.bottom = this.coords.y + 'px';
        el.style.left = this.coords.x + 'px';

        document.body.appendChild(el);

        setTimeout(() => this.dimension = { width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height });

        return el;
    }

    render() {
        
    }
}
