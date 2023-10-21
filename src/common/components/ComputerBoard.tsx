import { FC } from 'react';
import { PlacedShip, Ship } from '../models/ship-models.ts';
import { GameStateType } from '../models/game-models.ts';
import { Hit } from '../models/hit-models.ts';
import { CellState, cellToClass } from '../models/cell-models.ts';
import { generateEmptyLayout, indexToCoords, putEntityInLayout, updateSunkShips } from '../../utils/game-utils.ts';
import { useActions } from '../../store/actions.ts';

interface ComputerBoardProps {
  handleComputerTurn: () => void;
  checkIfGameOver: () => boolean;
  computerShips: PlacedShip[]
  hitsByFirstPlayer: Hit[]
  gameState: GameStateType
}

export const ComputerBoard: FC<ComputerBoardProps> = ({handleComputerTurn, checkIfGameOver,computerShips,hitsByFirstPlayer,gameState}) => {
  const action = useActions();

  let compLayout = computerShips.reduce(
    (prevLayout: Array<CellState>, currentShip: PlacedShip) =>
      putEntityInLayout(prevLayout, currentShip, CellState.ship),
    generateEmptyLayout()
  );

 //Добавить удары, нанесенные игроком
  compLayout = hitsByFirstPlayer.reduce(
    (prevLayout: Array<CellState>, currentHit: Hit) =>
      putEntityInLayout(prevLayout, currentHit, currentHit.type),
    compLayout
  );

  compLayout = computerShips.reduce(
    (prevLayout, currentShip: PlacedShip) =>
      currentShip.sunk
        ? putEntityInLayout(prevLayout, currentShip, CellState.ship_sunk)
        : prevLayout,
    compLayout
  );


  const fireTorpedo = (index: number) => {
    if (compLayout[index] === CellState.ship) {
      const newHits = [
        ...hitsByFirstPlayer,
        {
          position: indexToCoords(index),
          type: CellState.hit,
        },
      ];
      action.setHitsByFirstPlayer({newHits});
      return newHits;
    }
    if (compLayout[index] === CellState.empty) {
      const newHits = [
        ...hitsByFirstPlayer,
        {
          position: indexToCoords(index),
          type: CellState.miss,
        },
      ];
      action.setHitsByFirstPlayer({newHits});
      return newHits;
    }
  };

  const playerTurn = gameState === GameStateType.FirstPlayerTurn;
  const playerCanFire = playerTurn && !checkIfGameOver();

  let alreadyHit = (index: number) =>
    compLayout[index] === 'hit' ||
    compLayout[index] === 'miss' ||
    compLayout[index] === 'ship-sunk';

  let compSquares = compLayout.map((square: CellState, index: number) => {
    return (
      <div
        // Отображать квадрат только в том случае, если это попадание, промах или затонувший корабль
        className={
          cellToClass[square] === 'hit' ||
          cellToClass[square] === 'miss' ||
          cellToClass[square] === 'ship-sunk'
            ? `square ${cellToClass[square]}`
            : `square`
        }
        key={`comp-square-${index}`}
        id={`comp-square-${index}`}
        onClick={() => {
          if (playerCanFire && !alreadyHit(index)) {
            const newHits = fireTorpedo(index) || [];
            const shipsWithSunkFlag = updateSunkShips(newHits, computerShips);
            const sunkShipsAfter = shipsWithSunkFlag.filter((ship: Ship) => ship.sunk).length;
            const sunkShipsBefore = computerShips.filter((ship: Ship) => ship.sunk).length;
            if (sunkShipsAfter > sunkShipsBefore) {
              console.log('sunkShipsAfter > sunkShipsBefore');
            }
            action.updateComputerSunkShips({ships: shipsWithSunkFlag});
            handleComputerTurn();
          }
        }}
      />
    );
  });

  return (
    <div>
      <h2 className="player-title">Компьютер</h2>
      <div className="board">{compSquares}</div>
    </div>
  );
};
