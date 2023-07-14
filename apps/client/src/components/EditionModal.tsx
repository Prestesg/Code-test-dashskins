import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useContext } from 'react';
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
  const [open, setOpen] = React.useState(false);
  const [userEdit, setUserEdit] = React.useState(user);
  const [formErrors, setFormErrors] = React.useState(user);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { getUsers } = useContext(UserContext);
  
  const onUserChange = (field:string,value:string|number) => {
    setUserEdit((state:any)=>{
        state[field] = value;
        return {...state};
    });
  }

  const valideForm = () => {
    const errors:any = {};
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    Object.keys(userEdit).forEach(key => {
        switch (key) {
            case "name":
                errors[key] = userEdit[key].length > 0?true:false;
                break;
            case "email":
                errors[key] = userEdit[key].match(mailformat)?true:false;
                break;
            case "age":
                errors[key] = userEdit[key] <= 120 && userEdit[key] >= 18 ?true:false;
                break;
            default:
                break;
        }
    });
    setFormErrors(errors);
    console.log({teste:Object.values(errors).includes(false)},errors)
    return Object.values(errors).includes(false)
  }

  const saveChanges = () => {
    if(!valideForm()){
    fetch("/api/users",{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userEdit)}
    ).then((res)=>getUsers())
    }
  }

  const insertUser = () => {
    if(!valideForm()){
        fetch("/api/users",{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userEdit)}
        ).then((res)=>getUsers())

    }
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
        <Button onClick={method === "insert"?insertUser:saveChanges}>{method === "insert"?"INSERIR":"SALVAR"}</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default EditionModal;