import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState,useContext } from 'react';
import UserContext from '../contexts/UserContext';
import Avatar from '@mui/material/Avatar';

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

const EditionModal = ({user,method}:any) => {
  const [open, setOpen] = useState(false);
  const [userEdit, setUserEdit] = useState(user);
  const [formErrors, setFormErrors] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { saveChanges, insertUser } = useContext(UserContext);
  
  const onUserChange = (field:string,value:string|number) => {
    setUserEdit((state:any)=>{
        state[field] = value;
        return {...state};
    });
  }
  
  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>{method === "insert"?"INSERIR":"EDIT"}</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}
        component="form"
        >
          <div style={{textAlign:"center"}}>
          <Avatar 
            sx={{ width: 100, height: 100 ,margin:"auto",marginBottom:"15px"}}
            alt={userEdit.avatar} 
            src={userEdit?.avatar?.url?`${userEdit?.avatar?.url}`:userEdit?.avatar?`http://localhost:3000/${userEdit?.avatar}`:""} 
          />
          <Button
            variant="contained"
            component="label"
            color="secondary"
          >
            Carregar Imagem
            <input
              type="file"
              accept="image/png, image/jpeg" 
              hidden
              onChange={(e)=>{
                const { files }:any = e.target as HTMLInputElement;
                files[0]["url"] = URL.createObjectURL(files[0]);
                onUserChange('avatar',files[0])
              }}
            />
          </Button>
          </div>
        <TextField
          required
          label="Nome"
          value={userEdit.name}
          onChange={(e)=>onUserChange('name',e.target.value)}
          error={formErrors.name}
          helperText={formErrors.name?"Você precisa inserir um nome":""}
          margin="normal"
        />
        <TextField
          required
          label="Idade"
          type="number"
          value={userEdit.age}
          onChange={(e)=>onUserChange('age',e.target.value)}
          error={formErrors.age}
          helperText={formErrors.age?"Você precisa inserir uma idade válida":""}
          margin="normal"
        />
        <TextField
          required
          label="Email"
          value={userEdit.email}
          onChange={(e)=>onUserChange('email',e.target.value)}
          error={formErrors.email}
          helperText={formErrors.email?"Você precisa inserir um email válido":""}
          margin="normal"
        />
        <div>
          <Button 
          variant="contained"
            onClick={method === "insert"?()=>insertUser(userEdit,setFormErrors):()=>saveChanges(userEdit,setFormErrors)}>
              {method === "insert"?"INSERIR":"SALVAR"}
          </Button>
        </div>
        </Box>
      </Modal>
    </div>
  );
}

export default EditionModal;