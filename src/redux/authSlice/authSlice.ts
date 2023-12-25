import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"


export interface AuthState {
    name:string,
    isAuth:boolean,
}

const initialState: AuthState = {
    name : Cookies.get("name")||"", 
    isAuth : Cookies.get("name")?true:false, 
}

const authSlice = createSlice({
    name:"auth", 
    initialState, 
    reducers:{
        login:(state)=>{
            state.name = Cookies.get("name")||""
            state.isAuth = true
        },
        logout:(state)=>{
            state.name = ""
            state.isAuth = false
        }
    }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer