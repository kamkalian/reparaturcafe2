import React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TaskIdLabel from './TaskIdLabel';


export default class MagneticSign extends React.Component {
    render(){
        return(
            <Grid container spacing={3}>
                <Grid item >
                    <TaskIdLabel 
                    taskId={this.props.taskId}
                    />
                </Grid>
                <Grid item >
                    <Typography variant="h5">
                        {this.props.deviceName}
                    </Typography>
                    {this.props.deviceManufacturer ? (
                        <Chip 
                        label={this.props.deviceManufacturer}
                        color="secondary"
                        />
                    ) : ""}
                    {this.props.deviceCategory ? (
                        <Chip 
                        label={this.props.deviceCategory}
                        color="secondary"
                        />
                    ) : ""}      
                </Grid>
            </Grid>
        );
    }
}