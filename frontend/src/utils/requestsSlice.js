import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      return state.filter((request) => request._id !== action.payload);
    },
    clearRequests: () => {
      return [];
    },
  },
});

export const { addRequests, removeRequest, clearRequests } = requestSlice.actions;

export default requestSlice.reducer;