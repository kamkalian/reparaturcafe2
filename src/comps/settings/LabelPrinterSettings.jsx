import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import SaveIcon from '@mui/icons-material/Save';


export default class LabelPrinterSettings extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      piLabelPrinterAddr: "",
      piLabelPrinterQRCodePath: "",
      piLabelPrinterKey: "",
    } 
  }

  componentDidMount(){
    console.log(this.props.csrfToken)
    this.fetchCall();
  }

  fetchCall = () =>{
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
          piLabelPrinterAddr: res["addr"],
          piLabelPrinterQRCodePath: res["qr_code_path"],
          piLabelPrinterKey: res["key"],
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });      
  }

  render(){
    return(
      <Box style={{paddingTop:10}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField 
              id="labelPrinterAddr" 
              label="IP Adresse" 
              variant="outlined" 
              fullWidth={true}
              value={this.state.piLabelPrinterAddr}
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
              id="labelPrinterQrCodesPath" 
              label="QR Codes Pfad" 
              variant="outlined" 
              fullWidth={true}
              value={this.state.piLabelPrinterQRCodePath}
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
            <Button
              
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              
              >
                  Speichern
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}