import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import EditionModal  from './EditionModal';

const UsersTable = ({users}) => {
    const deleteUser = (user) => {
        fetch("/api/users",{
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)}
    ).then((res)=>{console.log({res})})
    }


    return (
      <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell >Idade</TableCell>
              <TableCell >Email</TableCell>
              <TableCell >Avatar</TableCell>
              <TableCell >Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user,index) => (
              <TableRow key={user.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{user.name}</TableCell>
                <TableCell >{user.age}</TableCell>
                <TableCell >{user.email}</TableCell>
                <TableCell >{user.avatar}</TableCell>
                <TableCell >
                    <EditionModal user={user} key={index} method={"update"}/>
                    <IconButton aria-label="delete" onClick={()=> deleteUser(user)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </>
    )
}

export default UsersTable
