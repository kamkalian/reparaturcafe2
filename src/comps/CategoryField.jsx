import React from 'react';
import Button from '@mui/materialButton';
import Chip from '@mui/material/Chip';


export default class CategoryField extends React.Component {
    render(){
        var field = (
            <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={this.props.handleOpen}
            >
                + Gerätekategorie
            </Button>
        );
        if(this.props.categoryName !== "") field = (
            <Chip 
            label={this.props.categoryName}
            onDelete={this.props.handleCategoryDelete}
            style={{margin:10, fontSize:20}}
            />
            );
        return field;
    }

}