import { DuplicateCell } from './DuplicateCell.tsx';
import { FC } from 'react';
import { Button } from 'antd';
import { useActions } from '../../store/actions.ts';
import { PlacedShip, Ship } from '../models/ship-models.ts';
import Restart from './Restart.tsx';
import {
  canBePlaced,
  generateEmptyLayout,
  putEntityInLayout,
  randomizeShipProps
} from '../../utils/game-utils.ts';
import { CellState } from '../models/cell-models.ts';

interface PlayerFleetProps {
  availableFirstPlayerShips: Ship[]
  currentlyPlacingFirstUser: PlacedShip | null
}

export const PlayerFleet: FC<PlayerFleetProps> = ({availableFirstPlayerShips, currentlyPlacingFirstUser}) => {
  const action = useActions();
  let shipsIds = availableFirstPlayerShips.map((ship) => ship.id);

  const handleStart = () => {
    action.generateComputerShips();
    action.startGame();
  };

  // Для каждого корабля, который все еще доступен, вовращаем ячейку-копию
  // с названием корабля и количеством квадратов, равным его длине
  let shipDuplicateCells = shipsIds.map((shipId) => (
    <DuplicateCell
      selectShip={(shipId) => action.selectFirstPlayerShip({shipId})}
      key={shipId}
      isCurrentlyPlacing={currentlyPlacingFirstUser && currentlyPlacingFirstUser.id === shipId}
      shipId={shipId}
      availableShips={availableFirstPlayerShips}
    />
  ));
  const handleRandomShips = () => {
    let newLayout = generateEmptyLayout();
    let placedShips = [ ] as PlacedShip[]

    // Размещаем каждый корабль случайным образом на макете
    availableFirstPlayerShips.forEach((ship) => {
      let decoratedShip = randomizeShipProps(ship) as PlacedShip;

      while (true) {
        if (canBePlaced(decoratedShip, newLayout)) {
          newLayout = putEntityInLayout(newLayout, decoratedShip, CellState.ship);
          placedShips.push(decoratedShip)
          break;
        } else {
          // Если корабль не может быть размещен, случайным образом меняем его ориентацию и позицию и пробуем снова
          decoratedShip = randomizeShipProps(decoratedShip);
        }
      }
    });

    action.setPlacedFirstPlayerShips({newPlacedShips: placedShips})
    action.setEmptyAvailableFirstPlayerShips()
  };
  const fleet = (
    <div className="dup-fleet-wrapper">
      <div className="dup-fleet">
        {shipDuplicateCells
        }</div>

      <div className="dup-fleet-controls">  <Button
        type="primary"
        shape="round"
        id="play-button" onClick={handleRandomShips}>
        Расставить случайно
      </Button>
        <Restart/></div>

    </div>
  );

  const playButton = (
    <div className="play-ready">
      <p className="player-tip">Нет доступных кораблей</p>
      <Restart />
      <Button
        type="primary"
        shape="round"
        id="play-button" onClick={handleStart}>
        Начать игру
      </Button>
    </div>
  );

  return (
    <div className="available-ships">
      {availableFirstPlayerShips.length > 0 ? fleet : playButton}
    </div>
  );
};
