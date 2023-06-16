import Cell from "./Cell.js";
import SlidingGame from "./SlidingGame.js";

export default class Threes extends SlidingGame {
    constructor() {
        super("Threes");
    }

    getRandomValue(x, y) {
        this.board[x][y] = this.nextInt(3) + 1;
        this.newNumber.push({ cell: new Cell(x, y), value: this.board[x][y] });
    }

    moveDirection(bRow, bCol, rowDir, colDir) {
        let moved = false;
        let x = bRow + rowDir, y = bCol + colDir;
        if (!this.onBoard(new Cell(x, y))) {
            return moved;
        }
        if (this.board[x][y] !== 0) {
            let sum = this.board[x][y] + this.board[bRow][bCol];
            if (sum === 3 || (sum % 3 === 0 && this.board[x][y] === this.board[bRow][bCol])) {
                this.board[x][y] += this.board[bRow][bCol];
                this.board[bRow][bCol] = 0;
                moved = true;
                this.movedNumbers.push([new Cell(bRow, bCol), new Cell(x, y)]);
                this.score += this.board[x][y];
            }
        } else {
            this.board[x][y] = this.board[bRow][bCol];
            this.board[bRow][bCol] = 0;
            moved = true;
            this.movedNumbers.push([new Cell(bRow, bCol), new Cell(x, y)]);
        }
        return moved;
    }

    canMoveCell(row, col) {
        let positions = [new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1)];
        let value = this.board[row][col];
        return positions.some(cell => this.onBoard(cell) && (this.board[cell.getX()][cell.getY()] + value === 3 || ((this.board[cell.getX()][cell.getY()] + value) % 3 === 0) && this.board[cell.getX()][cell.getY()] === value));
    }
}