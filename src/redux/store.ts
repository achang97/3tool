import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import editorReducer from './features/editorSlice';
import contractsReducer from './features/contractsSlice';

const editorPersistConfig = {
  key: 'editor',
  storage,
  whitelist: ['layout', 'components'],
};

export const store = configureStore({
  reducer: {
    // @ts-ignore Type check should not use unknown type
    editor: persistReducer(editorPersistConfig, editorReducer),
    contracts: contractsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
