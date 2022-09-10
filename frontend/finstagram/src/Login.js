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
import $ from 'jquery';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let snackBarMessage = "";
let snackBarSeverity = "success";

export default function Login(props) {

    const [username, setUsername] = React.useState('');
    const [isUsernameLegal, setIsUsernameLegal] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [displayPassword, setDisplayPassword] = React.useState(false);
    const [isPasswordLegal, setIsPasswordLegal] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);

    const handleSnackClick = () => {
        setSnackOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };


    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let displayString = "*".repeat(event.target.value.length);
	setDisplayPassword(displayString);
	setPassword(password + event.target.value[event.target.value.length - 1]);
	console.log(password);
    };

    React.useEffect(() => { 
	    document.title = `FInstagram`
    });

    async function is_username_legal(username) {
 
	console.log(username);
        let url = `http://${SERVER_IP}:${SERVER_PORT}/is_username_taken?username=${username}`; 
        await fetch(url).then(response => response.json()).then((json) => {
                       	setIsUsernameLegal(!json);
                }
        );
    }
	
    
    async function is_password_legal(password) {

        let url = `http://${SERVER_IP}:${SERVER_PORT}/is_password_legal?password=${password}`; 
        await fetch(url).then(response => response.json()).then((json) => {
        		setIsPasswordLegal(json);        
		}
        );
    }
   
    function redirect_to_users_feed(username) {
	window.location = `http://localhost:3000/feed?username=${username}`; 
    }
    
    
    function display_failed_login_message() {
	snackBarMessage = "Failed to Login";
        snackBarSeverity = "error";
	setSnackOpen(true);
    }
     
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      setPassword(event.target.value);
    };

    async function attempt_login() {
	
    	let url = `http://${SERVER_IP}:${SERVER_PORT}/login?username=${username}&password=${password}`;
	await fetch(url).then(response => response.json()).then((json) => {
                        if (json) {
				redirect_to_users_feed(username);
			}
			else {
				display_failed_login_message();
			}
                }
        );
    }
   
	return <div style = {{ display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
		}}>
		
		<div>

		<Card sx={{ maxWidth: 445 }} style={{paddingTop: "0%"}}>

        <CardHeader
          titleTypographyProps={{fontWeight:'bold', fontSize: "2.45vh" }}
          title="Login"
          subheader={<a href="./create_new_user"> Create Account </a>}
      />

      <CardContent>
        <Typography variant="caption" sx={{fontSize: '100%'}} color="black" align="left" >
        
	     <TextField
          	id="outlined-multiline-flexible"
          	label="username"
          	multiline
          	maxRows={4}
          	value={username}
          	onChange={handleUsernameChange}
          	sx={{width: "100%"}}
	/>
	
		
	<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={displayPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {setDisplayPassword(!displayPassword)} }
                  edge="end"
                >
                  { displayPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />

	  <div style={{paddingTop: "5%"}}/> 
          <Button onClick={attempt_login}>
                <SendIcon sx={{color: "blue"}} />
          </Button>

		</Typography>
      </CardContent>
	</Card>
 
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
