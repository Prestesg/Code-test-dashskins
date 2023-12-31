import { createContext, useState, useEffect, useContext} from 'react'
import SnackbarContext from './SnackbarContext';

export const AuthContext = createContext({
    auth:false,
    login:(_loginForm:any,_first:boolean)=>true,
    singnup:(_loginForm:any)=> true
});

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
        ).then((res)=>{
            if(![200,201].includes(res.status)){
                throw new Error("Usuário já cadastrado");
            } else {
                setSnackbar({open:true,message:"Usuário cadastrado com sucesso",type:"success"});
                setAuth(true)
            }
        }).catch((err) => {
            setSnackbar({open:true,message:err.toString(),type:"error"}); 
        });
    }

    return (
        <AuthContext.Provider value={{ auth, login, singnup ,setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}; 

export default AuthContext;