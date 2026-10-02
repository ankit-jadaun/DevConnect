import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: [],
  reducers: {
    addConnections: (state, action) => {
      return action.payload;
    },
    clearConnections: () => {
      return [];
    },
  },
});

export const { addConnections, clearConnections } = connectionSlice.actions;

export default connectionSlice.reducer;