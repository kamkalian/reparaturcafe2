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
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        data: data['task_list'],
        categories: data['category_list']}, function(){
          this.setState({
            categories: this.state.categories.concat("ohne Angabe")
          })
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
            this.setState({manufacturerName: ""})
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
                openManufacturer: false})
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
    console.log(this.state.categories);
    const taskList = this.state.data.map((item, index) => {
      return(
          <ListItem button className="task-sign" border={1}>
            <MagneticSign 
            taskId={item.id}
            deviceName={item.deviceName}
            deviceManufacturer={item.deviceManufacturer}
            deviceCategory={item.deviceCategory}/>
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