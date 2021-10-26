import React from 'react';
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
        <ListItem style={{padding:0, alignItems:"flex-start"}} key={index}>
          <ListItemAvatar style={{marginTop:6}}>
            <Avatar style={{backgroundColor:"#eee"}}>
              {item[0] === "action" ? <MouseIcon color="secondary"/> : ""}
              {item[0] === "comment" ? <CommentIcon color="info"/> : ""}
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={item[1]}
            primaryTypographyProps={{whiteSpace:"pre-line"}, item[0] === "action" ? {color:"secondary"} : null}
            secondary={item[2] + " | " + item[3]} 
            style={item[0] === "comment" ? {borderLeft:"5px solid #ddd", paddingLeft:10} : null}
            />
        </ListItem>
      ));
      return(
        <List style={{padding:0}}>
        {listItems}
        </List>
      )
  }
}
