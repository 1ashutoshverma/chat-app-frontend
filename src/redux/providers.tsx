"use client";
import React, { ReactNode } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "./store";

interface ProvidersProps {
  children: ReactNode;
}

//provider
const ProvidersRedux: React.FC<ProvidersProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

//custom useSelector and useReducer
export const useAppSelector = useSelector<RootState>;
export const useAppDispatcher = useDispatch<AppDispatch>;

export default ProvidersRedux;
