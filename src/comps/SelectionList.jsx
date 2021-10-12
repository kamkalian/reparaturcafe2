import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ListItemIcon from '@mui/material/ListItemIcon';


export default class SelectionList extends React.Component {
    render(){
        const listItems = this.props.listItems.map((item, index) => {
            return (
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                  </ListItemIcon>
                    <ListItemText primary={item} />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon 
                            onClick={this.props.handleSelectedDelete.bind(this, this.props.stateName)}
                            data-id={item}/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        });
        return (
            <List >
                {listItems}
            </List>
        );
    }

}