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


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Post(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [liked, setLiked] = React.useState(props.liked);
  const [follow, setFollow] = React.useState(props.viewer.followees.includes(props.username) || props.viewer.username == props.username)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const handleLikeClick = () => {
    
     setLiked(!liked); 
     let initial_liked = liked;
     if (initial_liked) {
    	remove_like_from_database();
     }
     else {
	add_like_to_database();
     }
   };
 
  const handleFollowClick = () => {
    setFollow(true);
    add_follower(); 
  };

  const add_comment_to_database = (text) => {
	let url = `http://${SERVER_IP}:${SERVER_PORT}/comment?post_id=${props.post_id}&commenter_username=${props.viewer.username}&text=${text}`; 
  	fetch(url, {
  		method: "POST",
 	 	headers: {'Content-Type': 'application/json'}, 
		}).then(res => {
	  	console.log("Request to add comment to database completed!");
	});
  }
  

  const add_like_to_database = () => {
        let url = `http://${SERVER_IP}:${SERVER_PORT}/like?post_id=${props.post_id}&username=${props.viewer.username}`; 
        fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                }).then(res => {
                console.log("Request to add like to database completed!");
        });
  }
 
  const remove_like_from_database = () => {
        let url = `http://${SERVER_IP}:${SERVER_PORT}/unlike?post_id=${props.post_id}&username=${props.viewer.username}`; 
        fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                }).then(res => {
                console.log("Request to add like to database completed!");
        });
  }

 
  const add_follower = () => {
        let url = `http://${SERVER_IP}:${SERVER_PORT}/follow?follower_username=${props.viewer.username}&followee_username=${props.username}`; 
        fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                }).then(res => {
                console.log("Request to add follower to database completed!");
        });
  }


  return (
    <Card sx={{ maxWidth: 445 }} style={{paddingTop: "0%"}}>
       
	<CardHeader 
	  titleTypographyProps={{fontWeight:'bold', fontSize: "2.45vh" }}
	  avatar={
          	<a href={`/profile_view?viewer_username=${props.viewer.username}&viewee_username=${props.username}`}> <Avatar alt="username" src={props.avatar_url} /> </a>
          }
	title={<div sx={{height: "20%"}}> {props.username}
		{ !follow  ? <Button variant="outlined" sx={{height: "20px"}} style={{fontSize: "2.0vh", marginLeft: "2%"}} onClick={handleFollowClick}> <h3> Follow </h3> </Button> : <div />} </div>}
	
        subheader={(new Date(props.date * 1000)).toDateString()}
      />
       
     <CardMedia
        component="img"
	height="400 %"
	width="auto"
        image={props.image_url}
	alt="Post Unavailable"
      />
      <CardContent>
        <Typography variant="caption" sx={{fontSize: '100%'}} color="black" align="left" >
        	{props.caption}
	</Typography>
      </CardContent>
      <CardActions disableSpacing>
        
	<IconButton aria-label="add to favorites" onClick={handleLikeClick}>
	 	{liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon /> }
	</IconButton>
        
	<IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

	<ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
 	
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{width: "100%", padding: "0 0"}}>
	  <CommentSet viewer={props.viewer} comments={props.comments} add_comment_to_database={add_comment_to_database}/>
        </CardContent>
      </Collapse>
    </Card>
  );
}
