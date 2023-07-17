import { createContext, useState, forwardRef} from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackbarContext = createContext({});

export const SnackbarContextProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({open:false,message:"",type:"success"});
    
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar({open:false,message:"",type:"success"});
    };


    return (
        <SnackbarContext.Provider value={{ snackbar, handleClose, setSnackbar }}>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={snackbar.type} sx={{ width: '100%' }}>
                    {snackbar.message}
            </Alert>
            </Snackbar>
            {children}
        </SnackbarContext.Provider>
    );
}; 

export default SnackbarContext;