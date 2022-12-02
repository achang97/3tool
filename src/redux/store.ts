import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import editorReducer from './features/editorSlice';
import contractsReducer from './features/contractsSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const editorPersistConfig = {
  key: 'editor',
  storage,
  whitelist: ['layout', 'components'],
};

const contractsPersistConfig = {
  key: 'contracts',
  storage,
  whitelist: ['configs'],
};

const rootReducer = combineReducers({
  editor: persistReducer(editorPersistConfig, editorReducer),
  contracts: persistReducer(contractsPersistConfig, contractsReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
