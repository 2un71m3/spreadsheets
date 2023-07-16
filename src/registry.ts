interface Lexer {
    parseGridReference(reference: string): {rowIdx: number, columnIdx: number};
    parseLabelReference(reference: string): {label: string, offset: number};
    idxToColumnName(index: number): string;
}

interface Spreadsheet {
    getCell(rowIdx: number, columnIdx: number): Cell;
    addRow(): number;
    addCell(rowIdx: number, cell: Cell): number;
    replaceCell(rowIdx: number, columnIdx: number, cell: any): void;
}

interface Cell {
    getContent(): string;
    isLabel(): boolean;
    isExpression(): boolean;
}

interface CellReference {
    getRowIdx(): number;
    getColumnIdx(): number;
}

interface CellReferenceFactory {
    create(rowIdx: number, columnIdx: number): CellReference;
}

export class Registry {
    private sheet: Spreadsheet;
    private lexer: Lexer;
    private cellReferenceFactory: CellReferenceFactory;

    private labelsIndex: Record<string, CellReference> = {};
    private expressionsIndex: Record<string, CellReference> = {};

    constructor(sheet: Spreadsheet, lexer: Lexer, cellReferenceFactory: CellReferenceFactory) {
        this.sheet = sheet;
        this.lexer = lexer;
        this.cellReferenceFactory = cellReferenceFactory;
    }

    public getCell(rowIdx: number, columnIdx: number): Cell {
        return this.getSheet().getCell(rowIdx, columnIdx);
    }

    public addRow(cells: Cell[]): number {
        let rowIdx = this.getSheet().addRow();
        cells.forEach(cell => {
            let columnIdx = this.getSheet().addCell(rowIdx, cell);
            if (cell.isLabel()) {
                this.addLabel(cell, rowIdx, columnIdx);
            } else if (cell.isExpression()) {
                this.addExpression(rowIdx, columnIdx);
            }
        });
        return rowIdx;
    }

    public replaceCell(rowIdx: number, columnIdx: number, cell: Cell): void {
        this.getSheet().replaceCell(rowIdx, columnIdx, cell);
    }

    public* expressionsGenerator(): Generator<CellReference> {
        for (let key in this.expressionsIndex) {
            yield this.expressionsIndex[key];
        }
    }

    public searchGrid(reference: string): Cell | null {
        let {rowIdx, columnIdx} = this.lexer.parseGridReference(reference);
        let cell = this.getSheet().getCell(rowIdx, columnIdx);
        if (cell === undefined) {
            return null;
        }
        return cell;
    }

    public searchAtLabel(reference: string): Cell | null {
        let {label, offset} = this.lexer.parseLabelReference(reference);
        if (!(label in this.labelsIndex)) {
            throw new Error('Label is not found in the index: ' + label);
        }
        let labelReference = this.labelsIndex[label];
        let cell = this.getSheet().getCell(labelReference.getRowIdx() + offset, labelReference.getColumnIdx());
        if (cell === undefined) {
            return null;
        }
        return cell;
    }

    private getSheet(): Spreadsheet {
        return this.sheet;
    }

    private addLabel(cell: Cell, rowIdx: number, columnIdx: number) {
        let key = cell.getContent();
        if (key.length == 0) {
            return;
        }
        if (key in this.labelsIndex) {
            throw new Error('Duplicate label found: ' + key);
        }
        this.labelsIndex[key] = this.cellReferenceFactory.create(rowIdx, columnIdx);
    }

    private addExpression(rowIdx: number, columnIdx: number) {
        let cellReference = this.cellReferenceFactory.create(rowIdx, columnIdx);
        let columnName = this.lexer.idxToColumnName(cellReference.getColumnIdx());
        let key = columnName + rowIdx;
        this.expressionsIndex[key] = cellReference;
    }
}
