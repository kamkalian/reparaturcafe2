import './App.css';
import React from 'react';
import Container from '@material-ui/core/Container';
import NewTask from './comps/task/NewTask';
import NewUserForm from './comps/user/NewUserForm';
import Database from './comps/database/Database';
import QRCodeScanner from './comps/QRCodeScanner';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import Grid from '@material-ui/core/Grid';
import './custom.css';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import FetchTask from './comps/FetchTask';
import QRCodeController from './comps/QRCodeController';
import TaskOverview from './comps/task/TaskOverview';
import { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';


function App() {
  
  const [noAdminAvailable, setNoAdminAvailable] = useState(false);

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
      })
  });


  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <h1>ReparaturCafé</h1>
          <Grid container spacing={3} justify="center">
            <Grid item>
              <Button 
                component={Link} 
                to="/"
                color="inherit"
                startIcon={<HomeOutlinedIcon />}>
                Startseite
              </Button>
            </Grid>
            <Grid item>
              <Button 
                component={Link} 
                to="/new_task"
                color="inherit"
                startIcon={<DescriptionOutlinedIcon />}>
                Formular
              </Button>
            </Grid>
            <Grid item>
              <Button 
                component={Link} 
                to="/database"
                color="inherit"
                startIcon={<StorageOutlinedIcon />}>
                Datenbank
              </Button>
            </Grid>
            <Grid item>
              <QRCodeScanner></QRCodeScanner>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {noAdminAvailable ? (
        <Alert severity="warning">Sicherheitshinweis: Es wurde kein User mit der Rolle Admin gefunden!</Alert>
      ) : ""}
      <Container>      
        <Switch>
            <Route
              path="/api/qrcode/:hashToken"
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
              <NewTask></NewTask>
            </Route>
            <Route path="/new_user">
              <NewUserForm></NewUserForm>
            </Route>
            <Route path="/database" component={Database}></Route>
            <Route path="/scan" component={QRCodeScanner}></Route>
            <Route
              path="/api/task/:id/:token"
              render={(props) =>
                <FetchTask {...props}/>
              }>
            </Route>
            <Route path="/">
              <h2>Hallo.</h2>
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
