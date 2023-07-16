interface Registry {
    expressionsGenerator(): Generator<CellReference>;
    getCell(rowIdx: number, columnIdx: number): Cell;
    replaceCell(rowIdx: number, columnIdx: number, cell: Cell): void;
}

interface Lexer {}

interface CellFactory {
    newCell(content: string): Cell;
}

interface CellReference {
    getRowIdx(): number;
    getColumnIdx(): number;
}

interface Cell {
    getContent(): string;
}

export class Calculator {
    private registry: Registry;
    private lexer: Lexer;
    private cellFactory: CellFactory;

    constructor(registry: Registry, lexer: Lexer, cellFactory: CellFactory) {
        this.registry = registry;
        this.lexer = lexer;
        this.cellFactory = cellFactory;
    }

    public process() {
        let generator = this.registry.expressionsGenerator();
        for (let cellReference of generator) {
            let result = this.evaluate(cellReference);
            let newCell = this.cellFactory.newCell(result);
            this.registry.replaceCell(cellReference.getRowIdx(), cellReference.getColumnIdx(), newCell);
        }
    }

    // incomplete
    private evaluate(cellReference: CellReference): string {
        let cell = this.registry.getCell(cellReference.getRowIdx(), cellReference.getColumnIdx());
        return cell.getContent();
    }
}
