import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Phone } from '@mui/icons-material';


export default class PhoneBadge extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <IconButton
        variant="contained"
        color="primary"
        style={{backgroundColor:"#ffffffaa"}}
        >
          <Phone/>
      </IconButton>      
    );
  }
}