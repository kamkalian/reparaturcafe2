import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

export default class NewComment extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      comment: ""
    }
  }
  handleCommentChange = (event) => {
    this.setState({
      comment: event.currentTarget.value
    });
  }

  handleCommentSave = (event) => {
    fetch('/api/save_comment', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': this.props.csrfToken,
      },
      body: JSON.stringify({
        tsk_id: this.props.tsk_id,
        comment: this.state.comment
      }),
    })
    .then((response) => {
      if(response.status===200){
        response.json()
        .then(data => {
          this.props.fetchCall();
        });
        this.setState({
          comment: ""
        });
      }
    })
  }

  render(){
      return(
        <React.Fragment>
        <h3 style={{marginTop:40}}>Kommentar</h3>
        <Grid container spacing={3}>
          <Grid item xs={12}>
          <TextField
            id="filled-multiline-flexible"
            label="Schreibe einen Kommentar"
            multiline
            maxRows={10}
            variant="outlined" 
            fullWidth={true}
            value={this.state.comment}
            onChange={this.handleCommentChange}
          />
          </Grid>
          <Grid item xs={12}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                fullWidth
                onClick={this.handleCommentSave}
                >
                  Speichern
              </Button>   
          </Grid>
        </Grid>
        </React.Fragment>
      )
  }
}
