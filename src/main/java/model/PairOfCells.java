package model;

public class PairOfCells {
    private final Cell beginCell;
    private final Cell endCell;

    public PairOfCells(Cell begin, Cell end) {
        this.beginCell = begin;
        this.endCell = end;
    }

    public Cell getBeginCell() {
        return beginCell;
    }

    public Cell getEndCell() {
        return endCell;
    }
}
