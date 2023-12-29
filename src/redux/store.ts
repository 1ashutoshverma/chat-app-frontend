import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import chatReducer from "./chatSlice/chatSlice";

const store = configureStore({reducer:{
    auth:authReducer,
    chat:chatReducer
}})

export {store}
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch