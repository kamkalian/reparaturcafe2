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
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import Grid from '@mui/material/Grid';
import './custom.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import QRCodeController from './comps/QRCodeController';
import TaskOverview from './comps/task/TaskOverview';
import { useState, useEffect } from 'react';
import Alert from '@mui/lab/Alert';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './comps/settings/Settings'
import Hidden from '@mui/material/Hidden';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';


function App() {
  
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

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
    }
    fetchData();
  }, []);

  return (    
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <h1>ReparaturCafé</h1>
            </Grid>
            <Grid item xs={9} display="flex" >
              <Grid container spacing={3} justifyContent="flex-end">
                {!userLoggedIn ? (
                  <Grid item display="flex" justify="center">
                    <Button 
                      component={Link} 
                      to="/"
                      color="inherit"
                      startIcon={<HomeOutlinedIcon />}>
                      Startseite
                    </Button>
                  </Grid>
                ) : ""}
                <Grid item display="flex" justify="center">
                  <Button 
                    component={Link} 
                    to="/new_task"
                    color="inherit"
                    startIcon={<DescriptionOutlinedIcon />}>
                    <Hidden mdDown>
                      Formular
                    </Hidden>
                  </Button>
                </Grid>
                {!userLoggedIn ? (
                  <Grid item display="flex" justify="center">
                    <Button 
                      component={Link} 
                      to="/database"
                      color="inherit"
                      startIcon={<StorageOutlinedIcon />}>
                      <Hidden mdDown>
                        Datenbank
                      </Hidden>
                    </Button>
                  </Grid>
                ) : (
                  <Grid item display="flex" justify="center">
                    <Button 
                      component={Link} 
                      to="/overview"
                      color="inherit"
                      startIcon={<StorageOutlinedIcon />}>
                      <Hidden mdDown>
                        Übersicht
                      </Hidden>
                    </Button>
                  </Grid>
                )}
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <QRCodeScanner></QRCodeScanner>
                </Grid>
                {userLoggedIn ? (
                  <Grid item display="flex" justify="center">
                    <Button 
                      component={Link} 
                      to="/user"
                      color="inherit"
                      startIcon={<AccountCircleOutlinedIcon />}>
                      <Hidden lgDown>
                        {username}
                      </Hidden>
                    </Button>
                  </Grid>
                ) : ""}
                {userRole === "admin" ? (
                  <Grid item display="flex" justify="center">
                    <Button 
                      component={Link} 
                      to="/settings"
                      color="inherit"
                      startIcon={<SettingsIcon />}>
                      <Hidden lgDown>
                        Einstellungen
                      </Hidden>
                    </Button>
                  </Grid>
                ) : ""}
                {userLoggedIn ? (
                  <Grid item display="flex" justify="center">
                    <Logout csrfToken={csrfToken}/>
                  </Grid>
                ) : ""}
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container>      
        <Switch>
            <Route
              path="/settings"
              render={(props) =>
                <Settings {...props} userRole={userRole}/>
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
            <Route path="/">
              <h2>Hallo.</h2>
              <p style={{marginTop:50}}>Trete ein. Du stehst mitten im digitalen ReparaturCafè, der AWO Oberlar. </p>
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
        <Typography variant="caption">v1.2.0-beta</Typography>
      </Grid>
    </Grid>
    </ThemeProvider>
    
  );
}

export default App;
