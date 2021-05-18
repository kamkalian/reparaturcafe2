import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';

export default class LockedButton extends React.Component {

  handleLockButtonClick = () => {
    fetch('/api/lock_task', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'tsk_id': this.props.taskId})
    })
    .then(response => response.json())
    .then(res => {
        this.props.fetchCall();
    });
  }

  render(){
    return(
      <IconButton
        variant="contained"
        color="primary"
        disabled={true}
        style={{backgroundColor:"#ccccccaa"}}
        >
            <LockIcon fontSize="large"/>
      </IconButton> 
    );
  }
}