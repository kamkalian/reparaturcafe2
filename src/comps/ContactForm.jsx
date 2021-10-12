import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';


export default class ContactForm extends React.Component {
    render(){
        return(
            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
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
                <Grid item lg={6} xs={12}>
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