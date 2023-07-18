// Spreadsheet is an abstract 2D data storage
export class Spreadsheet {
    private rows: any[][] = [];

    public getCell(rowIdx: number, columnIdx: number): any {
        return this.rows[rowIdx][columnIdx];
    }

    public addRow(): number {
        let rowIdx = this.rows.push([]) - 1;
        return rowIdx;
    }

    public addCell(rowIdx: number, cell: any): number {
        let columnIdx = this.rows[rowIdx].push(cell) - 1;
        return columnIdx;
    }

    public replaceCell(rowIdx: number, columnIdx: number, cell: any): void {
        this.rows[rowIdx][columnIdx] = cell;
    }
}
