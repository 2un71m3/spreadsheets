export enum CellType {
    Label = "label",
    Plain = "plain",
    Expression = "expression"
}

export class Cell {
    type: CellType = CellType.Plain;
    content: string;

    constructor(type: CellType, content: string) {
        this.type = type;
        this.content = content;
    }

    public getContent(): string {
        return this.content;
    }

    public isLabel(): boolean {
        return this.type == CellType.Label;
    }

    public isExpression(): boolean {
        return this.type == CellType.Expression;
    }
}
