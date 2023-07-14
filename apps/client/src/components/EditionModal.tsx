import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditionModal = ({user,method}) => {
  const [open, setOpen] = React.useState(false);
  const [userEdit, setUserEdit] = React.useState(user);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const onUserChange = (field:string,value:string|number) => {
    setUserEdit((state:any)=>{
        state[field] = value;
        return {...state};
    });
  }

  const saveChanges = () => {
    fetch("/api/users",{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userEdit)}
).then((res)=>{console.log({res})})
  }

  const insertUser = () => {
    fetch("/api/users",{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userEdit)}
    ).then((res)=>{console.log({res})})
  }
  
  return (
    <div>
      <Button onClick={handleOpen}>{method === "insert"?"INSERIR":"EDIT"}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}
        component="form"
        >
        <TextField
          required
          id="outlined-required"
          label="Nome"
          value={userEdit.name}
          onChange={(e)=>onUserChange('name',e.target.value)}
        />
        <TextField
          required
          id="outlined-required"
          label="Idade"
          type="number"
          value={userEdit.age}
          onChange={(e)=>onUserChange('age',e.target.value)}
        />
        <TextField
          required
          id="outlined-required"
          label="Email"
          value={userEdit.email}
          onChange={(e)=>onUserChange('email',e.target.value)}
        />
        <Button onClick={method === "insert"?insertUser:saveChanges}>{method === "insert"?"INSERIR":"SALVAR"}</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default EditionModal;