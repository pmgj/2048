package model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.BiFunction;

public abstract class SlidingNumbers {
    protected Integer[][] board;
    protected int ROWS;
    protected int COLS;
    protected Random random = new Random();
    protected long score;
    protected List<PairOfCells> movedNumbers = new ArrayList<>();
    protected List<CellValue> newNumbers = new ArrayList<>();

    protected abstract void getRandomValue(Cell cell);

    protected abstract boolean moveDirection(int bRow, int bCol, int rowDir, int colDir);

    protected abstract boolean canMoveCell(int row, int col);

    public SlidingNumbers() {
        this.restart();
    }

    private void restart() {
        this.board = new Integer[][] {
                { 0, 0, 0, 0 },
                { 0, 0, 0, 0 },
                { 0, 0, 0, 0 },
                { 0, 0, 0, 0 },
        };
        this.ROWS = board.length;
        this.COLS = board[0].length;
        this.random = new Random();
        this.score = 0;
        this.movedNumbers.clear();
        this.newNumbers.clear();

        this.getRandomValue(new Cell(this.nextInt(this.ROWS), this.nextInt(this.COLS)));
        List<Cell> empty = this.listOfCells(0);
        Cell cell = empty.get(this.nextInt(empty.size()));
        this.getRandomValue(cell);
    }

    public Integer[][] getBoard() {
        return this.board;
    }

    public long getScore() {
        return this.score;
    }

    protected int nextInt(int max) {
        return random.nextInt(max);
    }

    protected boolean onBoard(Cell cell) {
        int row = cell.getX(), col = cell.getY();
        BiFunction<Integer, Integer, Boolean> inLimit = (value, limit) -> value >= 0 && value < limit;
        return (inLimit.apply(row, this.ROWS) && inLimit.apply(col, this.COLS));
    }

    protected boolean swap(int bRow, int bCol, int eRow, int eCol, int value) {
        this.board[eRow][eCol] = value != -1 ? value : this.board[bRow][bCol];
        this.board[bRow][bCol] = 0;
        this.movedNumbers.add(new PairOfCells(new Cell(bRow, bCol), new Cell(eRow, eCol)));
        return true;
    }

    private boolean move(int row, int col, int rowDir, int colDir) {
        boolean moved = false;
        for (; this.onBoard(new Cell(row, col)); row += rowDir, col += colDir) {
            if (this.board[row][col] != 0) {
                moved |= this.moveDirection(row, col, -rowDir, -colDir);
            }
        }
        return moved;
    }

    public EndOfGame play(Direction direction) {
        this.newNumbers.clear();
        this.movedNumbers.clear();
        boolean moved = false;
        Map<Direction, Integer> SIZE = Map.of(Direction.TOP, this.COLS, Direction.BOTTOM, this.COLS, Direction.LEFT,
                this.ROWS, Direction.RIGHT, this.ROWS);
        for (int j = 0; j < SIZE.get(direction); j++) {
            Map<Direction, CellDirection> obj = Map.of(Direction.TOP, new CellDirection(0, j, 1, 0), Direction.BOTTOM,
                    new CellDirection(this.ROWS - 1, j, -1, 0),
                    Direction.LEFT, new CellDirection(j, 0, 0, 1), Direction.RIGHT,
                    new CellDirection(j, this.COLS - 1, 0, -1));
            CellDirection m = obj.get(direction);
            moved |= this.move(m.getRow(), m.getCol(), m.getRowDir(), m.getColDir());
        }
        if (moved) {
            List<Cell> empty = this.listOfCells(0);
            Cell cell = empty.get(random.nextInt(empty.size()));
            this.getRandomValue(cell);
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
        if (list.isEmpty() && this.lostGame()) {
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

}
