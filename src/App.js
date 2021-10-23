import './App.css';
import React from 'react';
import Container from '@mui/material/Container';
import NewTaskFormular from './comps/task/NewTaskFormular';
import Database from './comps/database/Database';
import Overview from './comps/database/Overview';
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
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Hidden from '@mui/material/Hidden';


function App() {
  
  const [noAdminAvailable, setNoAdminAvailable] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Update the document title using the browser API
    document.title = "Reparaturcafe";
    
      fetch('/api/admin_available', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          }
      })
      .then((response) => {
        response.json()
        .then(data => {
          setNoAdminAvailable(!data["admin_available"]);
        });  
      });
      
      fetch('/api/session_user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
      response.json()
      .then(data => {
        setUserLoggedIn(data["user_logged_in"]);
        setUsername(data["username"]);
        setUserRole(data["user_role"])
      });  
    });
  });


  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <h1>ReparaturCafé</h1>
          <Grid container spacing={3} justify="center">
            {!userLoggedIn ? (
              <Grid item>
                <Button 
                  component={Link} 
                  to="/"
                  color="inherit"
                  startIcon={<HomeOutlinedIcon />}>
                  Startseite
                </Button>
              </Grid>
            ) : ""}
            <Grid item>
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
              <Grid item>
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
              <Grid item>
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
            <Grid item>
              <QRCodeScanner></QRCodeScanner>
            </Grid>
            {userLoggedIn ? (
              <Grid item>
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
              <Grid item>
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
              <Grid item>
                <Button 
                  component={Link} 
                  to="/logout"
                  color="inherit"
                  startIcon={<PowerSettingsNewIcon />}>
                  <Hidden lgDown>
                    Ausloggen
                  </Hidden>
                </Button>
              </Grid>
            ) : ""}
          </Grid>
        </Toolbar>
      </AppBar>
      {noAdminAvailable ? (
        <Alert severity="warning">Sicherheitshinweis: Es wurde kein User mit der Rolle Admin gefunden!</Alert>
      ) : ""}
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
                <QRCodeController {...props}/>
              }>
            </Route>
            <Route
              path="/task/:taskId"
              render={(props) =>
                <TaskOverview {...props}/>
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
              <h2>Hallo. test</h2>
              <p style={{marginTop:50}}>Trete ein. Du stehst mitten im digitalen ReparaturCafè, der AWO Oberlar. </p>
              <p style={{marginTop:50}}>Können wir dir bei einem defekten Gerät helfen? Dann klicke auf den Button und erzähl uns alles über dein Gerät.</p>
              <a href="/new_task">Formular</a>
              <p style={{marginTop:50}}>Gerne kannst du dich hier umschauen, klicke auf den nachfolgenden Button um unsere Datenbank zu durchstöbern.</p>
              <a href="/database">Datenbank</a>
            </Route>
        </Switch>
      
    </Container>
    </BrowserRouter>
    </ThemeProvider>
    
  );
}

export default App;
