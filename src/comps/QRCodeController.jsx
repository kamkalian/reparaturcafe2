import React from 'react';


export default class QRCodeController extends React.Component{

    fetchCall = () =>{
        var {token} = this.props.match.params;
        fetch('/api/qrcode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'qrcode': token})
        })
        .then(response => response.json())
        .then(res => {
            if(
                res['qrcode_valid']
                && res['type']==="task"
                && res['tsk_id']){
                    var newTaskIndicator = "";
                    if(this.props.location.search === "?new=1") newTaskIndicator = this.props.location.search;
                    this.props.history.push('/task/' + res['tsk_id']+newTaskIndicator);
            }
            if(
                res['qrcode_valid']
                && res['type']==="user"
                && res['usr_id']
            ){
                this.props.history.go(0);
            }
        });
        return false;
    }

    componentDidMount(){
        this.fetchCall();
    }

    render(){
        return(
            <h1>QRCodeController</h1>
        )
    }
    
}