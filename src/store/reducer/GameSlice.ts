import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface GameSlicePayload {
  firstUser: string;
  secondUser: string;
  gameType: string;
  playerType: string;
}

const initialState: GameSlicePayload = {
  firstUser: "",
  secondUser: "",
  gameType: "",
  playerType: "",

};

const gameParamsSlice = createSlice({
  name: 'GameParams',
  initialState,
  reducers: {
    setGameParams(state, action: PayloadAction<GameSlicePayload>) {
      state.firstUser = action.payload.firstUser;
      state.secondUser = action.payload.secondUser;
      state.gameType = action.payload.gameType;
      state.playerType = action.payload.playerType;

    },
  },
});

export const gameParamsReducer = gameParamsSlice.reducer;

export const gameParamsActions = gameParamsSlice.actions;
