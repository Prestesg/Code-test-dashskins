import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState,useContext } from 'react';
import UserContext from '../contexts/UserContext';

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
  const [open, setOpen] = useState(false);
  const [userEdit, setUserEdit] = useState(user);
  const [formErrors, setFormErrors] = useState(user);
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
      <Button onClick={handleOpen}>{method === "insert"?"INSERIR":"EDIT"}</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}
        component="form"
        >
        <TextField
          required
          label="Nome"
          value={userEdit.name}
          onChange={(e)=>onUserChange('name',e.target.value)}
          error={!formErrors.name}
          helperText={!formErrors.name?"Você precisa inserir um nome":""}
          margin="normal"
        />
        <TextField
          required
          label="Idade"
          type="number"
          value={userEdit.age}
          onChange={(e)=>onUserChange('age',e.target.value)}
          error={!formErrors.age}
          helperText={!formErrors.age?"Você precisa inserir uma idade válida":""}
          margin="normal"
        />
        <TextField
          required
          label="Email"
          value={userEdit.email}
          onChange={(e)=>onUserChange('email',e.target.value)}
          error={!formErrors.email}
          helperText={!formErrors.email?"Você precisa inserir um email válido":""}
          margin="normal"
        />
        <Button onClick={method === "insert"?()=>insertUser(userEdit,setFormErrors):()=>saveChanges(userEdit,setFormErrors)}>{method === "insert"?"INSERIR":"SALVAR"}</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default EditionModal;