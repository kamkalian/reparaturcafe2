import React from 'react';
import Box from '@mui/material/Box';
import MagneticSign from '../database/MagneticSign';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import UnlockedButton from '../UnlockedButton';
import LockedButton from '../LockedButton';
import PrintIcon from '@mui/icons-material/Print';
import Button from '@mui/material/Button';
import ReactToPrint from 'react-to-print';
import TaskPrint from './TaskPrint';
import { Alert, AlertTitle } from '@mui/lab';


export default class TaskOverview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        data: "",
        writeable: false,
        hover: false,
        newQRCodeImage: "",
        showNewTaskInfo: false
    }
  }

  fetchCall = () =>{
      var {taskId} = this.props.match.params;
      var newTaskIndicator = false;
      if(this.props.location.search === "?new=1") newTaskIndicator = true;

      fetch('/api/task?tsk_id='+taskId+'&new_task_indicator='+newTaskIndicator, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          }
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
            }, function() {
              if(this.props.location.search === "?new=1" && this.state.data["new_token"]){
                this.setState({
                  showNewTaskInfo: true
                });
              }
            });
          });  
        }
      });

      fetch('/api/new_qrcode_image/'+taskId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if(response.status===200){
          response.text()
          .then(text => {
            this.setState({
              newQRCodeImage: text
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
          <Box style={{marginRight:20, marginTop:20}} id="task">
            {this.state.showNewTaskInfo ? (
              <Alert severity="success">
              <AlertTitle>Deine Daten wurden erfolgreich gespeichert.</AlertTitle>
              <Typography>Drucke diese Seite, oder speicher den QR-Code, damit du später auf deine Daten zugreifen kannst.</Typography>
              <p>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <a href={"https://reparaturcafe.awo-oberlar.de/qrcode/tsk" + this.state.data["new_token"]} >
                  <div dangerouslySetInnerHTML={{__html: this.state.newQRCodeImage}} /></a>
                </Grid>
                <Grid item xs={8}>
                  <Button 
                  color="primary"
                  href={"https://reparaturcafe.awo-oberlar.de/qrcode/tsk" + this.state.data["new_token"]}
                  >Link</Button>
                </Grid>
              </Grid>
              </p>
              <Typography>
                <Box fontWeight="fontWeightBold">
                  Wie geht es weiter?
                </Box>
                Unsere EhrenamtlerInnen schauen sich alle Daten zu deinem Gerät an.<br />
                Dabei versuchen wir Reparaturlösungen zu finden und melden uns dann in den nächsten Tagen bei dir.
              </Typography>
              </Alert>
            ) : ""}
            <h2>Aufgabe</h2>
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
            {this.state.writeable ? (
              this.state.data ? (
                <div>
                <Grid container style={{marginTop:20}}>
                  <Grid item xs={12}>  
                    <ReactToPrint
                      trigger={() => {
                        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                        // to the root node of the returned component as it will be overwritten.
                        return (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PrintIcon />}
                            >
                              Drucken
                          </Button>   
                        );
                      }}
                      content={() => this.componentRef}
                    />
                    <div hidden>
                      <TaskPrint 
                        data={this.state.data} 
                        writeable={true} 
                        newQRCodeImage={this.state.newQRCodeImage} 
                        ref={el => (this.componentRef = el)} /> 
                    </div>
                  </Grid>
                </Grid>
              </div>
              ) : ""
            ) : ""}
            <Grid container style={{padding:30, margin:0}}>
              <Grid item md={8} xs={12} style={{marginBottom:20, paddingRight:20}}>
                <h3>Fehlerbeschreibung</h3>
                <Typography>
                  {this.state.data['tsk_fault_description']}
                </Typography>
              </Grid>
              {this.state.writeable ? (
                <Grid item md={4} xs={12} style={{borderLeft:"2px solid #ccccccaa", paddingLeft:20}}>
                  <Grid container>
                    <Grid item md={12} sm={6} xs={12}>
                      <h3>Kontaktdaten</h3>
                      <p>{this.state.data['cus_first_name']}{komma}{this.state.data['cus_last_name']}</p>
                      {this.state.data['cus_phone'] ? <p>{this.state.data['cus_phone']}</p> : ""}
                      {this.state.data['cus_email'] ? <p>{this.state.data['cus_email']}</p> : ""}
                    </Grid>
                    <Grid item md={12} sm={6} xs={12}>
                      <h3>Status</h3>
                      <p>{this.state.data['tsk_state']}</p>
                    </Grid>
                  </Grid>

                </Grid>
              ) : ""}
              
            </Grid>
          </Box>
      )
  }
}
