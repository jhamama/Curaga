import { combineReducers } from "@reduxjs/toolkit";
import LabellerReducer from "./slices/labeller/labeller.slice";

export const rootReducer = combineReducers({
  labeller: LabellerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
