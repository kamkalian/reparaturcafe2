import React from 'react';
import Box from '@material-ui/core/Box';
import MagneticSign from '../database/MagneticSign';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import UnlockedButton from '../UnlockedButton';
import LockedButton from '../LockedButton';


export default class TaskOverview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        data: "",
        writeable: false,
        hover: false,
    }
  }

  fetchCall = () =>{
      var {taskId} = this.props.match.params;

      fetch('/api/task', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({'tsk_id': taskId}),
      })
      .then((response) => {
        if(response.status===200){
          response.json()
          .then(data => {
            // TODO Checks einbauen, um den das Editieren festzulegen
            // nur Statuscode reicht nicht aus.
            this.setState({
              data: data,
              writeable: data['writeable']
            });
          });  
        }
      })
  }

  componentDidMount(){
      this.fetchCall();
  }

  render(){
      // Nur ein Komma anzeigen, wenn Vor und Nachname angegeben wurden.
      var komma = ", " 
      if(!this.state.data['cus_first_name'] || !this.state.data['cus_last_name']) komma = "";
      return(
          <Box style={{marginRight:20}}>
            <h2>Task</h2>
            <Badge 
              style={{width:"100%"}}
              badgeContent={this.state.writeable ? (
              <UnlockedButton
              taskId={this.state.data['tsk_id']} 
              fetchCall={this.fetchCall} />) : <LockedButton />}>
            <MagneticSign
            taskId={this.state.data['tsk_id']}
            deviceName={this.state.data['dev_name']}
            deviceManufacturer={this.state.data['dev_mnf_name']}
            deviceCategory={this.state.data['dev_category']}
            />
            </Badge>
            <Grid container style={{padding:30, margin:0, border:"1px solid #999"}}>
              <Grid item md={8} xs={12} style={{marginBottom:20}}>
                <h3>Fehlerbeschreibung</h3>
                <Typography>
                  {this.state.data['tsk_fault_description']}
                </Typography>
              </Grid>
              {this.state.writeable ? (
                <Grid item md={4} xs={12} style={{borderLeft:"2px solid #ccccccaa", paddingLeft:10}}>
                  <Grid container>
                    <Grid item md={12} sm={6} xs={12}>
                      <h3>Kontaktdaten</h3>
                      <p>{this.state.data['cus_first_name']}{komma}{this.state.data['cus_last_name']}</p>
                      {this.state.data['cus_phone'] ? <p>{this.state.data['cus_phone']}</p> : ""}
                      {this.state.data['cus_email'] ? <p>{this.state.data['cus_email']}</p> : ""}
                    </Grid>
                    <Grid item md={12} sm={6} xs={12}>
                      <h3>Status</h3>
                    </Grid>
                  </Grid>

                </Grid>
              ) : ""}
              
            </Grid>
          </Box>
      )
  }
}
