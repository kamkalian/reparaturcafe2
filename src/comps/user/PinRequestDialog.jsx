import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export default class PinRequestDialog extends React.Component {
    render(){
        return(
            <Dialog 
            open={this.props.pinRequest} 
            sx={{"& .MuiDialog-container": {
                alignItems: "flex-start"
            }}}
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
