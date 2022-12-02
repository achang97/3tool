import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
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
    editor: persistReducer(editorPersistConfig, editorReducer),
    contracts: contractsReducer,
  },
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
