export class Spreadsheet {
    private rows: any[][] = [];

    public getCell(rowIdx: number, columnIdx: number): any {
        return this.rows[rowIdx][columnIdx];
    }

    public addRow(): number {
        return this.rows.push([]) - 1;
    }

    public addCell(rowIdx: number, cell: any): number {
        return this.rows[rowIdx].push(cell) - 1;
    }

    public replaceCell(rowIdx: number, columnIdx: number, cell: any): void {
        this.rows[rowIdx][columnIdx] = cell;
    }
}
