import { Cell, CellType } from './cell';

interface Lexer {
    isLabel(data: string): boolean;
    isExpression(data: string): boolean;
}

export class CellFactory {
    private lexer: Lexer;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
    }

    public newCell(data: string) {
        if (this.lexer.isLabel(data)) {
            return new Cell(CellType.Label, data);
        }
        if (this.lexer.isExpression(data)) {
            return new Cell(CellType.Expression, data);
        }
        return new Cell(CellType.Plain, data);
    }
}
