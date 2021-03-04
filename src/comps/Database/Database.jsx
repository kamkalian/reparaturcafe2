import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import MagneticSign from './MagneticSign';
import FilterArea from './FilterArea';


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
    }
  }

  apiCall = () => {
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterCategory: this.state.filterCategory,
          filterManufacturer: this.state.filterManufacturer,
        })
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

  render() {    
    const taskList = this.state.data.map((item, index) => {
      return(
          <ListItem button className="task-sign" border={1} key={index}>
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
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} border={2}>
          <List component="ul" aria-label="main mailbox folders">
            {taskList}
            </List>
          </Grid>
        </Grid>
      </React.Fragment>
      
    );
  }
  
}