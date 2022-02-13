import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import SensorsIcon from '@mui/icons-material/Sensors';
import Alert from '@mui/material/Alert';
import { FastfoodOutlined } from '@mui/icons-material';


export default class LabelPrinterSettings extends React.Component {
  timer;

  constructor(props){
    super(props);
    this.state = {
      labelPrinterHost: "",
      currentHost: "",
      labelPrinterUser: "",
      labelPrinterQRCodePath: "",
      labelPrinterKey: "",
      labelPrinterSaveState: false,
      pingResult: "",
      pingTestDisabled: false,
      pingSeverity: "",
      labelTestPrintState: false,
    } 
  }

  componentDidMount(){
    console.log(this.props.csrfToken)
    this.fetchCallSettings();
  }

  fetchCallSettings = () =>{
    fetch('/api/label_printer_settings', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': this.props.csrfToken,
        }
    })
    .then(response => response.json())
    .then(res => {
        console.log(res)
        this.setState({
          labelPrinterHost: res["host"],
          currentHost: res["host"],
          labelPrinterUser: res["user"],
          labelPrinterQRCodePath: res["qr_code_path"],
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });      
  }


  fetchCallSaveSettings = () =>{
    fetch('/api/label_printer_save_settings', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': this.props.csrfToken,
        },
        body: JSON.stringify({
          host: this.state.labelPrinterHost,
          user: this.state.labelPrinterUser,
          qr_code_path: this.state.labelPrinterQRCodePath,
          ssh_key: this.state.labelPrinterKey,

        })
    })
    .then(response => response.json())
    .then(res => {
        if(res["state"] === "success"){
          this.setState({
            labelPrinterSaveState: true,
            currentHost: this.state.labelPrinterHost,
            pingTestDisabled: false,
            pingResult: "",
          });
          this.timer = setTimeout(() => {
            this.setState({
              labelPrinterSaveState: false,
            });
          }, 3000);
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });      
  }

  fetchCallPingTest = () =>{
    this.setState({
      pingResult: "Ping wird gesendet...",
    }, function(){
      fetch('/api/label_printer_ping_test', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': this.props.csrfToken,
          }
      })
      .then(response => response.json())
      .then(res => {
          this.setState({
            pingResult: res["ping_result"],
            pingSeverity: res["severity"],
          });
      })
      .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
      });      
    })
  }

  fetchPrintLabel = (event) => {
    fetch('/api/print_label_request/test', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': this.props.csrfToken,
      },
    })
    .then(response => response.json())
    .then(res => {
        if(res["state"] === "success"){
          this.setState({
            labelTestPrintState: true,
          });
          this.timer = setTimeout(() => {
            this.setState({
              labelTestPrintState: false,
            });
          }, 3000);
        }
    })
  }

  handleTextFieldChange = (event) => {
    switch(event.currentTarget.id) {
      case 'labelPrinterHost':
        this.setState({
          labelPrinterHost: event.currentTarget.value,
        });
        if(this.state.currentHost !== event.currentTarget.value){
          this.setState({
            pingTestDisabled: true,
          });
        }else{
          this.setState({
            pingTestDisabled: false,
          });
        }
        return false;

      case 'labelPrinterQRCodePath':
        this.setState({
          labelPrinterQRCodePath: event.currentTarget.value
        });
        return false;
      
      case 'labelPrinterUser':
        this.setState({
          labelPrinterUser: event.currentTarget.value
        });
        return false;

      case 'labelPrinterKey':
        this.setState({
          labelPrinterKey: event.currentTarget.value
        });
        return false;

      default:
        return false;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render(){
    return(
      <Box style={{paddingTop:10}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField 
              id="labelPrinterHost" 
              label="Host" 
              variant="outlined" 
              fullWidth={true}
              value={this.state.labelPrinterHost}
              onChange={this.handleTextFieldChange}
              //onChange={this.props.handleTextInputChange}
              error={this.props.nameError}
              InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
              }}/>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              id="labelPrinterUser" 
              label="User" 
              variant="outlined" 
              fullWidth={true}
              value={this.state.labelPrinterUser}
              onChange={this.handleTextFieldChange}
              //onChange={this.props.handleTextInputChange}
              error={this.props.nameError}
              InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
              }}/>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              id="labelPrinterQRCodePath" 
              label="QR Codes Pfad" 
              variant="outlined" 
              fullWidth={true}              
              value={this.state.labelPrinterQRCodePath}
              onChange={this.handleTextFieldChange}
              //onChange={this.props.handleTextInputChange}
              error={this.props.nameError}
              InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FolderIcon />
                    </InputAdornment>
                  ),
              }}/>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              id="labelPrinterKey" 
              label="SSH Key" 
              variant="outlined" 
              fullWidth={true}
              multiline
              rows={5}
              value={this.state.labelPrinterKey}
              onChange={this.handleTextFieldChange}
              placeholder={"Lade hier den Inhalt des privaten SSH-Keys rein. Ein bereits gespeicherter Key wird hier nicht mehr angeeigt."}
              />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<SaveIcon />}
              onClick={this.fetchCallSaveSettings}
              >
                  Speichern
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<SensorsIcon />}
              onClick={this.fetchCallPingTest}
              disabled={this.state.pingTestDisabled}
              >
                  ping test
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<PrintIcon />}
              onClick={this.fetchPrintLabel}
              >
                  Test-Etikett ausdrucken
            </Button>
          </Grid>
          <Grid item xs={12}>
            {this.state.labelPrinterSaveState ? (
              <Alert severity="success">Einstellungen wurden gespeichert.</Alert>
            ) : ""}
          </Grid>
          <Grid item xs={12}>
            {this.state.pingResult ? (
              <Alert severity={this.state.pingSeverity} onClose={() => {
                this.setState({
                  pingResult: '',
                });
              }}>{this.state.pingResult}</Alert>
            ) : ""}
          </Grid>
          <Grid item xs={12}>
            {this.state.labelTestPrintState ? (
              <Alert severity="success">Etikett wurde an den Drucker geschickt.</Alert>
            ) : ""}
          </Grid>
        </Grid>
      </Box>
    );
  }
}