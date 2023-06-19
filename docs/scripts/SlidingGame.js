import Cell from "./Cell.js";
import EndOfGame from "./EndOfGame.js";

export default class SlidingGame {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        this.restart();
    }

    restart() {
        this.board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        this.ROWS = this.board.length;
        this.COLS = this.board[0].length;
        this.score = 0;
        this.newNumber = [];
        this.movedNumbers = [];

        this.getRandomValue(new Cell(this.nextInt(this.ROWS), this.nextInt(this.COLS)));
        let empty = this.listOfCells(0);
        let cell = empty[this.nextInt(empty.length)];
        this.getRandomValue(cell);
    }

    toString() {
        return this.name;
    }

    getIcon() {
        return this.icon;
    }

    getBoard() {
        return this.board;
    }

    getScore() {
        return this.score;
    }

    getNewNumber() {
        return this.newNumber;
    }

    getMovedNumbers() {
        return this.movedNumbers;
    }

    nextInt(max) {
        return Math.floor(Math.random() * max);
    }

    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.ROWS) && inLimit(y, this.COLS));
    }

    swap(bRow, bCol, eRow, eCol, value) {
        this.board[eRow][eCol] = value ? value : this.board[bRow][bCol];
        this.board[bRow][bCol] = 0;
        this.movedNumbers.push([new Cell(bRow, bCol), new Cell(eRow, eCol)]);
        return true;
    }

    move(row, col, rowDir, colDir) {
        let moved = false;
        for (; this.onBoard(new Cell(row, col)); row += rowDir, col += colDir) {
            if (this.board[row][col] !== 0) {
                moved |= this.moveDirection(row, col, -rowDir, -colDir);
            }
        }
        return moved;
    }

    play(direction) {
        this.newNumber = [];
        this.movedNumbers = [];
        let moved = false;
        let SIZE = { 'TOP': this.COLS, 'BOTTOM': this.COLS, 'LEFT': this.ROWS, 'RIGHT': this.ROWS };
        for (let j = 0; j < SIZE[direction]; j++) {
            let obj = {
                'TOP': { row: 0, col: j, rowDir: 1, colDir: 0 },
                'BOTTOM': { row: this.ROWS - 1, col: j, rowDir: -1, colDir: 0 },
                'LEFT': { row: j, col: 0, rowDir: 0, colDir: 1 },
                'RIGHT': { row: j, col: this.COLS - 1, rowDir: 0, colDir: -1 }
            };
            let m = obj[direction];
            moved |= this.move(m.row, m.col, m.rowDir, m.colDir);
        }
        if (moved) {
            let empty = this.listOfCells(0);
            let cell = empty[this.nextInt(empty.length)];
            this.getRandomValue(cell);
        }
        return this.isGameOver();
    }

    listOfCells(value) {
        return this.board.flat().map((val, i) => val === value ? new Cell(Math.floor(i / this.ROWS), i % this.COLS) : undefined).filter(x => x);
    }

    isGameOver() {
        let list = this.listOfCells(2048);
        if (list.length !== 0) {
            return EndOfGame.WIN;
        }
        list = this.listOfCells(0);
        if (list.length === 0 && this.lostGame()) {
            return EndOfGame.LOSE;
        }
        return EndOfGame.NONE;
    }

    lostGame() {
        return !this.board.flat().some((_, i) => this.canMoveCell(Math.floor(i / this.ROWS), i % this.COLS));
    }
}