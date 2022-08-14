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

export default function EditUserSettings(props) {

    const [password, setPassword] = React.useState('');
    const [isPasswordLegal, setIsPasswordLegal] = React.useState(false);

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
   
    
   function attempt_upload() {
   	
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
          />
	
          <Button onClick={attempt_upload}>
                <SendIcon sx={{color: "blue"}} />
          </Button>

		
		</Typography>
      </CardContent>
	</Card>
	</div>
}
