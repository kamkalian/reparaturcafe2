import React from 'react';
import Typography from '@material-ui/core/Typography';


export default class TaskIdLabel extends React.Component {
    render(){
        return(
            <div className="task-sign-id">
                {this.props.taskId}
            </div>
        );
    }
}