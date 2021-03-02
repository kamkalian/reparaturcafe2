import React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TaskIdLabel from './TaskIdLabel';
import SelectionField from '../SelectionField';
import SelectionDialog from '../SelectionDialog';


export default class FilterArea extends React.Component {
    render(){
        return(
            <React.Fragment>
            <SelectionField 
            selectionId="selectFieldCategory"
            handleOpen={this.props.handleOpen}
            selectedName={this.props.filterCategory}
            handleSelectedDelete={this.props.handleSelectedDelete}
            buttonLabel="+ Gerätekategorie"
            stateName="filterCategory"/>
            <SelectionDialog 
            handleClose={this.props.handleClose}
            selectionList={this.props.categories}
            handleSelectionClick={this.props.handleSelectionClick}
            openSelection={this.props.openCategory}
            selectionTitle="Gerätekategorie auswählen"
            stateName="filterCategory"
            />
            </React.Fragment>
        );
    }
}