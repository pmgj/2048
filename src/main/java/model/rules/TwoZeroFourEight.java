package model.rules;

import java.util.List;

import model.Cell;
import model.CellValue;
import model.EndOfGame;

public class TwoZeroFourEight extends SlidingNumbers {

    protected void getRandomValue(Cell cell) {
        int x = cell.x(), y = cell.y();
        this.board[x][y] = this.nextInt(10) != 9 ? "2" : "4";
        this.newNumbers.add(new CellValue(cell, this.board[x][y]));
    }

    protected boolean moveDirection(int bRow, int bCol, int rowDir, int colDir) {
        int dRow = bRow, dCol = bCol;
        boolean moved = false;
        for (int x = 0, y = 0, i = 1; true; dRow = x, dCol = y, i++) {
            x = bRow + i * rowDir;
            y = bCol + i * colDir;
            if (!this.onBoard(new Cell(x, y))) {
                if (i != 1) {
                    moved = this.swap(bRow, bCol, dRow, dCol, null);
                }
                break;
            }
            if (this.board[x][y] != "0") {
                if (this.board[x][y].equals(this.board[bRow][bCol])) {
                    moved = this.swap(bRow, bCol, x, y, "" + (Integer.parseInt(this.board[x][y]) * 2));
                    this.score += Integer.parseInt(this.board[x][y]);
                } else if (this.board[dRow][dCol] != this.board[bRow][bCol]) {
                    moved = this.swap(bRow, bCol, dRow, dCol, null);
                }
                break;
            }
        }
        return moved;
    }

    protected boolean canMoveCell(int row, int col) {
        var positions = List.of(new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1));
        var value = this.board[row][col];
        return positions.stream().anyMatch(
                cell -> this.onBoard(cell) && this.board[cell.x()][cell.y()] == value);
    }

    protected EndOfGame isGameOver() {
        var list = this.listOfCells("2048");
        if (!list.isEmpty()) {
            return EndOfGame.WIN;
        }
        list = this.listOfCells("0");
        if (list.isEmpty() && this.lostGame()) {
            return EndOfGame.LOSE;
        }
        return EndOfGame.NONE;
    }
}