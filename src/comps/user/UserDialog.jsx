import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';


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