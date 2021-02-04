import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import HouseOutlinedIcon from '@material-ui/icons/HouseOutlined';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';


export default class ContactForm extends React.Component {
    render(){
        return(
            <Grid container spacing={3}>
                <Grid item xl={2} xs={12}>
                    <FormControl fullWidth={true}>
                        <InputLabel id="title-label" style={{marginLeft:15}}>Anrede</InputLabel>
                        <Select
                        variant="outlined"
                        labelId="title-label"
                        id="title"
                        value={this.props.gender}
                        onChange={this.props.handleGenderChange}
                        >
                        <MenuItem value={"w"}>Frau</MenuItem>
                        <MenuItem value={"m"}>Herr</MenuItem>
                        <MenuItem value={"?"}>?</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
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

                <Grid item xl={6} sm={8} xs={12}>
                    <TextField 
                    id="street" 
                    label="Straße" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.street}
                    onChange={this.props.handleTextInputChange}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HouseOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}/>
                </Grid>
                <Grid item xl={2} sm={4} xs={12}>
                    <TextField 
                    id="houseNumber" 
                    label="Hausnummer" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.houseNumber}
                    onChange={this.props.handleTextInputChange}/>
                </Grid>
                <Grid item xl={2} sm={6} xs={12}>
                    <TextField 
                    id="postCode" 
                    label="Postleitzahl" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.postCode}
                    onChange={this.props.handleTextInputChange}/>
                </Grid>
                <Grid item xl={2} sm={6} xs={12}>
                    <TextField 
                    id="ort" 
                    label="Ort" 
                    variant="outlined" 
                    fullWidth={true} 
                    disabled={true}/>
                </Grid>

                <Grid item xl={2} sm={4} xs={12}>
                    <TextField 
                    id="prefixNumber" 
                    label="Vorwahl" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.prefixNumber}
                    onChange={this.props.handleTextInputChange}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}/>
                </Grid>
                <Grid item xl={4} sm={8} xs={12}>
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