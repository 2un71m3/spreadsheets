interface Registry {
    addRow(cells: any[]): number;
}

interface Lexer {
    parseColumns(content: string): string[];
}

interface CellFactory {
    newCell(content: string): any;
}

// Parser receives the input data,
// converts it into the internal representation
// and passes it to the Registry/storage
export class Parser {
    private registry: Registry;
    private lexer: Lexer;
    private cellFactory: CellFactory;

    constructor(registry: Registry, lexer: Lexer, cellFactory: CellFactory) {
        this.registry = registry;
        this.lexer = lexer;
        this.cellFactory = cellFactory;
    }

    public consume(data: string): number {
        let cells = this.lexer.parseColumns(data);
        cells = cells.map(cell => this.cellFactory.newCell(cell));
        let rowIdx = this.registry.addRow(cells);
        return rowIdx;
    }
}
