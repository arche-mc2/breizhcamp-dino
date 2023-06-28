const HIGHSCORE_KEY = "highscores";

export interface HighScore {
    name: string;
    score: number;
    level: number;
}

const PAUSE_MENU_CONTENT = `
<p class="secondary">Pause</p>
<h3>Commandes :</h3>
<div class="commands-list">
    <div>← → : se deplacer</div>
    <div>Espace : sauter</div>
    <div>↓ : se baisser</div>
    <div>w : placer un mur</div>
    <div>↑ : rentrer dans Arche ! (niveau suivant)</div>
</div>
`;

export class Ui {
    scoreElement: HTMLElement;
    timeElement: HTMLElement;
    levelElement: HTMLElement;
    playerNameElement: HTMLElement;

    menuDialog: HTMLDivElement;
    menuDialogContent: HTMLDivElement;

    highScores?: HighScore[];

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
        this.timeElement.classList.toggle('urgence', time <= 5);
    }

    refreshHighscores() {
        const existing = this.menuDialogContent.querySelector('#highscore-table-wrapper');

        if (existing) {
            existing.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'highscore-table-wrapper';

        wrapper.appendChild(this.buildHighScoreTable(this.highScores));

        const blinkRetry = document.createElement('div');
        blinkRetry.id = 'retry-btn';
        blinkRetry.classList.add('blink', 'secondary');
        blinkRetry.innerText = 'Retry';
        blinkRetry.addEventListener('click', e => this.goRetry());

        document.addEventListener('keydown', e => {
            if (e.code === 'Enter') {
                this.goRetry();
            }
        });

        wrapper.appendChild(blinkRetry);

        this.menuDialogContent.appendChild(wrapper);
    }

    goRetry() {
        document.location.reload();
    }

    pause() {
        this.openMenuDialog(PAUSE_MENU_CONTENT);
        document.body.classList.add('paused');
    }

    unpause() {
        this.hideMenuDialog();
        document.body.classList.remove('paused');
    }

    openMenuDialog(content?: string, classList?: string[]) {
        if (content) {
            this.menuDialogContent.innerHTML = content;
        }

        this.menuDialog.className = classList ? classList.join(' ') : '';

        this.menuDialog.style.display = 'unset';
    }

    hideMenuDialog() {
        this.menuDialog.style.display = '';
    }

    openTimeOverDialog(score: number, level: number) {
        this.openMenuDialog('Time oveeeeeeer !', ['large']);

        const yourScoreBlock = document.createElement('div');
        yourScoreBlock.classList.add('your-score-block');

        const yourScoreDiv = document.createElement('div');
        const yourNameForm = document.createElement('form');
        yourNameForm.setAttribute('autocomplete', 'off');

        yourScoreDiv.classList.add('content-center');
        yourScoreDiv.innerHTML = `<label>Score :</label><span>${score}</span>`;

        yourNameForm.innerHTML = `
        <div><label>Name:</label><input name="name"></div>
        <div><label>[LastName]:</label><input name="lastname"></div>
        <div><label>[Email]:</label><input name="email" class="small"></div>
        <div><label>[Phone]:</label><input name="phone" class="small"></div>
        <div><label class="small">[Situation ?]:</label><input name="situation" class="small"></div>
        <div class="checkbox"><label class="small for-checkbox" for="agreement">
        J'autorise ce site à conserver mes donnees transmises via ce formulaire</label>
        <input type="checkbox" name="agreement" id="agreement"></div>
        <button>OK</button>`;

        yourScoreBlock.appendChild(yourScoreDiv);
        yourScoreBlock.appendChild(yourNameForm);

        this.menuDialogContent.appendChild(yourScoreBlock);

        yourNameForm.addEventListener('submit', e => {
            e.preventDefault();

            const data = new FormData(yourNameForm);

            // only required value
            if (data.get('name')) {
                this.onSubmitScore(score, level, data);
                yourNameForm.remove();
            }
        });

        // this.refreshHighscores();
    }

    onSubmitScore(score: number, level: number, data: FormData) {
        data.append('score', score + '');
        data.append('level', level + '');

        fetch('https://bonsoironline.fr/dino/', {
            method: 'POST',
            body: data
        }).then(resp => console.log('Save score response : ', resp));

        const newScore: HighScore = {
            name: data.get('name').toString(),
            score,
            level
        };

        this.highScores.push(newScore);

        this.saveHighscores();

        this.refreshHighscores();
    }

    buildHighScoreTable(highScores: HighScore[]) {
        const table = document.createElement('table');
        table.id = 'highscore-table';
        table.setAttribute('border', '1');
        table.setAttribute('cellspacing', '0');

        highScores.sort((a, b) => a.score < b.score ? 1 : -1).slice(0, 10).forEach(row => {
            const tr = document.createElement('tr');
            const nameCell = document.createElement('td');
            const scoreCell = document.createElement('td');

            nameCell.innerText = row.name;
            scoreCell.innerText = row.score + '';

            tr.appendChild(nameCell);
            tr.appendChild(scoreCell);

            table.appendChild(tr);
        });

        return table;
    }

    loadHighscores() {
        const json = localStorage.getItem(HIGHSCORE_KEY);

        this.highScores = json ? JSON.parse(json) : [];
    }

    saveHighscores() {
        const json = JSON.stringify(this.highScores);

        localStorage.setItem(HIGHSCORE_KEY, json);
    }
}
