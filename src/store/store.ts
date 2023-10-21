import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


import { rootReducer } from './reducers.ts';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'gameParamsReducer',
    'firstPlayerReducer',
    'secondPlayerReducer',
    'computerReducer',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
});

export const persistor = persistStore(store);
export default store

export type RootState = ReturnType<typeof rootReducer>;
