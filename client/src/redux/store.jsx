import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './SearchSlice';

// Configuring the Redux store with the search reducer
const store = configureStore({
  reducer: {
    search: searchReducer,  // Adding the search reducer to the store
  },
});

export default store;
