import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number,
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    '16 Dec, 2023',
    'Elvis Presley Aadhaar',
    'Folder',
    '2',
    3.44,
  ),
  createData(
    1,
    '16 Dec, 2023',
    'Paul McCartney PAN',
    'PDF',
    '2',
    8.99,
  ),
  createData(2, '16 Dec, 2023', 'Tom Scholz Marksheet', 'JPG', '2', 1.81),
  createData(
    3,
    '16 Dec, 2023',
    'Michael Jackson AADHAAR',
    'PDF',
    '2',
    6.39,
  ),
  createData(
    4,
    '15 Dec, 2023',
    'Bruce Springsteen PAN',
    'PDF',
    '2',
    22.79,
  ),
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Orders() {
  return (
    <React.Fragment>
      <Title>Recent Jobs</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Doc Type</TableCell>
            <TableCell>Total Pages</TableCell>
            <TableCell align="right">Total Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{`${row.amount} MB`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}