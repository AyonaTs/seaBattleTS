import {gameParamsActions} from "./reducer/GameSlice.ts";
import {useDispatch} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";

const actions = {
  ...gameParamsActions,
};

export const useActions = () => {
  return bindActionCreators(actions, useDispatch());
};