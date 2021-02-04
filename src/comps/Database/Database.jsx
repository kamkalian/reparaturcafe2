import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

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
        <Card style={{width:"30%", display:"inline-block", marginRight:10}}>
        <CardContent>
          {item["deviceManufacturer"] ? (
            <Chip label={item["deviceManufacturer"]} style={{marginRight:5}} />
            ) : ""}
          {item["deviceCategory"] ? (
            <Chip label={item["deviceCategory"]} style={{marginRight:5}}/>
            ) : ""}
          
          <Typography variant="h5" component="h2" style={{marginTop:10}}>
            {item["deviceName"]}
          </Typography>
          <Typography color="textSecondary">
            {item["deviceModel"]}
          </Typography>
          <Typography variant="body2" component="p">
            {item["faultDescription"]}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="primary">Öffnen</Button>
        </CardActions>
      </Card>
      );
    });
    
    return(
      <React.Fragment>
        <h2>Database</h2>
        {taskList}
      </React.Fragment>
      
    );
  }
  
}