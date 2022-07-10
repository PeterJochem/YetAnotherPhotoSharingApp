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

export default function ProfileHeader(props) {

  return (
	  <Paper elevation={16} style={{padding: "0%", margin: "0%", display: 'inline-flex', height: "15vh", width: "100%"}} >

	  	<div style={{
			display: "flex",
          		justifyContent: "center",
         		alignItems: "center",
			marginRight: "8%",
		}}>
	  		<Avatar alt="username" src={props.user.avatar_url} style={{marginLeft: "30%"}} sx={{height: 100, width: 100}}/>
	  	</div>
	  	
	  	<h1 style={{fontSize: "5vh"}}> {props.user.username} </h1>
	  	
	  	<div style={{width: "100%"
                		}}>  
		<Button variant="outlined" 
	  		style={{display: "flex", align-items: "right", fontSize: "2.0vh", marginRight: "0%", justifyContent: "center"}} 
	  		onClick={""}> 
	  
	  		<h3> Post </h3> 
	  	</Button>	
		</div>
	  </Paper>
  	 )
}
