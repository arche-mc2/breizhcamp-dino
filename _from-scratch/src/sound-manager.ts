export class SoundManager {
    coinSound = new Audio('/sounds/Coin01.mp3');

    constructor() {
        this.coinSound.playbackRate = 1.5;
    }

    playCoin() {
        this.coinSound.play();
    }
}