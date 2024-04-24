import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

// This returns a list of events for a given day
const EventList = (props) => {
    if (!props.items){
        return
    }
    const items = props.items

    const rows = items.map((item) => {
        return (
            <TableRow
              key={item.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="right">{item.description}</TableCell>
              <TableCell align="right">{item.creator}</TableCell>
              <TableCell align="right">{item.participants}</TableCell>
              <TableCell align='right'>
                <Button variant="contained" onClick={() => props.handleJoin(item)}>Join</Button>
              </TableCell>
            </TableRow>
        )
})
    return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Creator</TableCell>
            <TableCell align="right">participants</TableCell>
            <TableCell align="right">Join</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {rows}
        </TableBody>
      </Table>
    </TableContainer>
    )
}


export default EventList