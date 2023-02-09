import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import editorSlice from "./editorSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  editor: editorSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * store global do projeto
 */
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

/**
 * Tipo o qual define toda a store
 */
export type RootState = ReturnType<typeof store.getState>;

export default store;

export const persistor = persistStore(store);
