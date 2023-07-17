import { useEffect, useContext } from 'react';
import '../App.css'
import UsersTable from '../components/UsersTable';
import EditionModal  from '../components/EditionModal';
import UserContext from '../contexts/UserContext';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

function UsersPage() {
  const { auth } = useContext(AuthContext);
  const { getUsers } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(auth){
      getUsers();
    } else{ 
      navigate("/");
    } 
  }, [])

  return (
    <>    
      <Button onClick={()=>true}>LOGOUT</Button>
      <EditionModal user={{name:"",email:"",age:0}} method={"insert"}/>
      <UsersTable />
    </>
  )
}

export default UsersPage
