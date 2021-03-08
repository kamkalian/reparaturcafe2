import React from 'react';


export default class FetchTask extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            taskData: {}
        }
    }

    fetchCall = () =>{
        var {id, token} = this.props.match.params;
        fetch('/api/task/' + id + '/' + token, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(res => {
            this.setState({
                taskData: res.task_data
            });
        });
        return false;
    }

    componentDidMount(){
        this.fetchCall();
    }

    render(){
        return(
            <h1>{this.state.taskData['devName']}</h1>
        )
    }
    
}