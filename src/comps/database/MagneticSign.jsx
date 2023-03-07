import React from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TaskIdLabel from './TaskIdLabel';
import Divider from '@mui/material/Divider';
import PhoneBadge from '../PhoneBadge';
import Badge from '@mui/material/Badge';


export default class MagneticSign extends React.Component {
    render(){
        return(
            
            <Grid 
                container 
                spacing={3} 
                className={this.props.printversion ? "task-sign-print" : "task-sign"}
            >
                <Grid item md={4} sm={4} xs={this.props.printversion ? 1 : 12} style={{paddingTop:10}}>
                    <TaskIdLabel 
                    taskId={this.props.taskId}
                    />
                </Grid>
                <Grid item md={6} sm={6} xs={this.props.printversion ? 6 : 12} style={{paddingTop:10}}>
                    <Badge 
                    style={{width:"100%"}}
                    badgeContent={this.props.nextStep && this.props.nextStep === 'call_owner' ? (<PhoneBadge />) : ""}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                    }}
                    >
                    <Typography variant="h5" style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                        {this.props.deviceName}
                    </Typography>
                    </Badge>
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
                    {this.props.deviceType}    
                </Grid>
                {this.props.printversion ? (
                    <Grid item xs={2} textAlign={"right"}>
                        <img src={this.props.newQRCodeImage} width={"100px"}/>
                    </Grid>
                ) : ""}
                
            </Grid>
        );
    }
}
