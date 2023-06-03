import Direction from "./Direction.js";
import EndOfGame from "./EndOfGame.js";
import TwoZeroFourEight from "./TwoZeroFourEight.js";

class GUI {
    constructor() {
        this.game = null;
    }
    move(evt) {
        let bindings = { "ArrowUp": Direction.TOP, "ArrowDown": Direction.BOTTOM, "ArrowLeft": Direction.LEFT, "ArrowRight": Direction.RIGHT };
        if (!bindings[evt.key]) {
            return;
        }
        let end = this.game.play(bindings[evt.key]);
        // console.table(this.game.getBoard());
        this.moveTiles(this.game.getMovedNumbers());
        this.showNewNumbers(this.game.getNewNumber());
        this.isGameOver(end);
    }
    moveTiles(tiles) {
        let tbody = document.querySelector("tbody");
        let promises = [];
        for (const [beginCell, endCell] of tiles) {
            let p = new Promise(resolve => {
                let { x: xi, y: yi } = beginCell;
                let { x: xf, y: yf } = endCell;
                let beginTD = tbody.rows[xi].cells[yi];
                let beginTile = beginTD.firstChild;
                let xDiff = (xf - xi) * beginTD.offsetWidth;
                let yDiff = (yf - yi) * beginTD.offsetWidth;
                beginTile.style.transform = `translate(${yDiff}px, ${xDiff}px)`;
                beginTile.ontransitionend = () => {
                    resolve(true);
                };
            });
            promises.push(p);
        }
        Promise.all(promises).then(values => {
            let cells = [];
            for (const [beginCell, endCell] of tiles) {
                let { x: xi, y: yi } = beginCell;
                let { x: xf, y: yf } = endCell;
                let beginTD = tbody.rows[xi].cells[yi];
                let beginTile = beginTD.firstChild;
                let endTD = tbody.rows[xf].cells[yf];
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
                let td = tbody.rows[x].cells[y];
                let div = td.firstChild;
                let num = parseInt(div.textContent);
                div.textContent = value;
                div.classList.remove(`tile-${num}`);
                div.classList.add(`tile-${value}`);
                div.classList.add(`pop`);
                div.onanimationend = () => div.classList.remove("pop");
            }
        });
    }
    isGameOver(end) {
        switch (end) {
            case EndOfGame.WIN:
                console.log("You win!");
                break;
            case EndOfGame.LOSE:
                console.log("You lose!");
                break;
        }
    }
    printBoard(board) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < board[i].length; j++) {
                let td = document.createElement("td");
                let value = board[i][j];
                if (value !== 0) {
                    let div = document.createElement("div");
                    div.classList.add(`tile-${value}`);
                    div.textContent = value;
                    div.classList.add("show");
                    div.onanimationend = () => div.classList.remove("show");
                    td.appendChild(div);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    showNewNumbers(cells) {
        let tbody = document.querySelector("tbody");
        for (const { cell, value } of cells) {
            let { x, y } = cell;
            let td = tbody.rows[x].cells[y];
            let div = document.createElement("div");
            div.textContent = value;
            div.classList.add("show");
            div.classList.add(`tile-${value}`);
            div.onanimationend = () => div.classList.remove("show");
            td.appendChild(div);
        }
    }
    init() {
        this.game = new TwoZeroFourEight();
        this.printBoard(this.game.getBoard());
        document.addEventListener("keyup", this.move.bind(this));
    }
}
let gui = new GUI();
gui.init();