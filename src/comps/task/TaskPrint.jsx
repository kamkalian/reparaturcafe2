import React from 'react';
import Box from '@mui/material/Box';
import MagneticSign from '../database/MagneticSign';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Log from './Log';


export default class TaskOverview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        data: this.props.data,
        writeable: false,
        hover: false,
    }
  }


  render(){
      // Nur ein Komma anzeigen, wenn Vor und Nachname angegeben wurden.
      var komma = ", " 
      if(!this.state.data['cus_first_name'] || !this.state.data['cus_last_name']) komma = "";
      return(
          <Box style={{marginRight:20, marginLeft:20}}>
            <MagneticSign
            taskId={this.state.data['tsk_id']}
            deviceName={this.state.data['dev_name']}
            deviceManufacturer={this.state.data['dev_mnf_name']}
            deviceCategory={this.state.data['dev_category']}
            printversion
            newQRCodeImage={this.props.newQRCodeImage}
            />
            <Grid container style={{margin:0}}>
              <Grid item xs={8} style={{marginBottom:20, paddingRight:10}}>
                <Grid container>
                  <Grid item xs={4} style={{marginBottom:20}}>
                    <h3>Modell</h3>
                    {this.state.data['dev_model'] ? (
                      <Typography>
                        {this.state.data['dev_model']}
                      </Typography>
                    ): "-"}
                  </Grid>
                  <Grid item xs={4} style={{marginBottom:20}}>
                    <h3>Zubehör</h3>
                      {this.state.data['accessory_list'] && this.state.data['accessory_list'].length ? (
                        <Typography>
                          {this.state.data['accessory_list']}
                        </Typography>
                      ): "-"}
                  </Grid>
                  <Grid item xs={4} style={{marginBottom:20}}>
                    <h3>Erstelldatum</h3>
                    <Typography>
                      {this.state.data['tsk_creation_date']}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{marginBottom:20}}>
                    <h3>Fehlerbeschreibung</h3>
                    <Typography>
                      {this.state.data['tsk_fault_description']}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{marginBottom:20}}>
                    <h3>Verlauf</h3>
                    {this.state.data['log_list'] && this.state.data['log_list'].length ? (
                        <Log logList={this.state.data['log_list']}/>
                    ) : "-"}
                  </Grid>
                </Grid>
              </Grid>
              {this.state.data['writeable'] ? (
                <Grid item xs={4} style={{borderLeft:"2px solid #ccccccaa", paddingLeft:10}}>
                  <Grid container>
                    <Grid item xs={12}>
                      <h3>Kontaktdaten</h3>
                      <p>{this.state.data['cus_first_name']}{komma}{this.state.data['cus_last_name']}</p>
                      {this.state.data['cus_phone'] ? <p>{this.state.data['cus_phone']}</p> : ""}
                      {this.state.data['cus_email'] ? <p>{this.state.data['cus_email']}</p> : ""}
                    </Grid>
                    <Grid item xs={12}>
                      <h3>Status</h3>
                      <Typography>
                        {this.state.data['tsk_state_caption']}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <h3>Nächster Schritt</h3>
                      <Typography>
                        {this.state.data['tsk_next_step_caption']}
                      </Typography>
                    </Grid>
                  </Grid>

                </Grid>
              ) : ""}
              
            </Grid>
          </Box>
      )
  }
}
