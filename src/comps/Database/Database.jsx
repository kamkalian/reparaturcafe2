import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import MagneticSign from './MagneticSign';


export default class Database extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: []
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
    .then(data => this.setState({ data: data }));
  
  }

  componentDidMount() {
    this.apiCall();
  }

  render() {
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
        <Grid container>
          <Grid item xs={12} sm={6} lg={4} border={2}>
          <List component="ul" aria-label="main mailbox folders">
            {taskList}
            </List>
          </Grid>
        </Grid>
      </React.Fragment>
      
    );
  }
  
}