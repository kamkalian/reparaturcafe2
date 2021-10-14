import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import MagneticSign from './MagneticSign';
import FilterArea from './FilterArea';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export default class Overview extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      newTaskList: [],
      inProcessTaskList: [],
      doneTaskList: [],
      categories: [],
      manufacturers: [],
      state_list: [],
      openCategory: false,
      openManufacturer: false,
      filterCategory: "",
      filterManufacturer: "",
      filterText: ""
    }
  }

  fetchTaskLists = () => {
    fetch('/api/task_lists', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterCategory: this.state.filterCategory,
          filterManufacturer: this.state.filterManufacturer,
          filterText: this.state.filterText,
        })
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        newTaskList: data['new_task_list'],
        inProcessTaskList: data['in_process_task_list'],
        doneTaskList: data['done_task_list'],
        categories: data['category_list'],
        manufacturers: data['manufacturer_list']
        })
    });
  }

  fetchStateList = () => {
    fetch('/api/state_list', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        state_list: data['state_list'],
        })
    });
  }

  componentDidMount() {
    this.fetchTaskLists();
    this.fetchStateList();
  }

  handleFilterOpen = (event) => {
    if(event.currentTarget.id === "selectFieldCategory"){
        this.setState({ openCategory: true })
    }else if(event.currentTarget.id === "selectFieldManufacturer"){
        this.setState({ openManufacturer: true })
    }
  }

  handleFilterSelectedDelete = (statename, event) => {
    switch(statename) {
        case 'filterManufacturer':
            this.setState({filterManufacturer: ""}, function(){
              this.fetchTaskLists();
            })
            return false;
        case 'filterCategory':
            this.setState({filterCategory: ""}, function(){
              this.fetchTaskLists();
            })
            return false;
        default:
            return false;
    }
  }

  handleFilterClose = () => {
    this.setState({ openCategory: false, openManufacturer: false })
  }

  handleFilterSelectionClick = (event) => {
    switch(event.currentTarget.dataset.statename) {
        case 'filterManufacturer':
            this.setState({
                filterManufacturer: event.currentTarget.dataset.id,
                openManufacturer: false}, function(){
                  this.fetchTaskLists();
                })
            return false;
        case 'filterCategory':
            this.setState({
                filterCategory: event.currentTarget.dataset.id,
                openCategory: false}, function(){
                  this.fetchTaskLists();
                })
            return false;
        default:
            return false;
    }
  }

  handleFilterTextEnter = (filterText, event) => {
    if(event.key === 'Enter'){
      this.setState({
        filterText: filterText
      }, function(){
        this.fetchTaskLists();
      });
      
    }
  }

  render() {    
    console.log(this.state_list);
    const newTaskList = this.state.newTaskList.map((item, index) => {
      const CustomLink = props => <Link to={'/task/' + item.id} target="_blank" {...props} />;
      return(
          <ListItem
          component={CustomLink}
          button
          border={1}
          key={index}
          style={{padding:0, marginBottom:10}}
          >
            <MagneticSign 
            taskId={item.id}
            deviceName={item.deviceName}
            deviceManufacturer={item.deviceManufacturer === "ohne Angabe" ? "" : item.deviceManufacturer}
            deviceCategory={item.deviceCategory === "ohne Angabe" ? "" : item.deviceCategory}/>
          </ListItem>
      );
    });

    const inProcessTaskList = this.state.inProcessTaskList.map((item, index) => {
      const CustomLink = props => <Link to={'/task/' + item.id} target="_blank" {...props} />;
      return(
          <ListItem
          component={CustomLink}
          button
          border={1}
          key={index}
          style={{padding:0, marginBottom:10}}
          >
            <MagneticSign 
            taskId={item.id}
            deviceName={item.deviceName}
            deviceManufacturer={item.deviceManufacturer === "ohne Angabe" ? "" : item.deviceManufacturer}
            deviceCategory={item.deviceCategory === "ohne Angabe" ? "" : item.deviceCategory}/>
          </ListItem>
      );
    });

    const doneTaskList = this.state.doneTaskList.map((item, index) => {
      const CustomLink = props => <Link to={'/task/' + item.id} target="_blank" {...props} />;
      return(
          <ListItem
          component={CustomLink}
          button
          border={1}
          key={index}
          style={{padding:0, marginBottom:10}}
          >
            <MagneticSign 
            taskId={item.id}
            deviceName={item.deviceName}
            deviceManufacturer={item.deviceManufacturer === "ohne Angabe" ? "" : item.deviceManufacturer}
            deviceCategory={item.deviceCategory === "ohne Angabe" ? "" : item.deviceCategory}/>
          </ListItem>
      );
    });
    
    return(
      <React.Fragment>
        <h2>Übersicht</h2>
        {this.props.userRole === "admin" ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FilterArea
              handleOpen={this.handleFilterOpen}
              handleSelectedDelete={this.handleFilterSelectedDelete}
              handleClose={this.handleFilterClose}
              handleSelectionClick={this.handleFilterSelectionClick}
              filterCategory={this.state.filterCategory}
              openCategory={this.state.openCategory}
              categories={this.state.categories}
              filterManufacturer={this.state.filterManufacturer}
              openManufacturer={this.state.openManufacturer}
              manufacturers={this.state.manufacturers}
              filterText={this.state.filterText}
              handleFilterTextChange={this.handleFilterTextChange}
              handleFilterTextEnter={this.handleFilterTextEnter}
              />
            </Grid>
            <Grid item xs="12">
              <Typography>
                Gefundene Geräte: {this.state.newTaskList.length}
              </Typography>
            </Grid>

            <Grid item xs={12} md={12} xl={4}>
              <Typography style={{color:"#999"}}>Neue Aufgaben</Typography>
              <List component="ul">
              {newTaskList}
              </List>
            </Grid>

            <Grid item xs={12} md={12} xl={4}>
              <Typography style={{color:"#999"}}>In Bearbeitung</Typography>
              <List component="ul">
              {inProcessTaskList}
              </List>
            </Grid>

            <Grid item xs={12} md={12} xl={4}>
              <Typography style={{color:"#999"}}>Fertig</Typography>
              <List component="ul">
              {doneTaskList}
              </List>
            </Grid>

          </Grid>
        ) : "Kein Zutritt!"}
      </React.Fragment>
      
    );
  }
  
}
