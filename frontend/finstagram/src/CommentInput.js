import * as React from "react";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";

export default function CommentInput(props) {
  const [value, setValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <TextField
        id="outlined-multiline-flexible"
        label=""
        multiline
        maxRows={4}
        value={value}
        onChange={handleChange}
        sx={{ width: "100%" }}
      />

      <Button
        onClick={() => {
          props.add_comment(value, props.commenter_username);
          setValue("");
        }}
      >
        <SendIcon sx={{ color: "blue" }} />
      </Button>
    </div>
  );
}
