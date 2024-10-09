import { configureStore } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createWrapper } from 'next-redux-wrapper';
import editorReducer from './features/editorSlice';
import resourcesReducer from './features/resourcesSlice';
import activeToolReducer from './features/activeToolSlice';
import { toolsApi } from './services/tools';
import { resourcesApi } from './services/resources';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    resources: resourcesReducer,
    activeTool: activeToolReducer,
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
      // identifyMiddleware
    );

    return middleware;
  },
});

export const makeStore = () => store;

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(makeStore);
