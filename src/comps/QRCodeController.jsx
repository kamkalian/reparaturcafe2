import React from 'react';
import PinRequest from './user/PinRequestDialog';


export default class QRCodeController extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            qrcode: "",
            result: {},
            pinRequest: false,
            pin: "",
        }

        setTimeout(() => {
            var qrcodePin_field = document.getElementById("qrcodePin");
            qrcodePin_field.focus();
          }, 250);
    }

    handlePinChange = (event) => {
        const pin = event.target.value;
        if(pin.length <= 4){
            this.setState({
                pin: pin
            })
        }
        if(pin.length === 4){
            this.setState({
                pin: pin,
                pinRequest: false
            }, function(){
                this.setState({
                    pin: "",
                });
                this.fetchCallWithPin();
            })
        }
    }

    handlePinAbort = (event) => {
        this.setState({
            pin: "",
            pinRequest: false,
            qrcode: ""
        });
    }

    fetchCallWithPin = () =>{
        // fetchCall mit Pin
        fetch('/api/qrcode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'qrcode': this.state.qrcode,
                'pin': this.state.pin})
        })
        .then(response => response.json())
        .then(res => {
            this.setState({
                result: res,
                qrcode: ""
            });
            if(
                res['qrcode_valid']
                && res['type']==="user"
                && res['usr_id']
            ){
                this.props.history.push("/");
            }
            this.props.history.go(0);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });      
    }

    fetchCall = () =>{
        var {token} = this.props.match.params;
        this.setState({
            qrcode: token
        });
        const regex = /(usr|tsk)([a-zA-Z0-9_-]*)/;
        if(regex.test(token)){
            if(token.match(regex)[1] === "usr"){
                this.setState({
                    pinRequest: true
                });
            }
            else{
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
                });
            }
        }
        return false;
    }

    componentDidMount(){
        this.fetchCall();
    }

    render(){
        return(
            <React.Fragment>
                <h1>QRCodeController</h1>
                {this.state.pinRequest ? (
                    <PinRequest
                    pin={this.state.pin}
                    pinRequest={this.state.pinRequest}
                    handlePinChange={this.handlePinChange}
                    handlePinAbort={this.handlePinAbort}
                    />
                ) : ""}
            </React.Fragment>

        )
    }
    
}