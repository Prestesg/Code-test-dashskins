import { createContext, useState, useContext } from 'react'
import AuthContext from './AuthContext';
import userFormValidation from '../utils/userFormValidation';
import SnackbarContext from './SnackbarContext';

export const UserContext = createContext({
    saveChanges:(_user:any,_errorHandler:Function)=>true,
    insertUser :(_user:any,_errorHandler:Function)=>true
});

export const UserContextProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const { auth } = useContext(AuthContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const getUsers = () => {
        fetch("/api/users")
        .then((res)=> res.json())
        .then((body)=> {
          setUsers(body.users)
        })
    }

    const logout = () => {
        return fetch("/api/users/logout")
    }
 
    const deleteUser = (user:any) => {
        fetch("/api/users",{
            method:"DELETE",
            headers: { 'Content-Type': 'application/json','authorization': `Bearer ${auth}`  },
            body: JSON.stringify(user)}
        ).then(()=>{
            setSnackbar({open:true,message:"Usuário deletado com sucesso",type:"success"});
            getUsers()
        }).catch(() => {
            setSnackbar({open:true,message:"Houve um erro no processamento da solicitação",type:"error"});
        });
    }

    const insertUser = (userForm,errorHandler) => {
        const formData = new FormData();
        Object.keys(userForm).forEach((key)=>{
            formData.append(key,userForm[key])
        })
        if(!userFormValidation(userForm,errorHandler)){
            fetch("/api/users",{
                method:"POST",
                body: formData
            }
            ).then(()=>{
                setSnackbar({open:true,message:"Usuário registrado com sucesso",type:"success"});
                getUsers()
            }).catch(() => {
                setSnackbar({open:true,message:"Houve um erro no processamento da solicitação",type:"error"});
            });
        } else {
            setSnackbar({open:true,message:"Erro no preenchimento do formulário",type:"error"});
        }
    }

    const saveChanges = (userForm,errorHandler) => {
        const formData = new FormData();
        Object.keys(userForm).forEach((key)=>{
            formData.append(key,userForm[key])
        })
        if(!userFormValidation(userForm,errorHandler)){
            fetch("/api/users",{
                method:"PUT",
                body: formData
            }
            ).then(()=>{
                setSnackbar({open:true,message:"Usuário atualizado com sucesso",type:"success"});
                getUsers()
            }).catch(() => {
                setSnackbar({open:true,message:"Houve um erro no processamento da solicitação",type:"error"});
            });
        } else {
            setSnackbar({open:true,message:"Erro no preenchimento do formulário",type:"error"});
        }
    }

    return (
        <UserContext.Provider value={{ users,setUsers,getUsers,deleteUser,insertUser,saveChanges,logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;