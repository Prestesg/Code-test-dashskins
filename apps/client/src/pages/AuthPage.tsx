import * as React from 'react';
import { useState,useEffect, useContext } from 'react';
import '../App.css'
import TextField from '@mui/material/TextField';
import AuthContext from '../contexts/AuthContext';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

function AuthPage() { 
  const { auth, login,singnup } = useContext(AuthContext);
  const [loginForm,setLoginForm] = useState({name:"",password:""});
  const navigate = useNavigate();

  useEffect(() => {
    if(auth){
      navigate("/users")
    }
  }, [auth])
  
  const changeLoginForm = (field :string,value :string) => {
    setLoginForm((state:any)=>{
      state[field] = value;
      return {...state}
    })
  }

  return (
    <>    

      <Card sx={{ minWidth: 275,width:"25%",margin:"auto" }} >
      <div style={{background:"black"}}>
        <img id={"mainLogo"} src={"/logo.webp"}/>
      </div>
      <CardContent>
        <TextField
          required
          id="outlined-required"
          label="Username"
          value={loginForm.name}
          onChange={(e: { target: { value: any; }; })=>changeLoginForm('name',e.target.value)}
          margin={"normal"}
        />
        <TextField
          required
          id="outlined-disabled"
          label="Password"
          type="password"
          value={loginForm.password}
          onChange={(e: { target: { value: any; }; })=>changeLoginForm('password',e.target.value)}
          margin={"normal"}
        />
        <Box sx={{ '& button': { m: 1 } }}>
          <Button variant="contained" size={"medium"} color="secondary" onClick={()=>login(loginForm,false)}>LOGIN</Button>
          <Button variant="contained" size={"medium"} color="primary" onClick={()=>singnup(loginForm)}>CADASTRO</Button>
        </Box>
      </CardContent>
      </Card>

    </>
  )
}

export default AuthPage
