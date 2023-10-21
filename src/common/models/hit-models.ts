import { CellState } from './cell-models.ts';

export interface Hit {
  position: { x: number, y: number };
  type: CellState;
}
