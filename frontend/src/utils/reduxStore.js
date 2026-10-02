import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import requestReducer from "./requestsSlice";
import connectionReducer from "./connectionSlice";

const reduxStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        request: requestReducer,
        connection: connectionReducer,
    },

});


export default reduxStore;