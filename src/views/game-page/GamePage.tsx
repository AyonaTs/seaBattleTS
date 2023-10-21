import { Ship } from '../../common/models/ship-models.ts';
import { Hit } from '../../common/models/hit-models.ts';
import {
  coordsToIndex,
  generateEmptyLayout,
  generateRandomIndex,
  getNeighbors,
  indexToCoords,
  putEntityInLayout,
  updateSunkShips
} from '../../utils/game-utils.ts';
import { CellState } from '../../common/models/cell-models.ts';
import { GameView } from '../../common/components/GameView.tsx';
import { GameHeader } from '../../common/components/GameHeader.tsx';
import styles from './gamePage.module.scss';
import { useActions } from '../../store/actions.ts';
import { useAppSelector } from '../../store/redux.ts';


export const GamePage = () => {
  const action = useActions();
  const {gameState, firstUser} = useAppSelector((state) => state.gameParamsReducer);
  const {
    hitsByFirstPlayer,
    availableFirstPlayerShips,
    placedFirstPlayerShips,
    currentlyPlacingFirstUser
  } = useAppSelector((state) => state.firstPlayerReducer);
  const {hitsByComputer, computerShips} = useAppSelector((state) => state.computerReducer);

  const computerFire = (index: number, layout: Array<CellState>) => {
    let computerHits;

    if (layout[index] === CellState.ship) {
      computerHits = [
        ...hitsByComputer,
        {
          position: indexToCoords(index),
          type: CellState.hit,
        },
      ];
    }
    if (layout[index] === CellState.empty) {
      computerHits = [
        ...hitsByComputer,
        {
          position: indexToCoords(index),
          type: CellState.miss,
        },
      ];
    }
    const sunkShips = updateSunkShips(computerHits || [], placedFirstPlayerShips);
    const sunkShipsAfter = sunkShips.filter((ship: Ship) => ship.sunk).length;
    const sunkShipsBefore = placedFirstPlayerShips.filter((ship) => ship.sunk).length;
    if (sunkShipsAfter > sunkShipsBefore) {
      console.log('sunkShipsAfter > sunkShipsBefore');
    }
    action.setPlacedFirstPlayerShips({newPlacedShips: sunkShips});
    action.setHitsByComputer({newHits: computerHits as Hit[]});
  };

  const handleComputerTurn = () => {
    action.passMove();

    if (checkIfGameOver()) {
      return;
    }

    let layout = placedFirstPlayerShips.reduce(
      (prevLayout, currentShip) =>
        putEntityInLayout(prevLayout, currentShip, CellState.ship),
      generateEmptyLayout()
    );

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

    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === CellState.hit);

    let nonSunkComputerHits = successfulComputerHits.filter((hit) => {
      const hitIndex = coordsToIndex(hit.position);
      return layout[hitIndex] === CellState.hit;
    });

    let potentialTargets = nonSunkComputerHits
      .flatMap((hit) => getNeighbors(hit.position))
      .filter((idx) => layout[idx] === CellState.empty || layout[idx] === CellState.ship);

    // Until there's a successful hit
    if (potentialTargets.length === 0) {
      let layoutIndices = layout.map((_, idx) => idx);
      potentialTargets = layoutIndices.filter(
        (index) => layout[index] === CellState.ship || layout[index] === CellState.empty
      );
    }

    let randomIndex = generateRandomIndex(potentialTargets.length);

    let target = potentialTargets[randomIndex];

    setTimeout(() => {
      computerFire(target, layout);
      action.passMove();
    }, 300);
  };


  // Проверка на конец игры
  const checkIfGameOver = () => {
    let successfulPlayerHits = hitsByFirstPlayer.filter((hit) => hit.type === CellState.hit).length;
    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === CellState.hit)
      .length;

    if (successfulComputerHits === 20 || successfulPlayerHits === 20) {
      action.endGame();

      if (successfulComputerHits === 20) {
        action.setWinner({winner: 'computer'});
      }
      if (successfulPlayerHits === 20) {
        action.setWinner({winner: firstUser});
      }
      return true;
    }
    return false;
  };


  return (
    <div className={styles.gamePageWrapper}>
      <GameHeader/>
      <GameView
        handleComputerTurn={handleComputerTurn}
        checkIfGameOver={checkIfGameOver}
        availableFirstPlayerShips={availableFirstPlayerShips}
        computerShips={computerShips}
        currentlyPlacingFirstUser={currentlyPlacingFirstUser}
        firstUser={firstUser}
        gameState={gameState}
        hitsByComputer={hitsByComputer}
        hitsByFirstPlayer={hitsByFirstPlayer}
        placedFirstPlayerShips={placedFirstPlayerShips}/>
    </div>
  );
};
