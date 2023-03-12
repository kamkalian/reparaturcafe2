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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Log from './Log';
import Attachments from '../Attachments';
import NewComment from './NewComment';
import QRCodes from './QRCodes';


export default class TaskOverview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        data: "",
        writeable: false,
        hover: false,
        newQRCodeImage: null,
        newQRCodePrintImage: null,
        showNewTaskInfo: false,
        stateList: [],
        stepList: [],
        state: "",
        nextStep: "",
        logList: [],
        comment: "",
        qrCodesOpen: false,
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
              state: data['tsk_state'],
              nextStep: data['tsk_next_step'],
              logList: data['log_list'],
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

      // Nachfolgender Fetch wird nur abgeschickt, wenn die Task gerade neu angelegt wurde.
      if(newTaskIndicator){
        fetch('/api/new_qrcode_image/'+taskId, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          if(response.status===200){
            response.blob()
            .then(imageBlob => {
              this.setState({
                newQRCodeImage: URL.createObjectURL(imageBlob)
              });
            });
          }
        })
      }

      fetch('/api/new_qrcode_image/'+taskId+'?qrcode_only=1', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if(response.status===200){
          response.blob()
          .then(imageBlob => {
            this.setState({
              newQRCodePrintImage: URL.createObjectURL(imageBlob)
            });
          });
        }
      })

      fetch('/api/state_lists', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if(response.status===200){
          response.json()
          .then(data => {
            this.setState({
              stateList: data['state_list'],
              stepList: data['step_list']
            });
          });
        }
      })
  }

  componentDidMount(){
      this.fetchCall();
  }

  handleStateChange = (event) => {
    this.setState({
      state: event.target.value
    }, function(){
      fetch('/api/change_state', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': this.props.csrfToken,
        },
        body: JSON.stringify({
          tsk_id: this.state.data['tsk_id'],
          new_state: this.state.state
        }),
      })
      .then((response) => {
        if(response.status===200){
          response.json()
          .then(data => {
            this.fetchCall();
          });
        }
      })
    })
  }

  handleNextStepChange = (event) => {
    this.setState({
      nextStep: event.target.value
    }, function(){
      fetch('/api/change_next_step', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': this.props.csrfToken,
        },
        body: JSON.stringify({
          tsk_id: this.state.data['tsk_id'],
          new_next_step: this.state.nextStep
        }),
      })
      .then((response) => {
        if(response.status===200){
          response.json()
          .then(data => {
            this.fetchCall();
          });
        }
      })
    })
  }

  handlePrintLabelClick = (event) => {
    fetch('/api/print_label_request/' + this.state.data['new_token'], {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': this.props.csrfToken,
      },
    })
  }

  render(){
      var full_name = "";
      if(this.state.data['cus_first_name'] && this.state.data['cus_last_name']){
        full_name = this.state.data['cus_first_name'] + ", " + this.state.data['cus_last_name'];
      }else if(this.state.data['cus_first_name']){
        full_name = this.state.data['cus_first_name'];
      }else{
        full_name = this.state.data['cus_last_name'];
      }
       
      const stateOptions = this.state.stateList.map((state, index) => (
        <MenuItem value={state[0]} key={index}>{state[1]}</MenuItem>
      ));
      const stepOptions = this.state.stepList.map((step, index) => (
        <MenuItem value={step[0]} key={index}>{step[1]}</MenuItem>
      ));
      return(
          <Box style={{marginRight:20, marginTop:20}} id="task">
            {this.state.showNewTaskInfo ? (
              <Alert severity="success">
              <AlertTitle>Deine Daten wurden erfolgreich gespeichert.</AlertTitle>
              <Typography>Drucke diese Seite, oder speicher den QR-Code, damit du später auf deine Daten zugreifen kannst.</Typography>
              <p>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <a href={"https://reparaturcafe.awo-oberlar.de/qrcode/tsk" + this.state.data["new_token"]} >
                  <img src={this.state.newQRCodeImage} /></a>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Button 
                      color="primary"
                      variant="contained"
                      href={"https://reparaturcafe.awo-oberlar.de/qrcode/tsk" + this.state.data["new_token"]}
                      fullWidth
                      >Link</Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={this.handlePrintLabelClick}
                      >Kunden-Etikett ausdrucken</Button>
                    </Grid>
                  </Grid>
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
              fetchCall={this.fetchCall} 
              csrfToken={this.props.csrfToken}/>) : <LockedButton />}
              >
            <MagneticSign
            taskId={this.state.data['tsk_id']}
            deviceName={this.state.data['dev_name']}
            deviceManufacturer={this.state.data['dev_mnf_name']}
            deviceCategory={this.state.data['dev_category']}
            deviceType={this.state.data['dev_electronic_mechanical_type']}
            nextStep={this.state.data['tsk_next_step']}
            />
            </Badge>
            {this.state.writeable ? (
              this.state.data ? (
                <div>
                <Grid container style={{marginTop:10}} spacing={3}>
                  <Grid item md={6} xs={12}>  
                    <ReactToPrint
                      trigger={() => {
                        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                        // to the root node of the returned component as it will be overwritten.
                        return (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PrintIcon />}
                            fullWidth
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
                        newQRCodeImage={this.state.newQRCodePrintImage} 
                        ref={el => (this.componentRef = el)} /> 
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12}>  
                    {this.state.writeable ? (
                      <QRCodes 
                        hashTokens={this.state.data['hash_tokens']}
                        csrfToken={this.props.csrfToken}
                        tskId={this.state.data['tsk_id']}
                        handleRefresh={this.fetchCall}/>
                    ) : ""}
                  </Grid>                  
                </Grid>
              </div>
              ) : ""
            ) : ""}
            <Grid container style={{padding:30, margin:0}}>
              <Grid item md={8} xs={12} style={{marginBottom:20, paddingRight:20}}>
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
                    <h3>Fotos</h3>
                    <Grid item xs={12}>
                        <Attachments
                        files={this.state.data['image_files']}
                        handleUploadInputChange={this.handleUploadInputChange}
                        handleDeleteAttachmentButton={this.handleDeleteAttachmentButton}
                        />
                  </Grid>
                  </Grid>
                    <Grid item xs={12} style={{marginBottom:20}}>
                      <h3>Verlauf</h3>
                    {this.state.logList && this.state.logList.length ? (
                      <Log logList={this.state.logList}/>
                    ) : "-"}
                    </Grid>
                </Grid>
              </Grid>
              {full_name ? (
              <Grid item md={4} xs={12} style={{borderLeft:"2px solid #ccccccaa", paddingLeft:20}}>
                <Grid container>
                  <Grid item md={12} sm={6} xs={12}>
                    <h3>Kontaktdaten</h3>
                    <p>{full_name}</p>
                    {this.state.data['cus_phone'] ? <p>{this.state.data['cus_phone']}</p> : ""}
                    {this.state.data['cus_email'] ? <p>{this.state.data['cus_email']}</p> : ""}
                  </Grid>
                  <Grid item md={12} sm={6} xs={12}>
                    <h3>Status / nächster Schritt</h3>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        {this.state.writeable ? (
                        <FormControl fullWidth>
                          <InputLabel id="state-label">Status</InputLabel>
                          <Select
                            labelId="state-label"
                            id="state-select"
                            value={stateOptions ? this.state.state : ""}
                            label="Status"
                            onChange={this.handleStateChange}
                          >
                            {stateOptions}
                          </Select>
                        </FormControl>
                        ) : this.state.data['tsk_state_caption'] }
                      </Grid>
                      <Grid item xs={12}>
                        {this.state.writeable ? (
                        <FormControl fullWidth>
                          <InputLabel id="next-step-label">nächster Schritt</InputLabel>
                          <Select
                            labelId="next-step-label"
                            id="next-step-select"
                            value={stepOptions ? this.state.nextStep : ""}
                            label="nächster Schritt"
                            onChange={this.handleNextStepChange}
                          >
                            {stepOptions}
                          </Select>
                        </FormControl>
                        ) : this.state.data['tsk_next_step_caption']}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <NewComment 
                    tsk_id={this.state.data['tsk_id']}
                    csrfToken={this.props.csrfToken}
                    fetchCall={this.fetchCall}/>
                  </Grid>
                  </Grid>
                </Grid>    
            ) : ""}     
            </Grid>
          </Box>
      )
  }
}
