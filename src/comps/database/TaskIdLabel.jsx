import React from 'react';


export default class TaskIdLabel extends React.Component {
    render(){
        return(
            <div className="task-sign-id">
                {this.props.taskId}
            </div>
        );
    }
}
