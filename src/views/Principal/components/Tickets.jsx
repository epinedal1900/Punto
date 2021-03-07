/* eslint-disable react/no-multi-comp */
import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Paper } from '@material-ui/core';
import makeData from './makeData';
import EnhancedTable from './EnhancedTable';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    padding: 0,
    height: 300,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`scrollable-auto-tab-${index}`}
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      role="tabpanel"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Tickets = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Cantidad',
        accessor: 'cantidad',
      },
      {
        Header: 'Artículo',
        accessor: 'articulo',
      },
      {
        Header: 'Precio',
        accessor: 'precio',
      },
    ],
    []
  );

  const [data, setData] = React.useState(
    React.useMemo(
      () => [
        {
          articulo: 'Pantalón dama basic',
          cantidad: 17,
          precio: 135,
        },
        {
          articulo: 'Falda dama basic',
          cantidad: 5,
          precio: 110,
        },
        {
          articulo: 'Short dama basic',
          cantidad: 5,
          precio: 110,
        },
        {
          articulo: 'Capri dama premium',
          cantidad: 5,
          precio: 125,
        },
      ],
      []
    )
  );

  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <CssBaseline />
      <div>
        <AppBar color="default" position="static">
          <Tabs
            indicatorColor="primary"
            onChange={handleChange}
            scrollButtons="auto"
            textColor="primary"
            value={value}
            variant="scrollable"
          >
            <Tab label="ticket 1" />
            <Tab label="ticket 2" />
          </Tabs>
        </AppBar>
        <Box height={300}>
          <EnhancedTable
            columns={columns}
            data={data}
            setData={setData}
            skipPageReset={skipPageReset}
            updateMyData={updateMyData}
          />
        </Box>
      </div>
    </div>
  );
};

export default Tickets;
