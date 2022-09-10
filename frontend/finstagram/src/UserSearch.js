import * as React from 'react';
import { useState } from "react";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import {SERVER_IP, SERVER_PORT} from "./Config.js";


const filterUsers = (query, users) => {
  
  if (!query) {
    return users;
  } else {
    return users.filter((user) => user.username.toLowerCase().includes(query));
  }
};

function getProfileViewUrl(viewer_username, viewee_user) {
	
	return `http://localhost:3000/profile_view?viewer_username=${viewer_username}&viewee_username=${viewee_user.username}`; 

}

export default function Search(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState();
  const filteredUsers = filterUsers(props.searchQuery, users);
	
  async function getUsers() {

        let url = `http://${SERVER_IP}:${SERVER_PORT}/get_all_users`; 
        let response = await fetch(url);
        let users = await response.json();
        setUsers(users);
};

  getUsers();

  return (<React.Fragment > { (props.searchQuery != null && props.searchQuery != "") ? <React.Fragment>
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 20
      }}
    >
      <AvatarGroup max={3} total={filteredUsers.length} style={{
                      justifyContent: 'right',
                      alignItems: 'right',
	}} >
        {filteredUsers.map((user, index) => (
		<a href={getProfileViewUrl(props.viewer, user)}>
			<Avatar alt={user.username} src={user.avatar_url} />
		</a>
	))}
      </AvatarGroup>
    </div>
  
    </React.Fragment> :
	
    <div />
    }
    </React.Fragment>

  );
}
