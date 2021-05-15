import React from 'react';


export default class QRCodeController extends React.Component{

    fetchCall = () =>{
        var {hashToken} = this.props.match.params;
        fetch('/api/qrcode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'qrcode': hashToken})
        })
        .then(response => response.json())
        .then(res => {
            if(
                res['qrcode_valid']
                && res['type']==="task"
                && res['tsk_id']){
                    console.log(res['tsk_id']);
                    this.props.history.push('/task/' + res['tsk_id']);
            }
        });
        return false;
    }

    componentDidMount(){
        this.fetchCall();
    }

    render(){
        return(
            <h1>{this.state.data}</h1>
        )
    }
    
}