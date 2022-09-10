import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import { Divider, Grid, Paper } from "@material-ui/core";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Comment(props) {
  return (
    <Grid container wrap="nowrap" spacing={5} sx={{ padding: "10% 15%" }}>
      <Grid item>
        <a
          href={`/profile_view?viewer_username=${props.viewer.username}&viewee_username=${props.commenter_username}`}
        >
          <Avatar
            alt={props.commenter_username}
            src={props.commenter_avatar_url}
          />
        </a>
      </Grid>
      <Grid item xs zeroMinWidth>
        <h4 style={{ margin: 0, textAlign: "left" }}>
          {props.commenter_username}
        </h4>
        <p style={{ textAlign: "left" }}>{props.text}</p>
        <p style={{ textAlign: "left", color: "gray" }}>
          {new Date(props.date_in_unix * 1000).toLocaleString("en-US")}
        </p>
      </Grid>
    </Grid>
  );
}
