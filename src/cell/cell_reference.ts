// CellReference is an entity that maintains relation between a single cell and its positioning on the grid
export class CellReference {
    private rowIdx: number;
    private columnIdx: number

    constructor(rowIdx: number, columnIdx: number) {
        this.rowIdx = rowIdx;
        this.columnIdx = columnIdx;
    }

    public getRowIdx(): number {
        return this.rowIdx;
    }

    public getColumnIdx(): number {
        return this.columnIdx;
    }
}
