package model;

public class CellDirection {
    private int row;
    private int col;
    private int rowDir;
    private int colDir;

    public CellDirection(int row, int col, int rowDir, int colDir) {
        this.row = row;
        this.col = col;
        this.rowDir = rowDir;
        this.colDir = colDir;
    }

    public int getCol() {
        return col;
    }

    public int getColDir() {
        return colDir;
    }

    public int getRow() {
        return row;
    }

    public int getRowDir() {
        return rowDir;
    }
}
