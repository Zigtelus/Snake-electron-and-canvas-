// store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers'; // Создайте редукторы для вашего приложения

const store = configureStore({
  reducer: rootReducer,
  // Вы можете добавить middleware, улучшения и другие конфигурации здесь
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
