import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CameraIcon from "@mui/icons-material/Camera";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import SearchResults from "./UserSearch.js";
import { styled, alpha } from "@mui/material/styles";

import { SERVER_IP, SERVER_PORT } from "./Config.js";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

async function getUsers() {
  let url = `http://${SERVER_IP}:${SERVER_PORT}/get_all_users`;
  let response = await fetch(url);
  let users = await response.json();
  localStorage.setItem("users", JSON.stringify(users));
}

getUsers();

const ResponsiveAppBar = (props) => {
  const [headerAnchorElNav, setHeaderAnchorElNav] = React.useState(null);
  const [headerAnchorElUser, setHeaderAnchorElUser] = React.useState(null);
  const [searchText, setSearchText] = React.useState(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setHeaderAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setHeaderAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setHeaderAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setHeaderAnchorElUser(null);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const getUserSettings = (user) => {
    let settings = [];

    let profile_url = `http://localhost:3000/profile_view?viewer_username=${props.user.username}&viewee_username=${props.user.username}`;
    let settings_url = `http://localhost:3000/edit_user_settings?username=${props.user.username}`;
    let login_url = `http://localhost:3000/login`;
    let feed_url = `http://localhost:3000/feed?username=${props.user.username}`;
    let create_post_url = `http://localhost:3000/create_new_post?username=${props.user.username}`;

    settings.push(["Feed", feed_url]);
    settings.push(["Create Post", create_post_url]);
    settings.push(["Profile", profile_url]);
    settings.push(["Settings", settings_url]);
    settings.push(["Logout", login_url]);

    return settings;
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <CameraIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={`http://localhost:3000/feed?username=${props.user.username}`}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              FInstagram
            </Typography>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>

              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearchChange}
              ></StyledInputBase>
            </Search>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={headerAnchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(headerAnchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              ></Menu>
            </Box>
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            ></Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={props.user.username}
                    src={props.user.avatar_url}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={headerAnchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(headerAnchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {getUserSettings(props.user).map((setting, index) => (
                  <a
                    href={setting[1]}
                    key={index}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting[0]}</Typography>
                    </MenuItem>
                  </a>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <SearchResults
        searchQuery={searchText}
        users={JSON.parse(localStorage.getItem("users"))}
        viewer={props.user.username}
      />
    </React.Fragment>
  );
};
export default ResponsiveAppBar;
