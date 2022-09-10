import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommentSet from "./CommentSet.js";
import {SERVER_IP, SERVER_PORT} from "./Config.js";
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import AddCaption from "./AddCaption.js";
import { useNavigate } from "react-router-dom"
import axios from 'axios';

export default function CreatePost(props) {
  let default_img = "/white.jpg";
  const [image, setImage] = React.useState(default_img);
  const [image_file, setImageFile] = React.useState(default_img);
  const [caption, setCaption] = React.useState("");

  const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
   
    setImage(URL.createObjectURL(fileObj));
    setImageFile(fileObj);
    event.target.value = null;
  };

  function redirect_to_view_of_users_page() {
	 window.location = `http://${SERVER_IP}:${SERVER_PORT}/profile_view?viewer_username=${props.user.username}&viewee_username=${props.user.username}`;
  }
 
  async function addNewPost() {
	let url = `http://${SERVER_IP}:${SERVER_PORT}/create_post?username=${props.user.username}&caption=${caption}`;
	const formData = new FormData();
	      formData.append(
        	"image_file",
        	image_file
        );
     	
        await fetch(url, 
	     	{method: "POST", body: formData,
		}).then(response => response.json())
        .then(function (response) {
          console.log('response')
          console.log(response)
            });
  
  	redirect_to_view_of_users_page()
  }
 

  return ( 

	<div style = {{ display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
               }}>

    <Card sx={{ maxWidth: 445 }} style={{paddingTop: "0%"}}>
	  <CardHeader titleTypographyProps={{fontWeight:'bold', fontSize: "2.45vh" }}
		      avatar={<a href={`/profile_view?viewer_username=${props.user.username}&viewee_username=${props.user.username}`}> <Avatar alt="username" src={props.user.avatar_url} /> </a>
          }          

	  title={<div sx={{height: "20%"}}> {props.user.username}  </div>}	  
	/>

      <CardMedia
        component="img"
        height="400 %"
        width="auto"
        image={image}
        alt="Post Unavailable"
      />

      <CardContent >
	<Typography variant="caption" sx={{fontSize: '100%'}} color="black" align="left" >
                {caption}
        </Typography>
      </CardContent>
      
      <CardActions disableSpacing>
      {image == default_img ?
      		<Button variant="contained" component="label" >
  			Upload
  		<input hidden accept="image/*" multiple type="file" onChange={handleFileChange} />
		</Button>
        :
	     <div>
	      {caption == "" ?
        	<AddCaption submit_caption={setCaption} />
		:
		<Button variant="contained" component="label" onClick={addNewPost} >
		      Upload
		</Button>
	      }
	     </div>
      }

      </CardActions>
   </Card>
   </div>   
  );
}
