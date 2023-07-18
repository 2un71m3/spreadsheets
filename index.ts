import fs from 'fs';
import readline from 'readline';
import { Spreadsheet } from './src/spreadsheet';
import { Lexer } from './src/lexer';
import { CellReferenceFactory } from './src/cell/cell_reference_factory';
import { Registry } from './src/registry';
import { CellFactory } from './src/cell/cell_factory';
import { Parser } from './src/parser';
import { Calculator } from './src/calculator';
import { inspect } from 'util';

const filename = 'transactions.csv';

async function main(): Promise<void> {
    let sheet = new Spreadsheet();
    let lexer = new Lexer();
    let cellReferenceFactory = new CellReferenceFactory();
    let registry = new Registry(sheet, lexer, cellReferenceFactory);
    let cellFactory = new CellFactory(lexer);
    let parser = new Parser(registry, lexer, cellFactory);
    let calculator = new Calculator(registry, lexer, cellFactory);

    const rl = readline.createInterface({
        input: fs.createReadStream(filename),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        parser.consume(line);
    }

    calculator.process();

    console.log(inspect(registry, true, 4) + '\n');
    console.log('Resolve "D2":\n' + inspect(registry.searchGrid('D2')) + '\n');
    console.log('Resolve "@adjusted_cost<1>":\n' + inspect(registry.searchAtLabel('@adjusted_cost<1>')) + '\n');
}

main();
