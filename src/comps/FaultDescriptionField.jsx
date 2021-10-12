import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export default class FaultDescriptionField extends React.Component {
    render(){
        return(
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <TextField 
                    id="faultDescription" 
                    label="Fehlerbeschreibung" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.faultDescription}
                    onChange={this.props.handleTextInputChange}
                    multiline
                    rows={8}
                    error={this.props.faultDescriptionError}
                    helperText="Bitte mindestens 50 Zeichen eingeben."/>
                </Grid>                
            </Grid>
        );
    }
}