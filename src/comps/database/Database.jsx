import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import MagneticSign from './MagneticSign';
import FilterArea from './FilterArea';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export default class Database extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      categories: [],
      manufacturers: [],
      openCategory: false,
      openManufacturer: false,
      filterCategory: "",
      filterManufacturer: "",
      filterText: "",
    }
  }

  apiCall = () => {
    fetch('/api/tasks?filter_category='+this.state.filterCategory+'&filter_manufacturer='+this.state.filterManufacturer+'&filter_text='+this.state.filterText, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        data: data['task_list'],
        categories: data['category_list'],
        manufacturers: data['manufacturer_list']
        })
    });
  }

  componentDidMount() {
    this.apiCall();
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
              this.apiCall();
            })
            return false;
        case 'filterCategory':
            this.setState({filterCategory: ""}, function(){
              this.apiCall();
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
                  this.apiCall();
                })
            return false;
        case 'filterCategory':
            this.setState({
                filterCategory: event.currentTarget.dataset.id,
                openCategory: false}, function(){
                  this.apiCall();
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
        this.apiCall();
      });
      
    }
  }

  render() {    
    const taskList = this.state.data.map((item, index) => {
      const CustomLink = props => <Link to={'/task/' + item.id} {...props} />;
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
        <h2>Database</h2>
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
              Gefundene Geräte: {this.state.data.length}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
          <List component="ul" aria-label="main mailbox folders">
            {taskList}
            </List>
          </Grid>
        </Grid>
      </React.Fragment>
      
    );
  }
  
}
