export interface Ship {
  id: number;
  name?: string;
  type: ShipType;
  length: number;
  placed: boolean | null;
  owner?: 'firstUser' | 'secondUser' | 'ai';
  sunk: boolean;
}

export interface PlacedShip extends Ship {
  orientation: Orientation,
  position: { x: number; y: number },
}

enum ShipType {
  BATTLESHIP = 'battleship',
  CRUISER = 'cruiser',
  DESTROYER = 'destroyer',
  BOAT = 'boat'
}

const ShipLength: Record<ShipType, number> = {
  [ShipType.BATTLESHIP]: 4,
  [ShipType.CRUISER]: 3,
  [ShipType.DESTROYER]: 2,
  [ShipType.BOAT]: 1,
};

export enum Orientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export const AllShips: Ship[] = [
  {
    id: 1,
    type: ShipType.BATTLESHIP,
    length: ShipLength.battleship,
    placed: null,
    sunk: false
  },
  {
    id: 2,
    type: ShipType.CRUISER,
    length: ShipLength.cruiser,
    placed: null,
    sunk: false
  },
  {
    id: 3,
    type: ShipType.CRUISER,
    length: ShipLength.cruiser,
    placed: null,
    sunk: false
  },
  {
    id: 4,
    type: ShipType.DESTROYER,
    length: ShipLength.destroyer,
    placed: null,
    sunk: false
  },
  {
    id: 5,
    type: ShipType.DESTROYER,
    length: ShipLength.destroyer,
    placed: null,
    sunk: false
  },
  {
    id: 6,
    type: ShipType.DESTROYER,
    length: ShipLength.destroyer,
    placed: null,
    sunk: false
  },

  {
    id: 7,
    type: ShipType.BOAT,
    length: ShipLength.boat,
    placed: null,
    sunk: false
  },
  {
    id: 8,
    type: ShipType.BOAT,
    length: ShipLength.boat,
    placed: null,
    sunk: false
  },
  {
    id: 9,
    type: ShipType.BOAT,
    length: ShipLength.boat,
    placed: null,
    sunk: false
  },
  {
    id: 10,
    type: ShipType.BOAT,
    length: ShipLength.boat,
    placed: null,
    sunk: false
  },
];
