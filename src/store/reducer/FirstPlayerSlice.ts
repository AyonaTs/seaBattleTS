import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllShips, Orientation, PlacedShip, Ship } from '../../common/models/ship-models.ts';

import { Hit } from '../../common/models/hit-models.ts';


export interface FirstPlayerParams {
  currentlyPlacingFirstUser: PlacedShip | null;
  placedFirstPlayerShips: PlacedShip[];
  availableFirstPlayerShips: Ship[];
  hitsByFirstPlayer: Hit[];
}

const initialState: FirstPlayerParams = {
  currentlyPlacingFirstUser: null,
  placedFirstPlayerShips: [],
  availableFirstPlayerShips: AllShips,
  hitsByFirstPlayer: []
};

interface PlaceShipPayload {
  currentlyPlacing: PlacedShip;
}

interface SelectShipPayload {
  shipId: number;
}

interface SetCurrentlyPlacingFirstPlayerPayload {
  newCurrentlyPlacing: PlacedShip;
}

interface SetPlacedFirstPlayerShipsPayload {
  newPlacedShips: PlacedShip[];
}

interface SetHitsByFirsPlayer {
  newHits: Hit[];
}

const firstPlayerSlice = createSlice({
  name: 'firstPlayer',
  initialState,
  reducers: {

    placeShip(state, action: PayloadAction<PlaceShipPayload>) {
      state.placedFirstPlayerShips = ([...state.placedFirstPlayerShips, {
        ...action.payload.currentlyPlacing,
        placed: true
      }]);

      state.availableFirstPlayerShips = state.availableFirstPlayerShips.filter((ship) => ship.id !== action.payload.currentlyPlacing.id);

      state.currentlyPlacingFirstUser = {} as PlacedShip;

    },
    selectFirstPlayerShip(state, action: PayloadAction<SelectShipPayload>) {
      let shipIdx = state.availableFirstPlayerShips.findIndex((ship) => ship.id === action.payload.shipId);
      const shipToPlace = state.availableFirstPlayerShips[shipIdx];
      state.currentlyPlacingFirstUser = {
        ...shipToPlace,
        orientation: Orientation.HORIZONTAL,
        position: {x: -100, y: -100},
      };
    },

    rotateFirstPlayerShip(state) {
      if (state.currentlyPlacingFirstUser != null) {
        state.currentlyPlacingFirstUser = {
          ...state.currentlyPlacingFirstUser,
          orientation: state.currentlyPlacingFirstUser.orientation === Orientation.VERTICAL
            ? Orientation.HORIZONTAL
            : Orientation.VERTICAL,
        };
      }
    },
    setCurrentlyPlacingFirstPlayer(state, action: PayloadAction<SetCurrentlyPlacingFirstPlayerPayload>) {
      state.currentlyPlacingFirstUser = action.payload.newCurrentlyPlacing;
    },
    setPlacedFirstPlayerShips(state, action: PayloadAction<SetPlacedFirstPlayerShipsPayload>) {
      state.placedFirstPlayerShips = action.payload.newPlacedShips;
    },
    setEmptyAvailableFirstPlayerShips(state) {
      state.availableFirstPlayerShips = []
    },
    setHitsByFirstPlayer(state, action: PayloadAction<SetHitsByFirsPlayer>) {
      state.hitsByFirstPlayer = action.payload.newHits;
    },
    restartFirstUser(state) {
      state.placedFirstPlayerShips = ([]);
      state.availableFirstPlayerShips = AllShips;
      state.currentlyPlacingFirstUser = {} as PlacedShip;
      state.hitsByFirstPlayer = [];
    },
  },
});

export const firstPlayerReducer = firstPlayerSlice.reducer;

export const firstPlayerActions = firstPlayerSlice.actions;
