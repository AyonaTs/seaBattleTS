import {
  calculateOverhang,
  canBePlaced,
  generateEmptyLayout,
  indexToCoords,
  putEntityInLayout
} from '../../utils/game-utils.ts';
import { CellState, cellToClass } from '../models/cell-models.ts';
import { useActions } from '../../store/actions.ts';
import { PlacedShip } from '../models/ship-models.ts';
import { Hit } from '../models/hit-models.ts';
import { FC } from 'react';

interface PlayerBoardProps {
  firstUser: string,
  placedFirstPlayerShips: PlacedShip[]
  currentlyPlacingFirstUser: PlacedShip | null
  hitsByComputer: Hit[]
}

export const PlayerBoard: FC<PlayerBoardProps> = ({firstUser, placedFirstPlayerShips, currentlyPlacingFirstUser, hitsByComputer}) => {
  const action = useActions();
  let layout = placedFirstPlayerShips.reduce(
    (prevLayout, currentShip) =>
      putEntityInLayout(prevLayout, currentShip, CellState.ship),
    generateEmptyLayout()
  );

  // Hits by computer
  layout = hitsByComputer.reduce(
    (prevLayout, currentHit) =>
      putEntityInLayout(prevLayout, currentHit, currentHit.type),
    layout
  );

  layout = placedFirstPlayerShips.reduce(
    (prevLayout, currentShip) =>
      currentShip.sunk
        ? putEntityInLayout(prevLayout, currentShip, CellState.ship_sunk)
        : prevLayout,
    layout
  );

  const isPlacingOverBoard = currentlyPlacingFirstUser && currentlyPlacingFirstUser.position != null;
  const canPlaceCurrentShip = isPlacingOverBoard && canBePlaced(currentlyPlacingFirstUser, layout);

  if (isPlacingOverBoard) {
    if (canPlaceCurrentShip) {
      layout = putEntityInLayout(layout, currentlyPlacingFirstUser, CellState.ship);
    } else {
      let forbiddenShip = {
        ...currentlyPlacingFirstUser,
        length: currentlyPlacingFirstUser?.length - calculateOverhang(currentlyPlacingFirstUser),
      };
      layout = putEntityInLayout(layout, forbiddenShip, CellState.forbidden);
    }
  }

  let squares = layout.map((square: CellState, index: number) => {
    return (
      <div
        onWheel={() => {
          action.rotateFirstPlayerShip();
        }}

        onClick={() => {
          if (canPlaceCurrentShip) {
            action.placeShip({currentlyPlacing: currentlyPlacingFirstUser});
          }
        }}
        className={`square ${cellToClass[square]}`}
        key={`square-${index}`}
        id={`square-${index}`}
        onMouseOver={() => {
          if (currentlyPlacingFirstUser) {
            action.setCurrentlyPlacingFirstPlayer({
              newCurrentlyPlacing: {
                ...currentlyPlacingFirstUser,
                position: indexToCoords(index),
              }
            });
          }
        }}
      />
    );
  });

  return (
    <div>
      <h2 className="player-title">{firstUser}</h2>
      <div className="board">{squares}</div>
    </div>
  );
};
