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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { Divider, Grid, Paper } from "@material-ui/core";
import Comment from "./Comment.js"; 
import CommentInput from "./CommentInput.js";
import {useLocation} from "react-router-dom";

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

export default function CommentSet(props) {
  const [comments, setComments] = React.useState(props.comments); 
  
  const handleEnteringComment = (comment_text) => {
	  
	  let new_comment = {text: comment_text, commenter_username: props.viewer.username, 
		  	     date: Date.now(), commenter_avatar_url: props.viewer.avatar_url};
	  let new_comments = [...comments].concat(new_comment);
	  setComments(new_comments);
  
    	  // Write comments to the db
	  props.add_comment_to_database(comment_text);
  };

  return (
        <CardContent sx={{width: "100%", padding: "0 0"}}>  
	  <Paper style={{ padding: "0% 0%", width: "100%" }}>
        
	  {comments.map((comment, index) => (
                <Comment 
		     text={comment.text}
		     commenter_username={comment.commenter_username}
		     commenter_avatar_url={comment.commenter_avatar_url}
		     date_in_unix={comment.date}
		     key={index}
		/>
              ))
       	     }
	   
           <CommentInput 
	  	add_comment={handleEnteringComment} 
	  	commenter_username={props.viewer.username} 
	   />

	  </Paper>
      </CardContent>
    )
}
