import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';


export default class UserDialog extends React.Component {

    render(){
        return(
            <Dialog 
            open={this.props.openUserDialog} 
            onClose={this.props.handleUserClose} 
            aria-labelledby="new-user-dialog"
            fullWidth
            >
                <DialogTitle id="new-user-dialog">{this.props.title}</DialogTitle>
                <DialogContent>
                    <TextField 
                        id="userName"
                        label="Rufname" 
                        variant="outlined" 
                        fullWidth={true}
                        value={this.props.userName}
                        onChange={this.props.handleUserNameChange}
                        style={{marginBottom:20}}
                        />
                    <TextField 
                        id="userEmail"
                        label="Email" 
                        variant="outlined" 
                        fullWidth={true}
                        value={this.props.userEmail}
                        onChange={this.props.handleUserEmailChange}
                        style={{marginBottom:20}}
                        />
                    <TextField 
                        select
                        id="userRole"
                        label="Rolle" 
                        variant="outlined" 
                        fullWidth={true}
                        value={this.props.userRole}
                        onChange={this.props.handleUserRoleChange}
                        style={{marginBottom:20}}
                        >
                        <MenuItem key="admin" value="admin">
                            Admin
                        </MenuItem>
                        <MenuItem key="user" value="user">
                            Ehrenamtlicher Reparateur
                        </MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleUserClose} color="primary" variant="contained">
                        Abbrechen
                    </Button>
                    <Button color="primary" variant="contained">
                        {this.props.saveButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}