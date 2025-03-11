import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./reducers";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: rootReducer,
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
