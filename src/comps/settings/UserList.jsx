import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import EditIcon from '@material-ui/icons/Edit';
import CropFreeIcon from '@material-ui/icons/CropFree';
import Hidden from '@material-ui/core/Hidden';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SupervisedUserCircleOutlinedIcon from '@material-ui/icons/SupervisedUserCircleOutlined';


export default class UserList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userList:[]
    } 
  }

  componentDidMount(){
    this.fetchCall();
  }

  fetchCall = () =>{
    fetch('/api/userlist', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(res => {
        this.setState({
            userList: res["userlist"]
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });      
  }

  render(){
    const userItemList = this.state.userList.map((item, index) => {
      return (
        <Box borderTop={1} style={{paddingTop:10}} key={index}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item md={1} xs={3}>
              {item["userRole"] === "admin" ? <SupervisedUserCircleOutlinedIcon /> : <AccountCircleOutlinedIcon />}
            </Grid>
            <Grid item md={3} xs={6}>
              {item["userName"]}
            </Grid>
            <Hidden smDown>
              <Grid item md={4} xs={12}>
                {item["userEmail"]}
              </Grid>
            </Hidden>
            <Grid item md={4} xs={12}>
              <ButtonGroup fullWidth>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<CropFreeIcon />}
                  >
                      QR-Codes
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={this.props.handleUserOpen.bind(this, item["userName"], item["userEmail"], item["userRole"])}
                  >
                      Bearbeiten
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Box>
      );
    });
    return(
      <Box style={{paddingTop:10}}>
        {userItemList}
      </Box>
    );
  }
}