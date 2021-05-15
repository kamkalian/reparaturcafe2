import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function NewUserForm() {

    return(
      <Box>
        <h2>Neuen User anlegen</h2>
        <Grid container spacing={3}>
            <Grid item xl={5} sm={6} xs={12}>
                <TextField 
                id="userName"
                label="Rufname" 
                variant="outlined" 
                fullWidth={true}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    >
                        Speichern
                    </Button>
            </Grid>
        </Grid>
      </Box>
      
    );
}