import React from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@material-ui/core';

interface LoadingTableProps {
  rows: number;
  columns: number;
}

const LoadingTable = ({
  rows = 5,
  columns = 2,
}: LoadingTableProps): JSX.Element => {
  const arr = new Array(rows).fill(0);
  const cols = new Array(columns).fill(0);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow key={-1000}>
            {cols.map((_e: any, k) => (
              <TableCell key={-k}>
                <Skeleton />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {arr.map((_e: any, i) => (
            <TableRow key={i}>
              {cols.map((_e: any, j) => (
                <TableCell key={parseInt(i.toString() + j.toString())}>
                  <Skeleton key={1} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoadingTable;
