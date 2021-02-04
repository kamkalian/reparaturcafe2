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
