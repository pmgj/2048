import Direction from "./Direction.js";
import EndOfGame from "./EndOfGame.js";
import TwoZeroFourEight from "./TwoZeroFourEight.js";
import OneZeroTwoFour from "./OneZeroTwoFour.js";
import Threes from "./Threes.js";
import Alphabet from "./Alphabet.js";

class GUI {
    constructor() {
        this.games = [new Alphabet(), new OneZeroTwoFour(), new Threes(), new TwoZeroFourEight()];
        this.game = null;
        this.tbody = document.querySelector("tbody");
        this.canMove = true;
    }
    async move(evt) {
        let bindings = { "ArrowUp": Direction.TOP, "ArrowDown": Direction.BOTTOM, "ArrowLeft": Direction.LEFT, "ArrowRight": Direction.RIGHT };
        if (!bindings[evt.key]) {
            return;
        }
        if (!this.canMove) return;
        this.canMove = false;
        let end = this.game.play(bindings[evt.key]);
        let mn = this.game.getMovedNumbers();
        await this.moveTiles(mn);
        this.updatePositions(mn);
        this.updateScore(this.game.getScore())
        this.isGameOver(end);
        this.canMove = true;
    }
    updateScore(score) {
        let elem = document.querySelector(".score div");
        elem.textContent = score;
        let best = localStorage.getItem("best");
        if (best) {
            let b = parseInt(best);
            if (score > b) {
                localStorage.setItem("best", score);
            }
        } else {
            localStorage.setItem("best", "0");
        }
        elem = document.querySelector(".score:last-child div");
        elem.textContent = localStorage.getItem("best");
    }
    updatePositions(tiles) {
        let cells = [];
        for (const [beginCell, endCell] of tiles) {
            let { x: xi, y: yi } = beginCell;
            let { x: xf, y: yf } = endCell;
            let beginTD = this.tbody.rows[xi].cells[yi];
            let beginTile = beginTD.firstChild;
            let endTD = this.tbody.rows[xf].cells[yf];
            let endTile = endTD.firstChild;
            if (endTile) {
                beginTD.innerHTML = "";
                if (!cells.some(e => e.equals(endCell))) {
                    cells.push(endCell);
                }
            } else {
                endTD.appendChild(beginTile);
                beginTile.removeAttribute("style");
            }
        }
        let board = this.game.getBoard();
        for (let { x, y } of cells) {
            const value = board[x][y];
            let td = this.tbody.rows[x].cells[y];
            let div = td.firstChild;
            let num = div.textContent;
            div.classList.remove(`tile-${num}`);
            div.classList.add(`tile-${value}`);
            div.classList.add(`pop`);
            div.textContent = value;
            div.addEventListener("animationend", () => div.classList.remove("pop"));
        }
        this.showNewNumbers(this.game.getNewNumber());
    }
    moveTiles(tiles) {
        let promises = [];
        for (const [beginCell, endCell] of tiles) {
            let p = new Promise(resolve => {
                let { x: xi, y: yi } = beginCell;
                let { x: xf, y: yf } = endCell;
                let beginTD = this.tbody.rows[xi].cells[yi];
                let beginTile = beginTD.firstChild;
                let anim = beginTile.animate([{ top: 0, left: 0 }, { top: `${(xf - xi) * beginTD.offsetWidth}px`, left: `${(yf - yi) * beginTD.offsetWidth}px` }], { duration: 100, easing: "ease-in-out" });
                anim.onfinish = () => resolve([beginCell, endCell]);
            });
            promises.push(p);
        }
        return Promise.all(promises);
    }
    isGameOver(end) {
        let message = document.querySelector("#message");
        switch (end) {
            case EndOfGame.WIN:
                message.textContent = "You win!";
                break;
            case EndOfGame.LOSE:
                message.textContent = "You lose!";
                break;
            default:
                message.textContent = "";
        }
    }
    printBoard(board) {
        this.tbody.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < board[i].length; j++) {
                let td = document.createElement("td");
                let value = board[i][j];
                if (value !== 0) {
                    let div = document.createElement("div");
                    div.classList.add(`tile-${value}`);
                    div.textContent = value;
                    td.appendChild(div);
                }
                tr.appendChild(td);
            }
            this.tbody.appendChild(tr);
        }
    }
    showNewNumbers(cells) {
        for (const { cell, value } of cells) {
            let { x, y } = cell;
            let td = this.tbody.rows[x].cells[y];
            let div = document.createElement("div");
            div.textContent = value;
            div.classList.add("show");
            div.classList.add(`tile-${value}`);
            div.addEventListener("animationend", () => div.classList.remove("show"));
            td.appendChild(div);
        }
    }
    startGame(index) {
        this.game = this.games[index];
        this.game.restart();
        this.printBoard(this.game.getBoard());
        this.updateScore(0);
        this.isGameOver();
        let caption = document.querySelector("caption");
        caption.textContent = this.game;
        let title = document.querySelector("title");
        title.textContent = this.game;
        let icon = document.querySelector("link[rel='icon']");
        icon.href = `images/${this.game.getIcon()}`;
        this.games.forEach(g => {
            let style = document.querySelector(`link[title='${g}']`);
            style.disabled = g !== this.game;
        });
    }
    init() {
        document.addEventListener("keyup", this.move.bind(this));
        let game = document.querySelector("#game");
        this.games.forEach((g, i) => game.add(new Option(g, i)));
        game.onchange = evt => this.startGame(evt.target.selectedIndex);
        let start = document.querySelector("input[value='Start']");
        start.onclick = () => this.startGame(game.selectedIndex);
        this.startGame(0);
        let initialX, initialY, initialTime;
        let threshold = 150, allowedTime = 400, restraint = 100;
        document.addEventListener("touchstart", e => {
            e.preventDefault();
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
            initialTime = new Date();
        });
        document.addEventListener("touchmove", e => {
            e.preventDefault();
        });
        document.addEventListener("touchend", e => {
            e.preventDefault();
            let deltaX = e.changedTouches[0].clientX - initialX;
            let deltaY = e.changedTouches[0].clientY - initialY;
            let deltaTime = new Date() - initialTime;
            if (deltaTime > allowedTime) return;
            let obj = {};
            if (Math.abs(deltaX) >= threshold && Math.abs(deltaY) <= restraint) {
                obj.key = (deltaX < 0) ? 'ArrowLeft' : 'ArrowRight';
            } else if (Math.abs(deltaY) >= threshold && Math.abs(deltaX) <= restraint) {
                obj.key = (deltaY < 0) ? 'ArrowUp' : 'ArrowDown';
            }
            this.move(obj);
        });
    }
}
let gui = new GUI();
gui.init();