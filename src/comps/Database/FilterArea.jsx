import React from 'react';
import Grid from '@material-ui/core/Grid';
import SelectionField from '../SelectionField';
import SelectionDialog from '../SelectionDialog';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';


export default class FilterArea extends React.Component {
    render(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6} lg={4}>
                    <SelectionField 
                    selectionId="selectFieldCategory"
                    handleOpen={this.props.handleOpen}
                    selectedName={this.props.filterCategory}
                    handleSelectedDelete={this.props.handleSelectedDelete}
                    buttonLabel="Gerätekategorie"
                    stateName="filterCategory"
                    startIcon={<FilterListIcon />}/>
                    <SelectionDialog 
                    handleClose={this.props.handleClose}
                    selectionList={this.props.categories}
                    handleSelectionClick={this.props.handleSelectionClick}
                    openSelection={this.props.openCategory}
                    selectionTitle="Gerätekategorie auswählen"
                    stateName="filterCategory"
                    withCounts
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                <SelectionField 
                    selectionId="selectFieldManufacturer"
                    handleOpen={this.props.handleOpen}
                    selectedName={this.props.filterManufacturer}
                    handleSelectedDelete={this.props.handleSelectedDelete}
                    buttonLabel="Hersteller"
                    stateName="filterManufacturer"
                    startIcon={<FilterListIcon />}/>
                    <SelectionDialog 
                    handleClose={this.props.handleClose}
                    selectionList={this.props.manufacturers}
                    handleSelectionClick={this.props.handleSelectionClick}
                    openSelection={this.props.openManufacturer}
                    selectionTitle="Hersteller auswählen"
                    stateName="filterManufacturer"
                    withCounts
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <TextField
                        value={this.props.filterText}
                        onChange={this.props.handleFilterTextChange}
                        id="standard-basic"
                        label="ID / Bezeichnung"
                        fullWidth
                        InputProps={{type: 'search' }}/>
                </Grid>
            </Grid>
        );
    }
}