import { FC } from 'react';
import { Ship } from '../models/ship-models.ts';
import { CellState } from '../models/cell-models.ts';

interface DuplicateCellProps {
  availableShips: Ship[];
  shipId: number;
  selectShip: (shipId: number) => void;
  isCurrentlyPlacing?: boolean | null;
}

export const DuplicateCell: FC<DuplicateCellProps> = ({shipId, selectShip, availableShips, isCurrentlyPlacing,}) => {
  const ship = availableShips.find((item) => item.id === shipId) || {} as Ship;
  const shipLength = new Array(ship.length).fill(CellState.ship);
  const allDuplicateCells = shipLength.map((_, index) => (
    <div className="small-cell" key={index}/>
  ));

  return (
    <div
      id={`${ship.name}-dup`}
      onClick={() => selectShip(shipId)}
      key={`${ship.name}`}
      className={isCurrentlyPlacing ? 'dup placing' : 'dup'}
    >
      <div className="dup-title">{ship.name}</div>
      <div className="dup-squares">{allDuplicateCells}</div>
    </div>
  );
};
