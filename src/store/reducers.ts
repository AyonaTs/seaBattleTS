import { combineReducers } from '@reduxjs/toolkit';
import { gameParamsReducer } from './reducer/GameSlice.ts';
import { firstPlayerReducer } from './reducer/FirstPlayerSlice.ts';
import { secondPlayerReducer } from './reducer/SecondPlayerSlice.ts';
import { computerReducer } from './reducer/ComputerSlice.ts';

export const rootReducer = combineReducers({
  gameParamsReducer,
  firstPlayerReducer,
  secondPlayerReducer,
  computerReducer,
});
