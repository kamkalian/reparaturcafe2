import React from 'react';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


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
          <ListItem button>
            <ListItemText 
              primary={item.deviceName}
              primaryTypographyProps={{variant:"h3"}}
              secondary={
                <React.Fragment>
                  {item.deviceCategory ? (<Chip 
                  label={item.deviceCategory}
                  color="secondary"
                  style={{margin:5}}
                  />): ""}
                  {item.deviceManufacturer ? (
                  <Chip 
                  label={item.deviceManufacturer}
                  color="secondary"
                  style={{margin:5}}
                  />) : ""}
                </React.Fragment>
              }
              secondaryTypographyProps={{component:"span"}}
            />
          </ListItem>
      );
    });
    
    return(
      <React.Fragment>
        <h2>Database</h2>
        <List component="ul" aria-label="main mailbox folders">
        {taskList}
        </List>
        
      </React.Fragment>
      
    );
  }
  
}