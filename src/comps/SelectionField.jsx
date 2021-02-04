import React from 'react';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';


export default class SelectionField extends React.Component {
    render(){
        var field = (
            <Button
            id={this.props.selectionId}
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={this.props.handleOpen}
            style={{justifyContent: "flex-start"}}
            >
                {this.props.buttonLabel}
            </Button>
        );
        if(this.props.selectedName !== "") field = (
            <Chip 
            label={this.props.selectedName}
            onDelete={this.props.handleSelectedDelete.bind(this, this.props.stateName)}
            style={{fontSize:20, width:"100%", justifyContent: "flex-start", paddingLeft:5}}
            color="secondary"
            />
            );
        return field;
    }

}