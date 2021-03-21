import React from 'react';
import TextField from '@material-ui/core/TextField';


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
        
    }

    render(){
        return(
            <TextField
                value={this.state.qrcode}
                onChange
                autoFocus
                fullWidth></TextField>
        )
    }
    
}