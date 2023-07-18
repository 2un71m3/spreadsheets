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

// Registry is a component that controls writing to data storage,
// maintains all references and indexes related to that data
// and also enables searching with grid references/labels
export class Registry {
    private sheet: Spreadsheet;
    private lexer: Lexer;
    private cellReferenceFactory: CellReferenceFactory;

    // index for "@label<n>" search (key is "@label" name)
    private labelsIndex: Record<string, CellReference> = {};
    // index for fast access to all expressions (key is "(A..Z)n" reference)
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
        // add an empty row first to receive the new row's numeric index
        let rowIdx = this.getSheet().addRow();
        // write cell data into storage and update all relevant indexes
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

    // allows easy iteration over all expressions
    public* expressionsGenerator(): Generator<CellReference> {
        for (let key in this.expressionsIndex) {
            yield this.expressionsIndex[key];
        }
    }

    // searchGrid with "(A..Z)n" reference
    public searchGrid(reference: string): Cell | null {
        let {rowIdx, columnIdx} = this.lexer.parseGridReference(reference);
        let cell = this.getSheet().getCell(rowIdx, columnIdx);
        if (cell === undefined) {
            return null;
        }
        return cell;
    }

    // searchAtLabel with "@label<n>" reference
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

    private addLabel(cell: Cell, rowIdx: number, columnIdx: number): string | null {
        let key = cell.getContent();
        if (key.length == 0) {
            return null;
        }
        if (key in this.labelsIndex) {
            throw new Error('Duplicate label found: ' + key);
        }
        this.labelsIndex[key] = this.cellReferenceFactory.create(rowIdx, columnIdx);
        return key;
    }

    private addExpression(rowIdx: number, columnIdx: number): string {
        let cellReference = this.cellReferenceFactory.create(rowIdx, columnIdx);
        let columnName = this.lexer.idxToColumnName(cellReference.getColumnIdx());
        let key = columnName + rowIdx;
        this.expressionsIndex[key] = cellReference;
        return key;
    }
}
