import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UsersTable from './components/UsersTable';
import EditionModal  from './components/EditionModal';

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("/api/users")
    .then((res)=> res.json())
    .then((body)=> {
      setUsers(body.users)
    })
  }, [])

  const insertUser = (user) => {
    fetch("/api/users",{
      method:"POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)}
    ).then((res)=>{console.log({res})})
  }

  return (
    <>
      <EditionModal user={{}} method={"insert"}/>
      <UsersTable users={users}/>
    </>
  )
}

export default App
