import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import AddCircleIcon from '@material-ui/icons/AddCircle';


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
            if(this.props.blockedList){
                for(i=0; i < this.props.blockedList.length; i++){
                    if(item === this.props.blockedList[i]){
                        blockedItem = true;
                        break;
                    }
                }
            }

            if(item.toLowerCase().indexOf(this.state.searchString.toLowerCase()) !== -1 && !blockedItem) return true;
            return false;
        }, this).map((item, index) => {
            return (
                <Chip 
                key={index}
                style={{margin:10, fontSize:20}}
                data-id={item}
                data-statename={this.props.stateName}
                color="primary" 
                onClick={this.props.handleSelectionClick}
                label={item}
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
                    label="Suche"
                    type="search"
                    fullWidth
                    value={this.state.searchString}
                    onChange={this.handleSearchChange}
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
