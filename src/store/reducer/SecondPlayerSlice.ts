import { createSlice } from '@reduxjs/toolkit';
import { AllShips, PlacedShip, Ship } from '../../common/models/ship-models.ts';

export interface SecondPlayerParams {
  availableShips: Ship[];
  placedShips: PlacedShip[];
}

const initialState: SecondPlayerParams = {
  availableShips: AllShips,
  placedShips: []
};

const secondPlayerSlice = createSlice({
  name: 'secondPlayer',
  initialState,
  reducers: {},
});

export const secondPlayerReducer = secondPlayerSlice.reducer;

export const secondPlayerActions = secondPlayerSlice.actions;
