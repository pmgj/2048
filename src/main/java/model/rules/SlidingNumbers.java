package model.rules;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.BiFunction;

import model.Cell;
import model.CellDirection;
import model.CellValue;
import model.Direction;
import model.EndOfGame;
import model.PairOfCells;

public abstract class SlidingNumbers {
    protected String[][] board;
    protected int ROWS;
    protected int COLS;
    protected Random random = new Random();
    protected long score;
    protected List<PairOfCells> movedNumbers = new ArrayList<>();
    protected List<CellValue> newNumbers = new ArrayList<>();

    protected abstract void getRandomValue(Cell cell);

    protected abstract boolean moveDirection(int bRow, int bCol, int rowDir, int colDir);

    protected abstract boolean canMoveCell(int row, int col);

    protected abstract EndOfGame isGameOver();

    public SlidingNumbers() {
        this.restart();
    }

    private void restart() {
        this.board = new String[][] {
                { "0", "0", "0", "0" },
                { "0", "0", "0", "0" },
                { "0", "0", "0", "0" },
                { "0", "0", "0", "0" },
        };
        this.ROWS = board.length;
        this.COLS = board[0].length;
        this.random = new Random();
        this.score = 0;
        this.movedNumbers.clear();
        this.newNumbers.clear();

        this.getRandomValue(new Cell(this.nextInt(this.ROWS), this.nextInt(this.COLS)));
        var empty = this.listOfCells("0");
        var cell = empty.get(this.nextInt(empty.size()));
        this.getRandomValue(cell);
    }

    public String[][] getBoard() {
        return this.board;
    }

    public long getScore() {
        return this.score;
    }

    protected int nextInt(int max) {
        return random.nextInt(max);
    }

    protected boolean onBoard(Cell cell) {
        int row = cell.x(), col = cell.y();
        BiFunction<Integer, Integer, Boolean> inLimit = (value, limit) -> value >= 0 && value < limit;
        return (inLimit.apply(row, this.ROWS) && inLimit.apply(col, this.COLS));
    }

    protected boolean swap(int bRow, int bCol, int eRow, int eCol, String value) {
        this.board[eRow][eCol] = value != null ? value : this.board[bRow][bCol];
        this.board[bRow][bCol] = "0";
        this.movedNumbers.add(new PairOfCells(new Cell(bRow, bCol), new Cell(eRow, eCol)));
        return true;
    }

    private boolean move(int row, int col, int rowDir, int colDir) {
        boolean moved = false;
        for (; this.onBoard(new Cell(row, col)); row += rowDir, col += colDir) {
            if (this.board[row][col] != "0") {
                moved |= this.moveDirection(row, col, -rowDir, -colDir);
            }
        }
        return moved;
    }

    public EndOfGame play(Direction direction) {
        this.newNumbers.clear();
        this.movedNumbers.clear();
        boolean moved = false;
        var SIZE = Map.of(Direction.TOP, this.COLS, Direction.BOTTOM, this.COLS, Direction.LEFT,
                this.ROWS, Direction.RIGHT, this.ROWS);
        for (int j = 0; j < SIZE.get(direction); j++) {
            var obj = Map.of(Direction.TOP, new CellDirection(0, j, 1, 0), Direction.BOTTOM,
                    new CellDirection(this.ROWS - 1, j, -1, 0),
                    Direction.LEFT, new CellDirection(j, 0, 0, 1), Direction.RIGHT,
                    new CellDirection(j, this.COLS - 1, 0, -1));
            var m = obj.get(direction);
            moved |= this.move(m.row(), m.col(), m.rowDir(), m.colDir());
        }
        if (moved) {
            var empty = this.listOfCells("0");
            var cell = empty.get(random.nextInt(empty.size()));
            this.getRandomValue(cell);
        }
        return this.isGameOver();
    }

    protected List<Cell> listOfCells(String value) {
        var empty = new ArrayList<Cell>();
        for (int i = 0; i < this.ROWS; i++) {
            for (int j = 0; j < this.COLS; j++) {
                if (this.board[i][j] == value) {
                    empty.add(new Cell(i, j));
                }
            }
        }
        return empty;
    }

    protected boolean lostGame() {
        for (int i = 0; i < this.ROWS; i++) {
            for (int j = 0; j < this.COLS; j++) {
                if (this.canMoveCell(i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

}
