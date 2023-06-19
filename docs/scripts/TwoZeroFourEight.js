import Cell from "./Cell.js";
import SlidingGame from "./SlidingGame.js";

export default class TwoZeroFourEight extends SlidingGame {
    constructor() {
        super("2048", "2048_icon.ico");
    }

    getRandomValue(cell) {
        let { x, y } = cell;
        this.board[x][y] = this.nextInt(10) != 9 ? 2 : 4;
        this.newNumber.push({ cell: cell, value: this.board[x][y] });
    }

    moveDirection(bRow, bCol, rowDir, colDir) {
        let dRow = bRow, dCol = bCol, moved = false;
        for (let x = 0, y = 0, i = 1; true; dRow = x, dCol = y, i++) {
            x = bRow + i * rowDir;
            y = bCol + i * colDir;
            if (!this.onBoard(new Cell(x, y))) {
                if (i !== 1) {
                    moved = this.swap(bRow, bCol, dRow, dCol);
                }
                break;
            }
            if (this.board[x][y] !== 0) {
                if (this.board[x][y] === this.board[bRow][bCol]) {
                    moved = this.swap(bRow, bCol, x, y, this.board[x][y] * 2);
                    this.score += this.board[x][y];
                } else if (this.board[dRow][dCol] !== this.board[bRow][bCol]) {
                    moved = this.swap(bRow, bCol, dRow, dCol);
                }
                break;
            }
        }
        return moved;
    }

    canMoveCell(row, col) {
        let positions = [new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1)];
        let value = this.board[row][col];
        return positions.some(cell => this.onBoard(cell) && this.board[cell.getX()][cell.getY()] === value);
    }
}