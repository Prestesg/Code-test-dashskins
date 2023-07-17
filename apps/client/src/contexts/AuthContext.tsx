import { createContext, useState, useEffect, useContext} from 'react'
import SnackbarContext from './SnackbarContext';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const { setSnackbar } = useContext(SnackbarContext);

    useEffect(() => {
        login({},true);
    }, []);
    
    const login = (loginForm,first) => {
        fetch("/api/users/signin",{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginForm)}
        )
        .then((res) =>{
            if(res.status !== 200){
                throw new Error("Usuário ou senha inválidos");
            } else {
                setSnackbar({open:true,message:"Usuário logado com sucesso",type:"success"});
                setAuth(true);
            }
        }).catch((err) => {
            if(!first){
                setSnackbar({open:true,message:err.toString(),type:"error"});
            }
        });
    }
 
    const singnup = (loginForm) => {
        fetch("/api/users/signup",{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginForm)}
        ).then(()=>setAuth(true));
    }

    return (
        <AuthContext.Provider value={{ auth, login, singnup ,setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}; 

export default AuthContext;