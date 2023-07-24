import Cell from "./Cell.js";
import SlidingNumbers from "./SlidingNumbers.js";
import EndOfGame from "./EndOfGame.js";

export default class Threes extends SlidingNumbers {
    constructor() {
        super("Threes", "threes_icon.png");
    }

    getRandomValue(cell) {
        let { x, y } = cell;
        this.board[x][y] = this.nextInt(3) + 1;
        this.newNumber.push({ cell: cell, value: this.board[x][y] });
    }

    moveDirection(bRow, bCol, rowDir, colDir) {
        let moved = false, x = bRow + rowDir, y = bCol + colDir;
        if (!this.onBoard(new Cell(x, y))) {
            return moved;
        }
        if (this.board[x][y] !== 0) {
            let sum = this.board[x][y] + this.board[bRow][bCol];
            if (sum === 3 || (sum % 3 === 0 && this.board[x][y] === this.board[bRow][bCol])) {
                moved = this.swap(bRow, bCol, x, y, sum);
                this.score += this.board[x][y];
            }
        } else {
            moved = this.swap(bRow, bCol, x, y);
        }
        return moved;
    }

    canMoveCell(row, col) {
        let positions = [new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1)];
        let value = this.board[row][col];
        return positions.some(cell => this.onBoard(cell) && (this.board[cell.getX()][cell.getY()] + value === 3 || ((this.board[cell.getX()][cell.getY()] + value) % 3 === 0) && this.board[cell.getX()][cell.getY()] === value));
    }

    isGameOver() {
        let list = this.listOfCells(0);
        if (list.length === 0 && this.lostGame()) {
            return EndOfGame.LOSE;
        }
        return EndOfGame.NONE;
    }
}