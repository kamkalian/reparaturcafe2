import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';


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