import * as React from 'react';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

export default function AddCaption(props) {
    const [caption, setCaption] = React.useState('');
     
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    	setCaption(event.target.value);
    };
	
  
   return (
	  <div style={{width: "100%"}}>
	<TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={4}
          value={caption}
          onChange={handleChange}
	  sx={{width: "100%"}}
          />
	
	  <Button onClick={() => {props.submit_caption(caption)}}>
	  	<SendIcon sx={{color: "blue"}} />
	  </Button>
  	</div>  
  )
}
