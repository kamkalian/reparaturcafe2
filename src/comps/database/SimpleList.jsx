import React from 'react';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default class SimpleList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      taskList: []
    }
  }

  fetchTaskList = () => {
    fetch('/api/simple_list', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        taskList: data['task_list']
        })
    });
  }

  componentDidMount() {
    this.fetchTaskList();
  }




  render() {
    const taskList = this.state.taskList.map((item, index) => {
      return(

        <TableRow
          key={item.id}
          sx={{ 'td, th': { border: 2 } }}
        >
          <TableCell component="th" scope="row"  width="5%" size='small'>
            {item.id}
          </TableCell>
          <TableCell width="20%" size='small'>{item.deviceName}</TableCell>
          <TableCell width="15%" size='small'>{item.creationDate}</TableCell>
          <TableCell width="15%" size='small'></TableCell>
          <TableCell width="15%" size='small'></TableCell>
          <TableCell width="15%" size='small'></TableCell>
          <TableCell width="15%" size='small'></TableCell>
        </TableRow>
      );
    });
    
    return(
      <React.Fragment>
        <h2>Simple list</h2>
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ 'td, th': { border: 2 } }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Bezeichnung</TableCell>
                  <TableCell>Erstelldatum</TableCell>
                  <TableCell>Schrank</TableCell>
                  <TableCell>Fach</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Info</TableCell>
                </TableRow>
              </TableHead>
                <TableBody>
                  {taskList}
                </TableBody>
              </Table>
            </TableContainer>
            </Grid>


          </Grid>
      </React.Fragment>
    );
  }
  
}
