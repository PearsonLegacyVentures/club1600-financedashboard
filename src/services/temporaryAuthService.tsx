/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";

const SESSION_KEY="club1600-demo-session";
type AuthContextValue={authenticated:boolean;login:(username:string,password:string)=>boolean;logout:()=>void};
const AuthContext=createContext<AuthContextValue|null>(null);
export const validateTemporaryCredentials=(username:string,password:string)=>username==="treasurer"&&password==="1600";

export function TemporaryAuthProvider({children}:{children:ReactNode}){
  const [authenticated,setAuthenticated]=useState(()=>typeof window!=="undefined"&&window.localStorage.getItem(SESSION_KEY)==="treasurer");
  const login=(username:string,password:string)=>{const valid=validateTemporaryCredentials(username,password);if(valid){window.localStorage.setItem(SESSION_KEY,"treasurer");setAuthenticated(true)}return valid};
  const logout=()=>{window.localStorage.removeItem(SESSION_KEY);setAuthenticated(false)};
  return <AuthContext.Provider value={{authenticated,login,logout}}>{children}</AuthContext.Provider>;
}
export function useTemporaryAuth(){const context=useContext(AuthContext);if(!context)throw new Error("useTemporaryAuth must be used within TemporaryAuthProvider");return context}
