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


export default class CategoryDialog extends React.Component {
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
        const listItems = this.props.categoryList.map((category) => {
            var btn = "";
            if(category.toLowerCase().indexOf(this.state.searchString.toLowerCase()) !== -1) {
                btn = (
                <Chip 
                style={{margin:10, fontSize:20}}
                data-id={category}
                color="primary" 
                fullWidth={true}
                onClick={this.props.handleCategoryClick}
                label={category}
                icon={<AddCircleIcon />} />
                );
            }
            return btn;
        });

        return(
            <Dialog 
            open={this.props.openCategory} 
            onClose={this.props.handleClose} 
            aria-labelledby="category-dialog"
            >
                <DialogTitle id="category-dialog">Gerätekategorie auswählen</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="categoryName"
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
                        Abbrechen
                    </Button>
                </DialogActions>
                
            </Dialog>
        );
    }
}
