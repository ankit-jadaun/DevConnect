import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      if (!state.users) {
        return;
      } // 
      state.users = state.users.filter(
        (user) => user._id !== action.payload
      );
    },
    clearFeed: () => {
      return [];
    },
  },
});

export const { addFeed, removeUserFromFeed, clearFeed } =
  feedSlice.actions;

export default feedSlice.reducer;