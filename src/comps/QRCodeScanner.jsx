import React from 'react';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';


export default class QRCodeScanner extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            qrcode: ""
        }
    }

    fetchCall = () =>{
        fetch('/api/qrcode/' + this.state.qrcode, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(res => {
            this.setState({
                taskData: res.task_data
            });
        });
        return false;
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

    render(){
        return(
            <div>
            <TextField
                value={this.state.qrcode}
                onChange={this.handleQRCodeChange}
                onKeyDown={this.handleQRCodeKeyDown}
                autoFocus
                fullWidth
            ></TextField>
            {!this.state.result["action"] ? (
                <Alert severity="info">
                Scanne einen gültigen QR-Code!
                </Alert>
            ) : ""}
            </div>
        )
    }
    
}