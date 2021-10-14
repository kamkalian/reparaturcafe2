import React from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TaskIdLabel from './TaskIdLabel';
import Divider from '@mui/material/Divider';


export default class MagneticSign extends React.Component {
    render(){
        return(
            
            <Grid 
                container 
                spacing={3} 
                className={this.props.printversion ? "task-sign-print" : "task-sign"}
            >
                <Grid item md={4} sm={4} xs={this.props.printversion ? 2 : 12} style={{paddingTop:10}}>
                    <TaskIdLabel 
                    taskId={this.props.taskId}
                    />
                </Grid>
                <Grid item md={8} sm={6} xs={this.props.printversion ? 7 : 12} style={{paddingTop:10}}>
                    <Typography variant="h5" style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                        {this.props.deviceName}
                    </Typography>
                    <Divider style={{marginTop:10, marginBottom:10}}/>
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
                    <Grid item xs={3}>
                        <div dangerouslySetInnerHTML={{__html: this.props.newQRCodeImage}} />
                    </Grid>
                ) : ""}
                
            </Grid>
        );
    }
}
