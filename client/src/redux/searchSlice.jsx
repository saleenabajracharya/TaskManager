import { createSlice } from '@reduxjs/toolkit';

// Creating a slice for search functionality
export const searchSlice = createSlice({
  name: 'search',  
  initialState: {
    query: '', 
  },
  reducers: {
    // Reducer to update the search query
    setSearchQuery: (state, action) => {
      state.query = action.payload;  
    },
  },
});

export const { setSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
