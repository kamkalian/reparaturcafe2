import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import UserList from './UserList';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import UserDialog from '../user/UserDialog';
import { ColumnsToolbarButton } from '@material-ui/data-grid';

export default class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      openUserDialog: false,
      userDialogTitle: "",
      userDialogSaveButtonText: "",
      selectedUserID: "",
      selectedUserName: "",
      selectedUserEmail: "",
      selectedUserRole: ""
    } 
  }

  handleNewUserOpen = (event) => {
    this.setState({
      userDialogTitle: "Neuen User hinzufügen",
      userDialogSaveButtonText: "Hinzufügen",
      openUserDialog: true,
      selectedUserName: "",
      selectedUserEmail: "",
      selectedUserRole: ""
    })
  }

  handleUserOpen = (userName, userEmail, userRole, event) => {
    this.setState({
      userDialogTitle: "User bearbeiten",
      userDialogSaveButtonText: "Speichern",
      selectedUserName: userName,
      selectedUserEmail: userEmail,
      selectedUserRole: userRole,
      openUserDialog: true,
    })
  }

  handleUserClose = (event) => {
    this.setState({
      openUserDialog: false
    })
  }

  handleUserNameChange = (event) => {
    this.setState({
      selectedUserName: event.currentTarget.value
    })
  }

  handleUserEmailChange = (event) => {
    this.setState({
      selectedUserEmail: event.currentTarget.value
    })
  }

  handleUserRoleChange = (event) => {
    this.setState({
      selectedUserRole: event.target.value
    })
  }

  render(){
    return(
      <Box>
        <h2>Einstellungen</h2>
        {this.props.userRole === "admin" ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>User verwalten</h3>
              <Box textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={this.handleNewUserOpen}
                  >
                      User hinzufügen
                </Button>
                <UserDialog 
                title={this.state.userDialogTitle}
                saveButtonText={this.state.userDialogSaveButtonText}
                openUserDialog={this.state.openUserDialog}
                handleUserClose={this.handleUserClose}
                userName={this.state.selectedUserName}
                userEmail={this.state.selectedUserEmail}
                userRole={this.state.selectedUserRole}
                handleUserNameChange={this.handleUserNameChange}
                handleUserEmailChange={this.handleUserEmailChange}
                handleUserRoleChange={this.handleUserRoleChange}
                />
              </Box>
              <UserList
              handleUserOpen={this.handleUserOpen}
              />
            </Grid>
          </Grid>
        ) : (
          "Kein Zutritt!"
        )}
      </Box>
    );
  }
}