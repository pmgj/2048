package model;

public class CellValue {
    private Cell cell;
    private String value;

    public CellValue(Cell cell, String value) {
        this.cell = cell;
        this.value = value;
    }

    public Cell getCell() {
        return cell;
    }

    public String getValue() {
        return value;
    }
}
