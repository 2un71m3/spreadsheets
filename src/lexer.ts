export class Lexer {
    readonly SYMBOL_DELIMETER = '|';
    readonly SYMBOL_LABEL = '!';
    readonly SYMBOL_LABEL_REF = '@';
    readonly SYMBOL_EXPRESSION = '=';

    readonly MATCH_COLUMN_NAME = /(?<name>[A-Z]+)(?<row>[1-9]+)/;
    readonly MATCH_LABEL_OFFSET = /\<(?<offset>\d+)\>/;

    public parseColumns(data: string): string[] {
        return data.split(this.SYMBOL_DELIMETER);
    }

    public parseGridReference(reference: string): {rowIdx: number, columnIdx: number} {
        let match = reference.match(this.MATCH_COLUMN_NAME);
        if (match === null || match.length == 0 || match.groups == undefined) {
            throw new Error('Couldn\'t parse grid reference: ' + reference);
        }
        let columnIdx = this.columnNameToIdx(match.groups.name);
        let rowIdx = parseInt(match.groups.row) - 1;
        return {rowIdx, columnIdx};
    }

    public parseLabelReference(reference: string): {label: string, offset: number} {
        let match = reference.match(this.MATCH_LABEL_OFFSET);
        if (match === null || match.length == 0 || match.groups == undefined) {
            throw new Error('Couldn\'t find row number in the label reference: ' + reference);
        }
        let offset = parseInt(match.groups.offset);
        if (offset < 0) {
            throw new Error('Invalid row number in the reference: ' + reference);
        }
        let label = reference.substring(0, reference.indexOf('<')).replace(this.SYMBOL_LABEL_REF, this.SYMBOL_LABEL);
        return {label, offset};
    }

    public isLabel(data: string): boolean {
        return data.startsWith(this.SYMBOL_LABEL);
    }

    public isExpression(data: string): boolean {
        return data.startsWith(this.SYMBOL_EXPRESSION);
    }

    public columnNameToIdx(name: string): number {
        let number = 0;
        for (let i = 0; i < name.length; i++) {
            number = number * 26 + (name.charCodeAt(i) - 64);
        }
        return number - 1;
    }

    public idxToColumnName(index: number): string {
        index++;
        let name = '';
        while (index > 0) {
            let modulo = (index - 1) % 26;
            name = String.fromCharCode(65 + modulo) + name;
            index = Math.floor((index - modulo) / 26);
        }
        return name;
    }
}
