import { FC } from 'react';
import { PlayerFleet } from './PlayerFleet';
import { PlayerBoard } from './PlayerBoard';
import { ComputerBoard } from './ComputerBoard.js';
import { PlayerTips } from './PlayerTips';
import { GameStateType } from '../models/game-models.ts';
import { PlacedShip, Ship } from '../models/ship-models.ts';
import { Hit } from '../models/hit-models.ts';



interface GamePageProps {
  handleComputerTurn: () => void;
  checkIfGameOver: () => boolean;
  currentlyPlacingFirstUser:PlacedShip | null;
  firstUser:string;
  hitsByComputer: Hit[];
  placedFirstPlayerShips: PlacedShip[];
  gameState: GameStateType;
  computerShips:PlacedShip[];
  hitsByFirstPlayer: Hit[]
  availableFirstPlayerShips: Ship[]

}

export const GameView: FC<GamePageProps> = (
  {
    handleComputerTurn,
    checkIfGameOver,
    firstUser,
    hitsByComputer,
    currentlyPlacingFirstUser,
    placedFirstPlayerShips,
    gameState,
    computerShips,
    hitsByFirstPlayer,
    availableFirstPlayerShips}) => {


  return (
    <section className="game-screen">
      <PlayerBoard
        currentlyPlacingFirstUser={currentlyPlacingFirstUser}
        firstUser={firstUser}
        hitsByComputer={hitsByComputer}
        placedFirstPlayerShips={placedFirstPlayerShips}/>

      {gameState !== GameStateType.Placement
        ? <PlayerTips/>
        : <PlayerFleet
          availableFirstPlayerShips={availableFirstPlayerShips}
          currentlyPlacingFirstUser={currentlyPlacingFirstUser}/>}

      <ComputerBoard
        handleComputerTurn={handleComputerTurn}
        checkIfGameOver={checkIfGameOver}
        computerShips={computerShips}
        gameState={gameState}
        hitsByFirstPlayer={hitsByFirstPlayer}/>
    </section>
  );
};
