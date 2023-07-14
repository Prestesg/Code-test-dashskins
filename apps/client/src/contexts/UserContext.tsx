import { createContext, useState, useContext } from 'react'
import AuthContext from './AuthContext';

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const { auth } = useContext(AuthContext);
    
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
    ).then((res)=>getUsers())
    }

    return (
        <UserContext.Provider value={{ users,setUsers,getUsers,deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;