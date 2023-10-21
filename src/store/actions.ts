import { gameParamsActions } from './reducer/GameSlice.ts';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { firstPlayerActions } from './reducer/FirstPlayerSlice.ts';
import { secondPlayerActions } from './reducer/SecondPlayerSlice.ts';
import { computerActions } from './reducer/ComputerSlice.ts';

const actions = {
  ...gameParamsActions,
  ...firstPlayerActions,
  ...secondPlayerActions,
  ...computerActions,
};

export const useActions = () => {
  return bindActionCreators(actions, useDispatch());
};
