const HIGHSCORE_KEY = "highscores";

export interface HighScore {
    name: string;
    email?: string;
    score: number;
}

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
    }

    refreshHighscores() {
        const existing = this.menuDialogContent.querySelector('#highscore-table');

        if (existing) {
            existing.remove();
        }

        this.menuDialogContent.appendChild(this.buildHighScoreTable(this.highScores));
    }

    pause() {
        this.openMenuDialog('Pause');
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

    openTimeOverDialog(score: number) {
        this.openMenuDialog('Time oveeeeeeer !', ['large']);

        const yourScoreBlock = document.createElement('div');
        yourScoreBlock.classList.add('your-score-block');

        const yourScoreDiv = document.createElement('div');
        const yourNameForm = document.createElement('form');

        yourScoreDiv.classList.add('content-center');
        yourScoreDiv.innerHTML = `<label>Score :</label><span>${score}</span>`;

        yourNameForm.innerHTML = `
        <div><label>Name:</label><input name="name"></div>
        <div><label>[LastName]:</label><input name="lastname"></div>
        <div><label>[Email]:</label><input name="email" class="small"></div>
        <button>OK</button>`;

        yourScoreBlock.appendChild(yourScoreDiv);
        yourScoreBlock.appendChild(yourNameForm);

        this.menuDialogContent.appendChild(yourScoreBlock);

        yourNameForm.addEventListener('submit', e => {
            e.preventDefault();

            const data = new FormData(yourNameForm);

            // only required value
            if (data.get('name')) {
                this.onSubmitScore(score, data);
                yourNameForm.remove();
            }
        });

        // this.refreshHighscores();
    }

    onSubmitScore(score: number, data: FormData) {
        // @TODO: send to API to save data :)

        const newScore: HighScore = {
            name: data.get('name').toString(),
            email: data.get('email').toString(),
            score: score
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
