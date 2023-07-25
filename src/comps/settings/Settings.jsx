import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import UserList from './UserList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UserDialog from '../user/UserDialog';


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
      selectedUserRole: "",
      adminLogoutTimer: 0,
      logo: "",
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
    console.log("settings", this.props.csrfToken)
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
              csrfToken={this.props.csrfToken}
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