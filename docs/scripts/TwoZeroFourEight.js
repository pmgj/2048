import Cell from "./Cell.js";
import SlidingGame from "./SlidingGame.js";

export default class TwoZeroFourEight extends SlidingGame {
    constructor() {
        super("2048");
    }

    getRandomValue(x, y) {
        this.board[x][y] = this.nextInt(10) != 9 ? 2 : 4;
        this.newNumber.push({ cell: new Cell(x, y), value: this.board[x][y] });
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
                    this.movedNumbers.push([new Cell(bRow, bCol), new Cell(dRow, dCol)]);
                }
                break;
            }
            if (this.board[x][y] !== 0) {
                if (this.board[x][y] === this.board[bRow][bCol]) {
                    this.board[x][y] *= 2;
                    this.board[bRow][bCol] = 0;
                    moved = true;
                    this.movedNumbers.push([new Cell(bRow, bCol), new Cell(x, y)]);
                    this.score += this.board[x][y];
                } else if (this.board[dRow][dCol] !== this.board[bRow][bCol]) {
                    this.board[dRow][dCol] = this.board[bRow][bCol];
                    this.board[bRow][bCol] = 0;
                    moved = true;
                    this.movedNumbers.push([new Cell(bRow, bCol), new Cell(dRow, dCol)]);
                }
                break;
            }
            dRow = x;
            dCol = y;
            i++;
        }
        return moved;
    }

    canMoveCell(row, col) {
        let positions = [new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1)];
        let value = this.board[row][col];
        return positions.some(cell => this.onBoard(cell) && this.board[cell.getX()][cell.getY()] === value);
    }
}