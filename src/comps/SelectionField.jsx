import React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';


export default class SelectionField extends React.Component {
    render(){
        var field = (
            <Button
            id={this.props.selectionId}
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={this.props.handleOpen}
            style={{minHeight:"50px", justifyContent: "flex-start"}}
            startIcon={this.props.startIcon}
            >
                {this.props.buttonLabel}
            </Button>
        );
        if(this.props.selectedName !== "") field = (
            <Chip 
            label={this.props.selectedName}
            onDelete={this.props.handleSelectedDelete.bind(this, this.props.stateName)}
            style={{minHeight:"50px", fontSize:"20px", width:"100%", justifyContent: "flex-start", paddingLeft:5}}
            color="secondary"
            />
            );
        return field;
    }

}