export enum CellState {
  empty = 'empty',
  ship = 'ship',
  hit = 'hit',
  miss = 'miss',
  ship_sunk = 'ship-sunk',
  forbidden = 'forbidden',
  awaiting = 'awaiting',
}

export const cellToClass: Record<CellState, string> = {
  [CellState.empty]: 'empty',
  [CellState.ship]: 'ship',
  [CellState.hit]: 'hit',
  [CellState.miss]: 'miss',
  [CellState.ship_sunk]: 'ship-sunk',
  [CellState.forbidden]: 'forbidden',
  [CellState.awaiting]: 'awaiting',
};
