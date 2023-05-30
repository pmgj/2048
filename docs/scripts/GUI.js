import Direction from "./Direction.js";
import EndOfGame from "./EndOfGame.js";
import TwoZeroFourEight from "./TwoZeroFourEight.js";

class GUI {
    constructor() {
        this.game = null;
    }
    move(evt) {
        let bindings = { "ArrowUp": Direction.TOP, "ArrowDown": Direction.BOTTOM, "ArrowLeft": Direction.LEFT, "ArrowRight": Direction.RIGHT };
        let end = this.game.play(bindings[evt.key]);
        this.printBoard(this.game.getBoard());
        this.isGameOver(end);
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
                    td.classList.add(`tile-${value}`);
                    td.textContent = value;
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
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