import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import { Paper } from "@material-ui/core";
import Comment from "./Comment.js"; 
import CommentInput from "./CommentInput.js";

export default function CommentSet(props) {
  const [comments, setComments] = React.useState(props.comments); 
  
  const handleEnteringComment = (comment_text) => {
	  
	  let new_comment = {text: comment_text, commenter_username: props.viewer.username, 
		  	     date: Date.now() / 1000, commenter_avatar_url: props.viewer.avatar_url};
	  let new_comments = [...comments].concat(new_comment);
	  setComments(new_comments);
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
		     viewer={props.viewer}
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
