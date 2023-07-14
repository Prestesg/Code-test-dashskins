import { useState,useEffect, useContext } from 'react';
import '../App.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AuthContext from '../contexts/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

function AuthPage() { 
  const { auth, login,singnup } = useContext(AuthContext);
  const [loginForm,setLoginForm] = useState({name:"",password:""});
  const navigate = useNavigate();

  useEffect(() => {
    if(auth){
      navigate("/users")
    }
  }, [auth])
  
  const changeLoginForm = (field,value) => {
    setLoginForm((state)=>{
      state[field] = value;
      return {...state}
    })
  }

  return (
    <>    
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      
        <TextField
          required
          id="outlined-required"
          label="Username"
          value={loginForm.username}
          onChange={(e)=>changeLoginForm('name',e.target.value)}
        />
        <TextField
          required
          id="outlined-disabled"
          label="Password"
          type="password"
          value={loginForm.password}
          onChange={(e)=>changeLoginForm('password',e.target.value)}
        />
        <Button onClick={()=>login(loginForm)}>LOGIN</Button>
        <Button onClick={()=>singnup(loginForm)}>CADASTRO</Button>
      </Box>

    </>
  )
}

export default AuthPage
