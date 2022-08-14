import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { Divider, Grid, Paper } from "@material-ui/core";
import Button from '@mui/material/Button';
import {SERVER_IP, SERVER_PORT} from "./Config.js";

export default function ProfileHeader(props) {

  const handleSettingsClick = () => {
        console.log("the user clicked the user settings page");

  }
 

  return (
	  <Paper elevation={16} style={{padding: "0%", margin: "0%", display: "inline-flex",
			  		height: "15vh", width: "100vw",
	  			}} >
		
	  	<div style={{width: "33%", display: "inline-flex" }}>
	  		<div style={{display: "flex", margin: "auto auto"}}>
	  			<Avatar alt="username" src={props.user.avatar_url}  sx={{height: 100, width: 100}}/>
	  		</div>
	  	</div>	

	  	<div style={{width: "33.3%", display: "inline-flex" }}>
	  		<h1 style={{fontSize: "5vw", margin: "auto auto"}}> {props.user.username} </h1>
	  	</div>
	  	
	  	{props.can_post ?
			<div style={{width: "33.3%", display: "inline-flex"}} >
				
				<a href={`/create_new_post?username=${props.user.username}`} 
					style={{display: "inline-flex", width: "100%", height: "100%", margin: "auto auto", textDecoration: "none"}}>
		  		<Button variant="outlined" 
	  				style={{width: "30%", height: "35%", margin: "auto auto"}}
	 			>
	  				<h3> Post </h3>
	  			</Button>	
				</a>
			        <a href={`/edit_user_settings?username=${props.user.username}`}
                                        style={{display: "inline-flex", width: "100%", height: "100%", margin: "auto auto", textDecoration: "none"}}>
                                <Button variant="outlined"
                                        style={{width: "30%", height: "35%", margin: "auto auto"}}
                                >
                                        <h3> Settings </h3>
                                </Button>
                                </a>

			</div>
	  		:
			<div />
		}
		
	
	  </Paper>
  	 )
}
