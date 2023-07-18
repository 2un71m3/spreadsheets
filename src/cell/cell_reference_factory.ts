import { CellReference } from './cell_reference';

export class CellReferenceFactory {
    public create(rowIdx: number, columnIdx: number): CellReference {
        return new CellReference(rowIdx, columnIdx);
    }
}
