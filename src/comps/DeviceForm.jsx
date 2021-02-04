import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import SelectionDialog from './SelectionDialog';
import SelectionField from './SelectionField';
import SelectionList from './SelectionList';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Button from '@material-ui/core/Button';

const mockCategories = [
    "CD-Player", 
    "Drucker", 
    "Elektroauto", 
    "Equalizer", 
    "Kaffeemaschine", 
    "Kaffeevollautomat", 
    "Kettensäge", 
    "Küchenmaschine", 
    "Lampe", 
    "Lautsprecher", 
    "Mikrowelle", 
    "Mixer", 
    "MP3-Player", 
    "Nähmaschine", 
    "Plattenspieler", 
    "Poolpumpe", 
    "Radiorekorder", 
    "Spieluhr", 
    "Spielzeug", 
    "Stereoanlage", 
    "Toaster", 
    "Verstärker", 
    "Wasserkocher"
]

const mockManufacturers = [
    "Bosch", "Siemens", "Krups", "Phillips", "Severin", "Sony", "Pannasonic"
]

const mockAccessories = [
    "Bedienungsanleitung", "Netzteil", "Koffer", "Haube", "Stromkabel", "Neue Batterien/Akkus", "Ersatzlampe"
]


export default class DeviceForm extends React.Component {
    render(){
        return(
            <Grid container spacing={5}>
                <Grid item xl={6} sm={6} xs={12}>
                    <TextField 
                    id="devName" 
                    label="Bezeichnung" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.devName}
                    onChange={this.props.handleTextInputChange}
                    error={this.props.devNameError}/>
                </Grid>
                <Grid item xl={6} sm={6} xs={12}>
                    <TextField 
                    id="devModel" 
                    label="Modell" 
                    variant="outlined" 
                    fullWidth={true}
                    value={this.props.devModel}
                    onChange={this.props.handleTextInputChange}/>
                </Grid>
                <Grid item xl={6} sm={6} xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <SelectionField 
                            selectionId="selectFieldManufacturer"
                            handleOpen={this.props.handleOpen}
                            selectedName={this.props.manufacturerName}
                            handleSelectedDelete={this.props.handleSelectedDelete}
                            buttonLabel="+ Hersteller"
                            stateName="manufacturerName"/>
                            <SelectionDialog 
                            handleClose={this.props.handleClose}
                            selectionList={mockManufacturers}
                            handleSelectionClick={this.props.handleSelectionClick}
                            openSelection={this.props.openManufacturer}
                            selectionTitle="Hersteller auswählen"
                            stateName="manufacturerName"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectionField 
                            selectionId="selectFieldCategory"
                            handleOpen={this.props.handleOpen}
                            selectedName={this.props.categoryName}
                            handleSelectedDelete={this.props.handleSelectedDelete}
                            buttonLabel="+ Gerätekategorie"
                            stateName="categoryName"/>
                            <SelectionDialog 
                            handleClose={this.props.handleClose}
                            selectionList={mockCategories}
                            handleSelectionClick={this.props.handleSelectionClick}
                            openSelection={this.props.openCategory}
                            selectionTitle="Gerätekategorie auswählen"
                            stateName="categoryName"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                            id="addAccessories"
                            variant="contained"
                            color="primary"
                            fullWidth={true}
                            onClick={this.props.handleOpen}
                            style={{justifyContent: "flex-start"}}
                            >
                                + Zubehör
                            </Button>
                            <SelectionList 
                            listItems={this.props.accessories}
                            handleSelectedDelete={this.props.handleSelectedDelete}
                            stateName="accessories"/>
                            <SelectionDialog 
                            handleClose={this.props.handleClose}
                            selectionList={mockAccessories}
                            handleSelectionClick={this.props.handleSelectionClick}
                            openSelection={this.props.openAccessories}
                            selectionTitle="Zubehör hinzufügen"
                            stateName="accessories"
                            blockedList={this.props.accessories}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xl={6} sm={6} xs={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Wird das Gerät mit Strom aus der Steckdose(Hochvolt) oder mit einem Netzteil(Niedervolt) oder ohne Strom(Mechanisch) betrieben?</FormLabel>
                        <RadioGroup 
                        aria-label="electricalOrMechanical" 
                        name="electricalOrMechanical"
                        value={this.props.electricalMechanical}
                        onChange={this.props.handleRadioChange}>
                            <FormControlLabel value="electricalHV" control={<Radio />} label="Hochvolt (z.B. 230V)" />
                            <FormControlLabel value="electricalNV" control={<Radio />} label="Niedervolt (z.B. 12V, Akku)" />
                            <FormControlLabel value="mechanical" control={<Radio />} label="Mechanisch" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
        );
    }
}