import Cell from "./Cell.js";
import EndOfGame from "./EndOfGame.js";

export default class TwoZeroFourEight {
    constructor() {
        this.board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        this.ROWS = board.length;
        this.COLS = board[0].length;
        this.score = 0;

        this.board[this.nextInt(this.ROWS)][this.nextInt(this.COLS)] = 2;
        let empty = this.listOfCells(0);
        let size = empty.length;
        let cell = empty.get(this.nextInt(size));
        this.board[cell.getX()][cell.getY()] = 2;
    }

    getBoard() {
        return this.board;
    }

    getScore() {
        return score;
    }

    nextInt(max) {
        return Math.floor(Math.random() * max);
    }

    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.ROWS) && inLimit(y, this.COLS));
    }

    moveDirection(bRow, bCol, rowDir, colDir) {
        let dRow = bRow, dCol = bCol, i = 1;
        let moved = false;
        while (true) {
            let x = bRow + i * rowDir, y = bCol + i * colDir;
            if (!this.onBoard(new Cell(x, y))) {
                if (bRow !== dRow || bCol !== dCol) {
                    this.board[dRow][dCol] = this.board[bRow][bCol];
                    this.board[bRow][bCol] = 0;
                    moved = true;
                }
                break;
            }
            if (this.board[x][y] !== 0) {
                if (this.board[x][y] === this.board[bRow][bCol]) {
                    this.board[x][y] *= 2;
                    this.board[bRow][bCol] = 0;
                    moved = true;
                    score += this.board[x][y];
                } else if (this.board[dRow][dCol] !== this.board[bRow][bCol]) {
                    this.board[dRow][dCol] = this.board[bRow][bCol];
                    this.board[bRow][bCol] = 0;
                    moved = true;
                }
                break;
            }
            dRow = x;
            dCol = y;
            i++;
        }
        return moved;
    }

    move(row, col, rowDir, colDir) {
        let moved = false;
        while (true) {
            if (!this.onBoard(new Cell(row, col))) {
                break;
            }
            if (this.board[row][col] !== 0) {
                moved |= this.moveDirection(row, col, -rowDir, -colDir);
            }
            row += rowDir;
            col += colDir;
        }
        return moved;
    }

    move(direction) {
        let moved = false;
        switch (direction) {
            case TOP:
                for (let j = 0; j < COLS; j++) {
                    moved |= this.move(0, j, 1, 0);
                }
                break;
            case BOTTOM:
                for (let j = 0; j < COLS; j++) {
                    moved |= this.move(this.ROWS - 1, j, -1, 0);
                }
                break;
            case LEFT:
                for (let j = 0; j < ROWS; j++) {
                    moved |= this.move(j, 0, 0, 1);
                }
                break;
            case RIGHT:
                for (let j = 0; j < ROWS; j++) {
                    moved |= this.move(j, this.COLS - 1, 0, -1);
                }
                break;
        }
        if (moved) {
            let empty = this.listOfCells(0);
            let size = empty.length;
            let cell = empty.get(random.nextInt(size));
            this.board[cell.getX()][cell.getY()] = this.nextInt(10) != 9 ? 2 : 4;
        }
        return this.isGameOver();
    }

    listOfCells(value) {
        let empty = [];
        for (let i = 0; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS; j++) {
                if (this.board[i][j] == value) {
                    empty.push(new Cell(i, j));
                }
            }
        }
        return empty;
    }

    isGameOver() {
        let list = this.listOfCells(2048);
        if (list.length !== 0) {
            return EndOfGame.WIN;
        }
        list = this.listOfCells(0);
        if (list.length == 0 && this.lostGame()) {
            return EndOfGame.LOSE;
        }
        return EndOfGame.NONE;
    }

    lostGame() {
        for (let i = 0; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS; j++) {
                if (this.canMoveCell(i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    canMoveCell(row, col) {
        let positions = [new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1)];
        let value = this.board[row][col];
        return positions.some(cell => this.onBoard(cell) && this.board[cell.getX()][cell.getY()] == value);
    }
}