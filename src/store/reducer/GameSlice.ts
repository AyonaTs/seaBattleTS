import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameMode, GameStateType, Opponent } from '../../common/models/game-models.ts';


export interface GameSlicePayload {
  firstUser: string;
  secondUser: string;
  gameMode: GameMode;
  opponent: Opponent;

}

export interface GameParams {
  firstUser: string;
  secondUser: string;
  gameMode: GameMode;
  opponent: Opponent;
  gameState: GameStateType;
  winner: string;
}

const initialState: GameParams = {
  firstUser: '',
  secondUser: '',
  winner: '',
  gameMode: GameMode.Miss,
  opponent: Opponent.Ai,
  gameState: GameStateType.Placement
};

interface setWinnerPayload {
  winner: string;
}

const gameParamsSlice = createSlice({
  name: 'GameParams',
  initialState,
  reducers: {
    setGameParams(state, action: PayloadAction<GameSlicePayload>) {
      state.firstUser = action.payload.firstUser;
      state.secondUser = action.payload.secondUser;
      state.gameMode = action.payload.gameMode;
      state.opponent = action.payload.opponent;
    },
    passMove(state) {
      if (state.opponent === Opponent.Ai) {
        state.gameState = state.gameState === GameStateType.FirstPlayerTurn ? GameStateType.ComputerTurn : GameStateType.FirstPlayerTurn;
        return;
      }
      state.gameState = state.gameState === GameStateType.FirstPlayerTurn ? GameStateType.SecondPlayerTurn : GameStateType.FirstPlayerTurn;
    },
    startGame(state) {
      state.gameState = GameStateType.FirstPlayerTurn;
    },
    endGame(state) {
      state.gameState = GameStateType.GameOver;
    },
    restartGame(state) {
      state.gameState = GameStateType.Placement;
      state.winner = '';
    },
    setWinner(state, action: PayloadAction<setWinnerPayload>) {
      state.winner = action.payload.winner;
    }
  },
});

export const gameParamsReducer = gameParamsSlice.reducer;

export const gameParamsActions = gameParamsSlice.actions;
