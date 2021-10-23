import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';


export default class SelectionDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchString: ""
        }
    }

    handleSearchChange = (event) => {
        this.setState({
            searchString: event.target.value
        })
    }

    render(){
        var listItems = this.props.selectionList.filter(function(item) {
            // Prüfen ob der Eintrag eventuell blockiert ist, weil er schon ausgewählt wurde.
            var blockedItem = false;
            var i;
            const itemName = this.props.withCounts ? item["name"] : item;
            if(this.props.blockedList){
                for(i=0; i < this.props.blockedList.length; i++){
                    if(itemName === this.props.blockedList[i]){
                        blockedItem = true;
                        break;
                    }
                }
            }
            if(itemName.toLowerCase().indexOf(this.state.searchString.toLowerCase()) !== -1 && !blockedItem) return true;
            return false;
        }, this).map((item, index) => {
            const itemName = this.props.withCounts ? item["name"] : item;
            const itemCount = this.props.withCounts ? item["count"] : 0;
            return (
                <Chip 
                key={index}
                style={{margin:10, fontSize:20}}
                data-id={itemName}
                data-statename={this.props.stateName}
                color="primary" 
                onClick={this.props.handleSelectionClick}
                label={itemName + (this.props.withCounts ? ( "(" + itemCount + ")") : "")}
                icon={<AddCircleIcon />} />
                );
        });

        if(listItems.length === 0) listItems = (
            <Chip 
                key={this.state.searchString}
                style={{margin:10, fontSize:20}}
                data-id={this.state.searchString}
                data-statename={this.props.stateName}
                color="primary" 
                onClick={this.props.handleSelectionClick}
                label={this.state.searchString}
                icon={<AddCircleIcon />} />
        );

        return(
            <Dialog 
            fullWidth
            maxWidth="md"
            open={this.props.openSelection} 
            onClose={this.props.handleClose} 
            aria-labelledby="selection-dialog"
            >
                <DialogTitle id="selection-dialog">{this.props.selectionTitle}</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id={"selection" + this.props.selectionTitle}
                    label="Suche / Eingabe"
                    type="search"
                    fullWidth
                    value={this.state.searchString}
                    onChange={this.handleSearchChange}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                />
                <List component="nav" aria-label="main mailbox folders">
                    {listItems}
                </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Schließen
                    </Button>
                </DialogActions>
                
            </Dialog>
        );
    }
}
