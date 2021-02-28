import React from 'react';
import Typography from '@material-ui/core/Typography';


export default class TaskIdLabel extends React.Component {
    render(){
        return(
            <div className="task-sign-id">
                <Typography variant="h4">
                    {this.props.taskId}
                </Typography>
            </div>
        );
    }
}