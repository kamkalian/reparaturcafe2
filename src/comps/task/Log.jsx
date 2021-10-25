import React from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import MouseIcon from '@mui/icons-material/Mouse';
import CommentIcon from '@mui/icons-material/Comment';

export default class Log extends React.Component {
  render(){
      const listItems = this.props.logList.map((item, index) => (
        <ListItem style={{padding:0}}>
          <ListItemAvatar>
            <Avatar>
              {item[0] === "action" ? <MouseIcon /> : ""}
              {item[0] === "comment" ? <CommentIcon /> : ""}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item[1]} secondary={item[2] + " | " + item[3]} />
        </ListItem>
      ));
      return(
        <List style={{padding:0}}>
        {listItems}
        </List>
      )
  }
}
