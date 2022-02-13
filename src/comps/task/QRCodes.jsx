import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import PrintIcon from '@mui/icons-material/Print';


export default class QRCodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      qrCodesOpen: false,
    }
  }
  handleQRCodeButtonClick = () => {
    if(this.state.qrCodesOpen){
      this.setState({
        qrCodesOpen: false
      });
    }else{
      this.setState({
        qrCodesOpen: true
      });
    }
  }

  handleNewCustomerQRCodeButtonClick = () => {
    fetch('/api/generate_new_qr_code', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': this.props.csrfToken,
      },
      body: JSON.stringify({
        tsk_id: this.props.tskId,
        type: "customer"
      }),
    })
    .then(response => response.json())
    .then(data => {
      this.props.handleRefresh()
    })
  }

  render(){
      const listItems = this.props.hashTokens.map((item, index) => (
        <Chip 
          style={{width:"100%", justifyContent: "flex-start", paddingLeft:10}}
          key={index}
          label={
            <Box
              sx={{
                display: 'flex',
                color: 'text.secondary',
                '& svg': {
                  m: 1.5,
                },
                '& hr': {
                  mx: 0.5,
                },
              }}
            >
              {item['htk_id'].substring(0,20)}
              <Divider orientation="vertical" flexItem />
              {item['htk_creation_date']}
            </Box>
          }
          icon={<QrCodeScannerIcon />}/>
      ));
      return(
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<QrCodeScannerIcon />}
              onClick={this.handleQRCodeButtonClick}
              >
                QR-Codes
            </Button>
          </Grid>
        {this.state.qrCodesOpen ? (
          <React.Fragment>
            <Grid item xs={12}>
              <Stack spacing={1} fullWidth>
                {listItems}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth
                color="primary"
                variant="contained"
                size="small"
                startIcon={<PrintIcon />}
                onClick={this.handleNewCustomerQRCodeButtonClick}
                >Neuen QR-Code drucken</Button>
            </Grid>
          </React.Fragment>
        ) : ""}
        </Grid>
      )
  }
}
