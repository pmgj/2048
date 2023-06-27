package model;

public class CellValue {
    private Cell cell;
    private int value;

    public CellValue(Cell cell, int value) {
        this.cell = cell;
        this.value = value;
    }

    public Cell getCell() {
        return cell;
    }

    public int getValue() {
        return value;
    }
}
