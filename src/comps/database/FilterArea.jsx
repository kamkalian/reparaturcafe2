import React from 'react';
import Grid from '@mui/material/Grid';
import SelectionField from '../SelectionField';
import SelectionDialog from '../SelectionDialog';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';


export default class FilterArea extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          filterText: "",
        }
    }

    handleFilterTextChange = (event) => {
        this.setState({
          filterText: event.currentTarget.value,
          });
    }
    
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
                        value={this.state.filterText}
                        onChange={this.handleFilterTextChange}
                        onKeyDown={this.props.handleFilterTextEnter.bind(this, this.state.filterText)}
                        id="standard-basic"
                        label={this.props.label ? this.props.label : "ID / Bezeichnung"}
                        fullWidth
                        InputProps={{type: 'search' }}/>
                </Grid>
            </Grid>
        );
    }
}
