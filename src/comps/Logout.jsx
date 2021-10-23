import React from 'react';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';


export default class Logout extends React.Component {

    handleLogout = () => {
        console.log("logout")
        fetch('/api/logout', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': this.props.csrfToken,
          }
        })
        .then((response) => {
          if(response.status===200){
            window.location.href = "/";
          }
        })
    }

    render(){
        return (
            <Button 
                color="inherit"
                startIcon={<PowerSettingsNewIcon />}
                onClick={this.handleLogout}>
                <Hidden lgDown>
                Ausloggen
                </Hidden>
            </Button>
            
        );
    }

}