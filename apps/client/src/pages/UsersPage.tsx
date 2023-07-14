import { useState,useEffect, useContext } from 'react';
import '../App.css'
import UsersTable from '../components/UsersTable';
import EditionModal  from '../components/EditionModal';
import UserContext from '../contexts/UserContext';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

function UsersPage() {
  const { auth } = useContext(AuthContext);
  const { getUsers } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log({auth});
    if(auth){
      getUsers();
    } else{ 
      navigate("/");
    } 
  }, [])

  return (
    <>    
      <EditionModal user={{name:"",email:"",age:0}} method={"insert"}/>
      <UsersTable />
    </>
  )
}

export default UsersPage
