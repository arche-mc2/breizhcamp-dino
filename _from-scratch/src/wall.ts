import { GameObject } from './gameobject';
import { Util } from './util';

const BLOCK_COLORS = ['cyan', 'magenta', 'pink', 'turquoise', 'purple', 'red', 'lime']; // etc, we want shiny colors :)
const BLOCK_BG_MAX = 9;

export class Wall extends GameObject {

    blockSize: number;
    blockCount: number;

    orientation = 0; // 0: horizontal, 1: vertical
    blockStyle: number;

    init() {
        const el = document.createElement('div');
        el.classList.add('wall');

        // une chance sur deux ! (couleurs aléatoires, sinon texture)
        this.blockStyle = Math.random() > 0.5 ? Util.rand(1, BLOCK_BG_MAX) : 0;

        let lastColorIndex = null;
        for (let i = 0; i < this.blockCount; i++) {
            let block;

            if (this.blockStyle > 0) {
                block = document.createElement('img');
                block.src = `images/block-texture/${this.blockStyle}.avif`;
            } else {
                block = document.createElement('div');
                lastColorIndex = this.generateBlockColor(lastColorIndex);
                block.style.backgroundColor = BLOCK_COLORS[lastColorIndex];
            }

            block.style.width = this.blockSize + 'px';
            el.appendChild(block);
        }

        el.style.height = this.blockSize + 'px';
        el.style.bottom = this.coords.y + 'px';
        el.style.left = this.coords.x + 'px';

        document.body.appendChild(el);

        setTimeout(() => this.dimension = { width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height });

        return el;
    }

    generateBlockColor(exclude: number) {
        while (true) {
            const rand = Util.rand(1, BLOCK_COLORS.length) - 1;

            if (rand !== exclude) {
                return rand;
            }
        }
    }

    render() {

    }
}
