import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
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

type PersistedReducer = Reducer<unknown, AnyAction>;

const editorPersistConfig = {
  key: 'editor',
  storage,
  whitelist: ['layout', 'components'],
};

export const store = configureStore({
  reducer: {
    editor: persistReducer(
      editorPersistConfig,
      editorReducer
    ) as PersistedReducer,
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
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
