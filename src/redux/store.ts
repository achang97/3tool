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
import { setupListeners } from '@reduxjs/toolkit/query';
import storage from 'redux-persist/lib/storage';
import editorReducer from './features/editorSlice';
import contractsReducer from './features/contractsSlice';
import { toolsApi } from './services/tools';
import { resourcesApi } from './services/resources';

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
    [toolsApi.reducerPath]: toolsApi.reducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewareConfig = {
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    };
    const apiMiddlewares = [toolsApi.middleware, resourcesApi.middleware];

    const middleware = getDefaultMiddleware(middlewareConfig).concat(
      ...apiMiddlewares
    );

    return middleware;
  },
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
