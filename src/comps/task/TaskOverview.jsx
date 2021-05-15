import React from 'react';
import Box from '@material-ui/core/Box';
import Cookies from 'universal-cookie';

export default class TaskOverview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        data: "",
        writeable : false
    }
  }

  fetchCall = () =>{
      var {taskId} = this.props.match.params;
      var cookies = new Cookies();
      var csrftoken = cookies.get('csrf_access_token');
      fetch('/api/task', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrftoken
          },
          body: JSON.stringify({'task_id': taskId})
      })
      .then((response) => {
        if(response.status===200){
          response.json()
          .then(data => {
            // TODO Checks einbauen, um den das Editieren festzulegen
            // nur Statuscode reicht nicht aus.
            this.setState({
              data: data,
              writeable: true
            });
          });          
        }else{
          console.log('Schreibgeschützt');
        }
      })
  }

  componentDidMount(){
      this.fetchCall();
  }

  render(){
      return(
          <div>
          <h1>{this.state.data['task_id']}</h1>
          {this.state.writeable ? 'true' : 'false'}
          </div>
      )
  }
}
