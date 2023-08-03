package model.rules;

import java.util.List;

import model.Cell;
import model.CellValue;
import model.EndOfGame;

public class Threes extends SlidingNumbers {

    protected void getRandomValue(Cell cell) {
        int x = cell.x(), y = cell.y();
        this.board[x][y] = "" + (this.nextInt(3) + 1);
        this.newNumbers.add(new CellValue(cell, this.board[x][y]));
    }

    protected boolean moveDirection(int bRow, int bCol, int rowDir, int colDir) {
        boolean moved = false;
        int x = bRow + rowDir, y = bCol + colDir;
        if (!this.onBoard(new Cell(x, y))) {
            return moved;
        }
        if (this.board[x][y] != "0") {
            int sum = Integer.parseInt(this.board[x][y]) + Integer.parseInt(this.board[bRow][bCol]);
            if (sum == 3 || (sum % 3 == 0 && this.board[x][y].equals(this.board[bRow][bCol]))) {
                moved = this.swap(bRow, bCol, x, y, "" + sum);
                this.score += Integer.parseInt(this.board[x][y]);
            }
        } else {
            moved = this.swap(bRow, bCol, x, y, null);
        }
        return moved;
    }

    protected boolean canMoveCell(int row, int col) {
        var positions = List.of(new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1), new Cell(row, col + 1));
        var value = this.board[row][col];
        return positions.stream().anyMatch(
                cell -> this.onBoard(cell) && (Integer.parseInt(this.board[cell.x()][cell.y()]) + Integer.parseInt(value) == 3
                        || ((Integer.parseInt(this.board[cell.x()][cell.y()]) + Integer.parseInt(value)) % 3 == 0)
                                && this.board[cell.x()][cell.y()] == value));
    }

    protected EndOfGame isGameOver() {
        var list = this.listOfCells("0");
        if (list.isEmpty() && this.lostGame()) {
            return EndOfGame.LOSE;
        }
        return EndOfGame.NONE;
    }

}