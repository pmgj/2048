package model;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.function.BiFunction;

public class TwoZeroFourEight {

    private final Integer[][] board = {
            { 0, 0, 0, 0 },
            { 0, 0, 0, 0 },
            { 0, 0, 0, 0 },
            { 0, 0, 0, 0 },
    };
    private final int ROWS = board.length;
    private final int COLS = board[0].length;
    private final Random random = new Random();
    private long score = 0;

    public TwoZeroFourEight() {
        this.board[random.nextInt(this.ROWS)][random.nextInt(this.COLS)] = 2;
        List<Cell> empty = this.listOfCells(0);
        Cell cell = empty.get(random.nextInt(empty.size()));
        this.board[cell.getX()][cell.getY()] = 2;
    }

    public Integer[][] getBoard() {
        return this.board;
    }

    public long getScore() {
        return this.score;
    }

    private boolean onBoard(int row, int col) {
        BiFunction<Integer, Integer, Boolean> inLimit = (value, limit) -> value >= 0 && value < limit;
        return (inLimit.apply(row, this.ROWS) && inLimit.apply(col, this.COLS));
    }

    private boolean moveDirection(int bRow, int bCol, int rowDir, int colDir) {
        int dRow = bRow, dCol = bCol, i = 1;
        boolean moved = false;
        while (true) {
            int x = bRow + i * rowDir, y = bCol + i * colDir;
            if (!this.onBoard(x, y)) {
                if (bRow != dRow || bCol != dCol) {
                    this.board[dRow][dCol] = this.board[bRow][bCol];
                    this.board[bRow][bCol] = 0;
                    moved = true;
                }
                break;
            }
            if (this.board[x][y] != 0) {
                if (this.board[x][y] == this.board[bRow][bCol]) {
                    this.board[x][y] *= 2;
                    this.board[bRow][bCol] = 0;
                    moved = true;
                    this.score += this.board[x][y];
                } else if (this.board[dRow][dCol] != this.board[bRow][bCol]) {
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

    private boolean move(int row, int col, int rowDir, int colDir) {
        boolean moved = false;
        while (true) {
            if (!this.onBoard(row, col)) {
                break;
            }
            if (this.board[row][col] != 0) {
                moved |= this.moveDirection(row, col, -rowDir, -colDir);
            }
            row += rowDir;
            col += colDir;
        }
        return moved;
    }

    public EndOfGame move(Direction direction) {
        boolean moved = false;
        switch (direction) {
            case TOP:
                for (int j = 0; j < this.COLS; j++) {
                    moved |= this.move(0, j, 1, 0);
                }
                break;
            case BOTTOM:
                for (int j = 0; j < this.COLS; j++) {
                    moved |= this.move(this.ROWS - 1, j, -1, 0);
                }
                break;
            case LEFT:
                for (int j = 0; j < this.ROWS; j++) {
                    moved |= this.move(j, 0, 0, 1);
                }
                break;
            case RIGHT:
                for (int j = 0; j < this.ROWS; j++) {
                    moved |= this.move(j, this.COLS - 1, 0, -1);
                }
                break;
        }
        if (moved) {
            List<Cell> empty = this.listOfCells(0);
            Cell cell = empty.get(random.nextInt(empty.size()));
            this.board[cell.getX()][cell.getY()] = random.nextInt(10) != 9 ? 2 : 4;
        }
        return this.isGameOver();
    }

    private List<Cell> listOfCells(int value) {
        List<Cell> empty = new ArrayList<>();
        for (int i = 0; i < this.ROWS; i++) {
            for (int j = 0; j < this.COLS; j++) {
                if (this.board[i][j] == value) {
                    empty.add(new Cell(i, j));
                }
            }
        }
        return empty;
    }

    private EndOfGame isGameOver() {
        List<Cell> list = this.listOfCells(2048);
        if (!list.isEmpty()) {
            return EndOfGame.WIN;
        }
        list = this.listOfCells(0);
        if (list.size() == 0 && this.lostGame()) {
            return EndOfGame.LOSE;
        }
        return EndOfGame.NONE;
    }

    private boolean lostGame() {
        for (int i = 0; i < this.ROWS; i++) {
            for (int j = 0; j < this.COLS; j++) {
                if (this.canMoveCell(i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean canMoveCell(int row, int col) {
        List<Cell> positions = List.of(new Cell(row - 1, col), new Cell(row + 1, col), new Cell(row, col - 1),
                new Cell(row, col + 1));
        int value = this.board[row][col];
        return positions.stream().anyMatch(
                cell -> this.onBoard(cell.getX(), cell.getY()) && this.board[cell.getX()][cell.getY()] == value);
    }
}