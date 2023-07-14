import { createContext, useState } from 'react'

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    
    const getUsers = () => {
        fetch("/api/users")
        .then((res)=> res.json())
        .then((body)=> {
          setUsers(body.users)
        })
    }
 
    return (
        <UserContext.Provider value={{ users,setUsers,getUsers }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;