import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"


export interface ChatState {
    messages:any[],
    content:string,
    members:any[],
    newRoom:string,
    typeRoom:string,
    previousRoom:string,
    notifications:any,
    privateId:any,
    showLeftTab:boolean
}

const initialState: ChatState = {
    messages:[],
    content:"",
    members:[],
    newRoom:"Public Discussion",
    typeRoom:"chatroom",
    previousRoom:"",
    notifications:"",
    privateId:"",
    showLeftTab:true
}

const chatSlice = createSlice({
    name:"chat", 
    initialState, 
    reducers:{
      setMessage:(state,action: PayloadAction<any[]>)=>{
        state.messages=action.payload
      },
      setContent:(state,action: PayloadAction<string>)=>{
        state.content=action.payload
      },
      setMembers:(state,action: PayloadAction<any[]>)=>{
        state.members=action.payload
      },
      setNewRoom:(state,action: PayloadAction<string>)=>{
        state.newRoom=action.payload
      },
      setTypeRoom:(state,action: PayloadAction<string>)=>{
        state.typeRoom=action.payload
      },
      setPreviousRoom:(state,action: PayloadAction<string>)=>{
        state.previousRoom=action.payload
      },
      setNotifications:(state,action: PayloadAction<any>)=>{
        state.notifications=action.payload
      },
      setPrivateId:(state,action: PayloadAction<any>)=>{
        state.privateId=action.payload
      },
      setShowLeftTab:(state,action: PayloadAction<boolean>)=>{
        state.showLeftTab=action.payload
      }
    }
})

export const {setMessage, setContent,setMembers,setNewRoom,setNotifications,setPreviousRoom,setPrivateId,setTypeRoom,setShowLeftTab} = chatSlice.actions;

export default chatSlice.reducer