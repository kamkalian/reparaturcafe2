import './App.css';
import React from 'react';
import Container from '@material-ui/core/Container';
import NewTask from './comps/NewTask/NewTask';
import Database from './comps/Database/Database';
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


function App() {
  
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
          </Grid>
        </Toolbar>
      </AppBar>
      <Container>      
        <Switch>
            <Route path="/new_task">
              <NewTask></NewTask>
            </Route>
            <Route path="/database">
              <Database></Database>
            </Route>
            <Route path="/">
              <h1>Hallo.</h1>
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
