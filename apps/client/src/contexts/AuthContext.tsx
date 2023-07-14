import { createContext, useState } from 'react'

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    
    const login = (loginForm) => {
        fetch("/api/users/signin",{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginForm)}
        ).then((res)=>setAuth(true))
    }
 
    const singnup = (loginForm) => {
        fetch("/api/users/signup",{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginForm)}
        ).then((res)=>setAuth(true));
    }

    return (
        <AuthContext.Provider value={{ auth, login, singnup ,setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;