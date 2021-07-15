import React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TaskIdLabel from './TaskIdLabel';


export default class MagneticSign extends React.Component {
    render(){
        return(
            
            <Grid 
                container 
                spacing={3} 
                className={this.props.printversion ? "task-sign-print" : "task-sign"}
            >
                <Grid item md={2} sm={4} xs={this.props.printversion ? 2 : 12}>
                    <TaskIdLabel 
                    taskId={this.props.taskId}
                    />
                </Grid>
                <Grid item md={10} sm={6} xs={this.props.printversion ? 8 : 12}>
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
                {this.props.printversion ? (
                    <Grid item xs={2}>
                        <div dangerouslySetInnerHTML={{__html: this.props.newQRCodeImage}} />
                    </Grid>
                ) : ""}
                
            </Grid>
        );
    }
}
