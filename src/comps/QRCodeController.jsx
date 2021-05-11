import React from 'react';


export default class QRCodeController extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: ""
        }
    }

    fetchCall = () =>{
        var {hashToken} = this.props.match.params;
        fetch('/api/qrcode/' + hashToken, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(res => {
            this.setState({
                data: res.time
            });
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