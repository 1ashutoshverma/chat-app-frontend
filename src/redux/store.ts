import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";


const store = configureStore({reducer:{
    auth:authReducer
}})

export {store}
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch