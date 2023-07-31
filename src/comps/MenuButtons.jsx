import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import Hidden from '@mui/material/Hidden';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';



export default class MenuButtons extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const icons = this.props.list.map((item) => {
      return(
      <IconButton
        sx={{color: 'black'}}
        component={Link}
        to={item[2]}
        >
          {item[1]}
      </IconButton>
    )});

    const buttons = this.props.list.map((item) => {
      return(
      <Button
        component={Link}
        sx={{color: 'black'}}
        to={item[2]}
        startIcon={item[1]}
        >
          {item[0]}
      </Button>
    )});

    return(
      <Stack direction="row" spacing={0}>
        <Hidden lgUp>
          {icons}
        </Hidden>
        <Hidden lgDown>
          {buttons}
        </Hidden>
      </Stack>
    );
  }
}