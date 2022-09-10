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

export default function CreateNewUser(props) {

    const [username, setUsername] = React.useState('');
    const [isUsernameLegal, setIsUsernameLegal] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [isPasswordLegal, setIsPasswordLegal] = React.useState(false);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        is_username_legal(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setPassword(event.target.value);
       is_password_legal(event.target.value);
    };

    React.useEffect(() => { 
	    document.title = `FInstagram`
    });

    async function is_username_legal(username) {
 
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
   
    async function write_new_user_to_db() {

	let avatar_url = "null";
	let user_params = {'username': username, 'password': password, 'avatar_url': avatar_url, "followers": [], "followees": []};
	let url = `http://${SERVER_IP}:${SERVER_PORT}/create_new_user`;
	
	fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(user_params)
                }).then(res => {
        });
    }

    
    function redirect_to_new_users_page() {
	window.location = `http://localhost:3000/profile_view?viewer_username=${username}&viewee_username=${username}`; 
    }

  	 
    function attempt_upload() {
	if (isUsernameLegal && isPasswordLegal) {
		write_new_user_to_db();
		setTimeout(redirect_to_new_users_page, 2000);
	}
    }
   
	return <div style = {{ display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
               }}>

		<Card sx={{ maxWidth: 445 }} style={{paddingTop: "0%"}}>

        <CardHeader
          titleTypographyProps={{fontWeight:'bold', fontSize: "2.45vh" }}
          title="Create Account"
          subheader=""
      />

      <CardContent>
        <Typography variant="caption" sx={{fontSize: '100%'}} color="black" align="left" >
        
	     <TextField
          	id="outlined-multiline-flexible"
          	label="username"
		error={!isUsernameLegal}
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
		error={!isPasswordLegal}
          	multiline
          	maxRows={4}
         	value={password}
          	onChange={handlePasswordChange}
          	sx={{width: "100%"}}
          />
	

          <Button onClick={attempt_upload}>
                <SendIcon sx={{color: "blue"}} />
          </Button>

		
		</Typography>
      </CardContent>
	</Card>
	</div>
}
