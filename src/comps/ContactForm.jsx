import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';


export default class ContactForm extends React.Component {
    render(){
        return(
            <Grid container spacing={3}>
                <Grid item xl={5} sm={6} xs={12}>
                    <TextField 
                    id="firstName" 
                    label="Vorname" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.firstName}
                    onChange={this.props.handleTextInputChange}
                    error={this.props.nameError}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}/>
                </Grid>
                <Grid item xl={5} sm={6} xs={12}>
                    <TextField 
                    id="lastName" 
                    label="Nachname" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.lastName}
                    onChange={this.props.handleTextInputChange}
                    error={this.props.nameError}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}/>
                </Grid>
                
                <Grid item lg={6} xs={12}>
                    <TextField 
                    id="phone" 
                    label="Telefonnummer" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.phone}
                    onChange={this.props.handleTextInputChange}
                    error={this.props.telEmailError}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}/>
                </Grid>
                <Grid item xl={6} sm={12} xs={12}>
                    <TextField 
                    id="email" 
                    label="E-Mail" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.email}
                    onChange={this.props.handleTextInputChange}
                    error={this.props.telEmailError}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}/>
                </Grid>
            </Grid>
        );
    }
}