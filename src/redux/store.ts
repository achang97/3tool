import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
} from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createWrapper } from 'next-redux-wrapper';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './features/authSlice';
import editorReducer from './features/editorSlice';
import resourcesReducer from './features/resourcesSlice';
import activeToolReducer from './features/activeToolSlice';
import { authApi } from './services/auth';
import { toolsApi } from './services/tools';
import { resourcesApi } from './services/resources';
import { usersApi } from './services/users';
import { companiesApi } from './services/companies';
import { identifyMiddleware } from './middleware/identifyMiddleware';

const authPersistConfig = {
  key: 'auth',
  storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer<ReturnType<typeof authReducer>>(authPersistConfig, authReducer),
    editor: editorReducer,
    resources: resourcesReducer,
    activeTool: activeToolReducer,
    [authApi.reducerPath]: authApi.reducer,
    [toolsApi.reducerPath]: toolsApi.reducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewareConfig = {
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    };
    const apiMiddlewares = [
      authApi.middleware,
      toolsApi.middleware,
      resourcesApi.middleware,
      usersApi.middleware,
      companiesApi.middleware,
    ];

    const middleware = getDefaultMiddleware(middlewareConfig).concat(
      ...apiMiddlewares,
      identifyMiddleware
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
