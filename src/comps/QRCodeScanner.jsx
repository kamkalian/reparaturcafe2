import React from 'react';
import TextField from '@material-ui/core/TextField';
import CropFreeIcon from '@material-ui/icons/CropFree';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({  
    cssOutlinedInput: {
      '&$cssFocused $notchedOutline': {
        backgroundColor: '#ffff0060!important'
      }
    },
    cssFocused: {},
    notchedOutline: {
        borderWidth: '0px',
    },
});

class QRCodeScanner extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            qrcode: "",
            result: {}
        }
        setTimeout(() => {
            var qrcode_field = document.getElementById("qrcode_field");
            qrcode_field.focus();
          }, 200);
    }

    fetchCall = () =>{
        fetch('/api/qrcode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'qrcode': this.state.qrcode})
        })
        .then(response => response.json())
        .then(res => {
            this.setState({
                result: res,
                qrcode: ""
            });
            if(
                res['qrcode_valid']
                && res['type']==="task"
                && res['tsk_id']){
                    this.props.history.go(0);
                    this.props.history.push('/task/' + res['tsk_id']);
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
        
    }

    handleQRCodeChange = (event) => {
        this.setState({
            qrcode: event.currentTarget.value
        });
    }

    handleQRCodeKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.fetchCall();
        }
    }

    handleQRCodeClick = (event) => {
        setTimeout(() => {
            var qrcode_field = document.getElementById("qrcode_field");
            qrcode_field.focus();
          }, 200);
    }


    render(){
        const { classes } = this.props;
        return(
            <div>

                <TextField
                    value={this.state.qrcode}
                    onChange={this.handleQRCodeChange}
                    onKeyDown={this.handleQRCodeKeyDown}
                    onClick={this.handleQRCodeClick}
                    placeholder="QR-Code scannen"
                    size="small"
                    variant="outlined"
                    id="qrcode_field"
                    InputProps={{
                        style: {color:"white"},
                        startAdornment: (
                            <InputAdornment position="start" style={{cursor:"pointer"}}>
                                <CropFreeIcon />
                            </InputAdornment>
                        ),
                        classes: {
                            root: classes.cssOutlinedInput,
                            focused: classes.cssFocused,
                            notchedOutline: classes.notchedOutline,
                        },
                    }}
                ></TextField>
            </div>
        )
    }
    
}

export default withStyles(styles)(withRouter(QRCodeScanner));