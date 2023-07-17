import { createContext, useState, useContext,forwardRef } from 'react'
import AuthContext from './AuthContext';
import userFormValidation from '../utils/userFormValidation';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({open:false,message:"",type:"success"});
    const [users, setUsers] = useState([]);
    const { auth } = useContext(AuthContext);
    
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar({open:false,message:"",type:"success"});
    };
    
    const getUsers = () => {
        fetch("/api/users",{
            headers: { 'authorization': `Bearer ${auth}` },
        })
        .then((res)=> res.json())
        .then((body)=> {
          setUsers(body.users)
        })
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
        if(!userFormValidation(userForm,errorHandler)){
            fetch("/api/users",{
                method:"POST",
                headers: { 'Content-Type': 'application/json',
                'authorization': `Bearer ${auth}`  },
                body: JSON.stringify(userForm)}
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
        if(!userFormValidation(userForm,errorHandler)){
            fetch("/api/users",{
                method:"PUT",
                headers: { 'Content-Type': 'application/json',
                'authorization': `Bearer ${auth}`  },
                body: JSON.stringify(userForm)
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
        <UserContext.Provider value={{ users,setUsers,getUsers,deleteUser,insertUser,saveChanges }}>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={snackbar.type} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;