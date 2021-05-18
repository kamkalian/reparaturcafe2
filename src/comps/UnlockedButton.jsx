import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';

export default class UnlockedButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        hover: false,
    }
  }

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

  handleLockButtonHover = () => {
    if(!this.state.hover){
      this.setState({
          hover: true
      });
    }
  }
  handleLockButtonMouseOut = () => {
    if(this.state.hover){
      this.setState({
          hover: false
      });
    }
  }

  render(){
    return(
      <IconButton
        variant="contained"
        color="primary"
        onMouseOver={this.handleLockButtonHover}
        onMouseOut={this.handleLockButtonMouseOut}
        onClick={this.handleLockButtonClick}
        style={{backgroundColor:"#ccccccaa"}}
        >
            {this.state.hover ? <LockIcon fontSize="large"/> : <LockOpenIcon fontSize="large"/>}
      </IconButton>      
    );
  }
}