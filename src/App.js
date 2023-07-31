import './App.css';
import React from 'react';
import Container from '@mui/material/Container';
import NewTaskFormular from './comps/task/NewTaskFormular';
import Database from './comps/database/Database';
import Overview from './comps/database/Overview';
import Logout from './comps/Logout';
import QRCodeScanner from './comps/QRCodeScanner';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import Grid from '@mui/material/Grid';
import './custom.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import QRCodeController from './comps/QRCodeController';
import TaskOverview from './comps/task/TaskOverview';
import { useState, useEffect } from 'react';
import Settings from './comps/settings/Settings'
import Hidden from '@mui/material/Hidden';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import SimpleList from './comps/database/SimpleList';
import Logo from './logo.png';
import MenuButtons from './comps/MenuButtons';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import ListIcon from '@mui/icons-material/List';


function App() {
  
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isLoadingDone, setIsLoadingDone] = useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    async function fetchData() {
      // Update the document title using the browser API
      document.title = "Reparaturcafe";
        
      let response = await fetch('/api/session_user', {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          }
      })
      let data = await response.json()
      setUserLoggedIn(data["user_logged_in"]);
      setUsername(data["username"]);
      setUserRole(data["user_role"]);
      setCsrfToken(data["csrf_token"]);
      setIsLoadingDone(true);
    }
    fetchData();
  }, []);

  const menuList = [
    ["Formular", <DescriptionOutlinedIcon />, "/new_task"],
    ["Datenbank", <StorageOutlinedIcon />, "/database"],
    ["Liste", <ListIcon/>, "/simple_list" ],
  ]
  const menuListUserOnly = [
    ["Übersicht", <DashboardIcon />, "/overview"]
  ]
  const menuListAdminOnly = [
    ["Einstellungen", <SettingsIcon />, "/settings"]
  ]
  const userMenu = ['Profile', 'Logout'];

  var firstLetter = "#";
  if(username) firstLetter = username[0];
  
  return (
    isLoadingDone ? (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <AppBar position="static" style={{ background: '#fff' }}>
        <Toolbar>
          <a href="/"><img src={Logo} style={{marginRight:"20px"}}/></a>
          <MenuButtons 
            list={menuList}
          />
          {userLoggedIn ? (
            <MenuButtons 
            list={menuListUserOnly}
            />
          ) : ""}
          {userRole == 'admin' ? (
            <MenuButtons 
            list={menuListAdminOnly}
            />
          ) : ""}
          <Box display='flex' flexGrow={1}>

          </Box>
          <QRCodeScanner></QRCodeScanner>
          <Box sx={{ flexGrow: 0, ml:2 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="avatar" src="" children={firstLetter}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px', p: 1 }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userLoggedIn ? (
                <div>
                  <MenuItem key={username} disabled>
                  <Typography textAlign="center">{username}</Typography>
                  </MenuItem>
                  <MenuItem key={"logout"} onClick={handleCloseUserMenu}>
                    <Logout csrfToken={csrfToken}/>
                  </MenuItem>
                </div>
              ) : (
                "Hier kommt später der QRCode hin, zum einloggen über ein Mobilgerät"
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>      
        <Switch>
            <Route
              path="/settings"
              render={(props) =>
                <Settings {...props} userRole={userRole} csrfToken={csrfToken}/>
              }>
            </Route>
            <Route
              path="/qrcode/:token"
              render={(props) =>
                <QRCodeController {...props} csrfToken={csrfToken}/>
              }>
            </Route>
            <Route
              path="/task/:taskId"
              render={(props) =>
                <TaskOverview {...props} csrfToken={csrfToken}/>
              }>
            </Route>
            <Route path="/new_task">
              <NewTaskFormular csrfToken={csrfToken}></NewTaskFormular>
            </Route>
            <Route path="/database" component={Database}></Route>
            <Route path="/overview" 
              render={(props) => 
                <Overview {...props} userRole={userRole}/>
                }>
            </Route>
            <Route path="/scan" component={QRCodeScanner}></Route>
            <Route path="/simple_list" component={SimpleList}></Route>
            <Route path="/">
              <h2>Hallo.</h2>
              <p style={{marginTop:50}}>Dies ist das digitale ReparaturCafè, der AWO Oberlar. Ein Workflow System, welches wir zur Dokumentation der Reparaturen verwenden.</p>
              <p style={{marginTop:50}}>Können wir dir bei einem defekten Gerät helfen? Dann klicke auf den Button und erzähl uns alles über dein Gerät.</p>
              <Button 
                component={Link} 
                to="/new_task"
                variant="contained"
                color="primary"
                startIcon={<DescriptionOutlinedIcon />}>
                <Hidden mdDown>
                  Formular
                </Hidden>
              </Button>
              <p style={{marginTop:50}}>Gerne kannst du dich hier umschauen, klicke auf den nachfolgenden Button um unsere Datenbank zu durchstöbern.</p>
              <Button 
                component={Link} 
                to="/database"
                variant="contained"
                color="primary"
                startIcon={<StorageOutlinedIcon />}>
                <Hidden mdDown>
                  Datenbank
                </Hidden>
              </Button>
            </Route>
        </Switch>
    </Container>
    </BrowserRouter>
    <Divider style={{marginTop:150}}/>
    <Grid container>
      <Grid item textAlign="center" xs={12}>
        <Typography variant="caption">v1.4.0-beta</Typography>
      </Grid>
    </Grid>
    </ThemeProvider>
    ):"loading..."
  );
}

export default App;
