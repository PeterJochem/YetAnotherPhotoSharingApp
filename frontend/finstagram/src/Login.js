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

export default function Login(props) {

    const [username, setUsername] = React.useState('');
    const [isUsernameLegal, setIsUsernameLegal] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [isPasswordLegal, setIsPasswordLegal] = React.useState(false);
    
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setPassword(event.target.value);
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

    
    async function attempt_login() {
	
    	let url = `http://${SERVER_IP}:${SERVER_PORT}/login?username=${username}&password=${password}`;
	await fetch(url).then(response => response.json()).then((json) => {
                        if (json) {
				redirect_to_users_feed(username);
			}
                }
        );
    }
   
	return <div style = {{ display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
               }}>

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
	
	  <div style={{paddingTop: "5%"}}/> 
	  <TextField
          	id="outlined-multiline-flexible"
         	label="password"
          	multiline
          	maxRows={4}
         	value={password}
          	onChange={handlePasswordChange}
          	sx={{width: "100%"}}
          />
	

          <Button onClick={attempt_login}>
                <SendIcon sx={{color: "blue"}} />
          </Button>

		</Typography>
      </CardContent>
	</Card>
	</div>
}
