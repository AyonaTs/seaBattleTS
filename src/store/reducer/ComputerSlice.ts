import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hit } from '../../common/models/hit-models.ts';
import { AllShips, PlacedShip } from '../../common/models/ship-models.ts';
import { placeAllComputerShips } from '../../utils/game-utils.ts';

export interface ComputerParams {
  computerShips: PlacedShip[];
  hitsByComputer: Hit[];
}

const initialState: ComputerParams = {
  computerShips: [],
  hitsByComputer: []
};

interface SetHitsByComputerPayload {
  newHits: Hit[];
}

interface UpdateSunkShipsPayload {
  ships: PlacedShip[];
}

const computerSlice = createSlice({
  name: 'computer',
  initialState,
  reducers: {
    generateComputerShips(state,) {
      state.computerShips = placeAllComputerShips(AllShips.slice());
    },
    setHitsByComputer(state, action: PayloadAction<SetHitsByComputerPayload>) {
      state.hitsByComputer = action.payload.newHits;
    },
    updateComputerSunkShips(state, action: PayloadAction<UpdateSunkShipsPayload>) {
      state.computerShips = action.payload.ships;
    },
    restartComputer(state) {
      state.computerShips = [];
      state.hitsByComputer = [];
    }
  },
});

export const computerReducer = computerSlice.reducer;

export const computerActions = computerSlice.actions;
