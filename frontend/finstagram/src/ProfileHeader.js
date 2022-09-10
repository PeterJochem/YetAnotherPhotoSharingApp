import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CameraIcon from '@mui/icons-material/Camera';
import {SERVER_IP, SERVER_PORT} from "./Config.js";

const ResponsiveAppBar = (props) => {
  const [headerAnchorElNav, setHeaderAnchorElNav] = React.useState(null);
  const [headerAnchorElUser, setHeaderAnchorElUser] = React.useState(null);
 
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

  const getUserSettings = (user) => {
	let settings = [];
        
	let profile_url = `http://localhost:3000/profile_view?viewer_username=${props.user.username}&viewee_username=${props.user.username}`;
        let settings_url = `http://localhost:3000/edit_user_settings?username=${props.user.username}`;
        let login_url = `http://localhost:3000/login`;
	let feed_url = `http://localhost:3000/feed?username=${props.user.username}`;

	settings.push(["Feed", feed_url]);
	settings.push(["Profile", profile_url]);
        settings.push(["Settings", settings_url]);
	settings.push(["Logout", login_url]);

	return settings;
  }

 
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CameraIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href={`http://localhost:3000/feed?username=${props.user.username}`}
	    sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FInstagram
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(headerAnchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={props.user.username} src={props.user.avatar_url} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={headerAnchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(headerAnchorElUser)}
              onClose={handleCloseUserMenu}
            >
             
	  {getUserSettings(props.user).map((setting, index) => (
		<a href={setting[1]} style={{textDecoration: 'none', color: "inherit"}}> 
                	<MenuItem key={index} onClick={handleCloseUserMenu}>
                  	  <Typography textAlign="center">{setting[0]}</Typography>
                	</MenuItem>
		</a>
              ))}
	   
	  
	  
	  </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
