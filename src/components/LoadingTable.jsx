import React from 'react';
import PropTypes from 'prop-types';

import Skeleton from '@material-ui/lab/Skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@material-ui/core';

const LoadingTable = ({ rows, columns }) => {
  const arr = new Array(rows).fill(0);
  const cols = new Array(columns).fill(0);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow key={-1000}>
            {cols.map((title, k) => (
              <TableCell key={-k}>
                <Skeleton />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {arr.map((e, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={i}>
              {cols.map((col, j) => (
                // eslint-disable-next-line radix
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

LoadingTable.prototype = {
  rows: PropTypes.number.isRequired,
};

export default LoadingTable;
