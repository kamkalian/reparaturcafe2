import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


export default class PinRequestDialog extends React.Component {
    render(){
        return(
            <Dialog 
            open={this.props.pinRequest} 
            >
                <DialogTitle id="pin-request">Pin eingeben</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="qrcodePin"
                    label="Pin"
                    type="password"
                    fullWidth
                    value={this.props.pin}
                    onChange={this.props.handlePinChange}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handlePinAbort} color="primary">
                        Abbrechen
                    </Button>
                </DialogActions>
                
            </Dialog>
        );
    }
}
