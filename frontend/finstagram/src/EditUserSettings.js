import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {SERVER_IP, SERVER_PORT} from "./Config.js";
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { useNavigate } from "react-router-dom"
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

let snackBarMessage = "";
let snackBarSeverity = "success";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function EditUserSettings(props) {
   const [avatarImagefile, setAvatarImageFile] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [isPasswordLegal, setIsPasswordLegal] = React.useState(false);
   const [snackOpen, setSnackOpen] = React.useState(false);	
   const uploadInputRef = React.useRef(null);

   const handleSnackClick = () => {
        setSnackOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };


   const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    setAvatarImageFile(fileObj);
    event.target.value = null;
    write_image_to_server();
  }


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setPassword(event.target.value);
       is_password_legal(event.target.value);
    };

    React.useEffect(() => { 
	    document.title = `FInstagram`
    });

    async function is_password_legal(password) {

        let url = `http://${SERVER_IP}:${SERVER_PORT}/is_password_legal?password=${password}`; 
        await fetch(url).then(response => response.json()).then((json) => {
        		setIsPasswordLegal(json);   			
		}
        );
    }
    
   function attempt_change_password() {
   	console.log("User is trying to change his/her password.");	
   	if (isPasswordLegal) {
		snackBarMessage = "Successfully changed password";
		snackBarSeverity = "success";
	}
	else {
		snackBarMessage = "Failed to change password";
		snackBarSeverity = "error";
	}
	setSnackOpen(true);
   }
  
   async function write_image_to_server() {
   	let username = new URLSearchParams(window.location.search).get('username');
	let url = `http://${SERVER_IP}:${SERVER_PORT}/set_avatar?username=${username}`;
        const formData = new FormData();
              formData.append(
                "image_file",
                avatarImagefile
        );

        await fetch(url,
                {method: "POST", body: formData,
                }).then(response => response.json())
        	.then(function (response) {
          	if (!response) {
			snackBarMessage="Succesfully Updated Avatar";
			snackBarSeverity="success";
		}
		else {
			snackBarMessage="Failed to Update Avatar";
                        snackBarSeverity="error";
		}	
		setSnackOpen(true);
         });
   }

	return <div style = {{ display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
               }}>

		<Card sx={{ maxWidth: 445 }} style={{paddingTop: "0%"}}>

        <CardHeader
          titleTypographyProps={{fontWeight:'bold', fontSize: "2.45vh" }}
          title="Edit Acount Settings"
          subheader=""
      />

      <CardContent>
        <Typography variant="caption" sx={{fontSize: '100%'}} color="black" align="left" >
        
	  <div style={{paddingTop: "5%"}}/> 
	  <TextField
          	id="outlined-multiline-flexible"
         	label="password"
		error={!isPasswordLegal}
          	multiline
          	maxRows={4}
         	value={password}
          	onChange={handlePasswordChange}
          	sx={{width: "100%"}}
		InputProps={{endAdornment: <Button onClick={attempt_change_password}>
                				<SendIcon sx={{color: "blue"}} />
        	  	</Button>
		}}
          >
	  </TextField>
	
	  <div style={{paddingTop: "8%"}}/>
	  
	  <input
      ref={uploadInputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
    <Button
      onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
      variant="contained"
    >
      Change Avatar Image
    </Button>	
		</Typography>
      </CardContent>
	</Card>

	<div >
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={snackOpen} autoHideDuration={1000} onClose={handleSnackClose}>

        <Alert onClose={handleSnackClose} severity={snackBarSeverity} sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Stack>
		

	</div>	
	</div>
}
