import { Game } from "./game";

export class Ui {
    scoreElement: HTMLElement;
    timeElement: HTMLElement;
    levelElement: HTMLElement;
    playerNameElement: HTMLElement;

    menuDialog: HTMLDivElement;
    menuDialogContent: HTMLDivElement;

    constructor() {
        this.scoreElement = document.querySelector('#current-score');
        this.timeElement = document.querySelector('#current-timer');
        this.levelElement = document.querySelector('#current-level');

        this.playerNameElement = document.querySelector('#player-name');

        this.menuDialog = document.querySelector('#menu-dialog');
        this.menuDialogContent = this.menuDialog.querySelector('.content');
    }

    refreshScore(score: number) {
        this.scoreElement.innerText = score + '';
    }

    refreshLevel(lvl: number) {
        this.levelElement.innerText = lvl + '';
    }

    refreshTime(time: number) {
        this.timeElement.innerText = time + '';
    }

    pause() {
        this.openMenuDialog('Pause');
    }

    unpause() {
        this.hideMenuDialog();
    }

    openMenuDialog(content?: string) {
        if (content) {
            this.menuDialogContent.innerHTML = content;
        }

        this.menuDialog.style.display = 'unset';
    }

    hideMenuDialog() {
        this.menuDialog.style.display = '';
    }
}
