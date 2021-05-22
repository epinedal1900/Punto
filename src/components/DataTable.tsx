/* eslint-disable react/jsx-key */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import { assign } from 'lodash';
import useRouter from '../utils/useRouter';
import GlobalFilter from './GlobalFilter';
import TablePaginationActions from './TablePaginationActions';
import LoadingTable from './LoadingTable';
import makeColumns from '../utils/makeColumns';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    width: '100%',
  },
  table: {
    minWidth: 750,
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: '1 1 100%',
  },
}));
interface MultipleDetailsPaths {
  key: string;
  [x: string]: string;
}

interface CommonProps {
  title?: string;
  detailsPath?: string;
  multipleDetailsPaths?: MultipleDetailsPaths;
  movimiento?: string;
  pSize?: 5 | 10 | 50;
}

interface EnhancedTableProps extends CommonProps {
  data: any;
  columns: any;
  ids: string[];
  primaryIds?: string[];
}

interface DataTableProps extends CommonProps {
  rawData: any;
  firstRowId?: boolean;
  loading: boolean;
  noDataText?: string;
}
const EnhancedTable = (props: EnhancedTableProps): JSX.Element => {
  const {
    title,
    data,
    columns,
    ids,
    detailsPath,
    multipleDetailsPaths,
    primaryIds,
    movimiento,
    pSize,
  } = props;
  const classes = useStyles();

  const initialState = {
    pageSize: pSize,
    sortBy: [
      {
        id: columns[0].Header,
        desc: true,
      },
    ],
  };

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    rows,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const linkToDetails = ids.length > 0;

  const { history } = useRouter();

  const handleRowClick = (_e: any, id: number) => {
    if (multipleDetailsPaths) {
      // {{ key: 'Movimiento', pago: '/pagos/clientes', venta: '/ventas' }}
      const path = multipleDetailsPaths[data[id][multipleDetailsPaths.key]];
      if (path) {
        history.push(`${path}/${ids[id]}`);
      }
    } else if (primaryIds) {
      history.push(`${detailsPath}/${primaryIds[id]}/${movimiento}/${ids[id]}`);
    } else {
      history.push(`${detailsPath}/${encodeURI(ids[id])}`);
    }
  };

  const handleChangePage = (_e: any, newPage: number) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <Card className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.title} id="tableTitle" variant="h6">
          {title}
        </Typography>
        <GlobalFilter
          globalFilter={globalFilter}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
        />
      </Toolbar>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render('Header')}

                        <TableSortLabel
                          active={column.isSorted}
                          // react-table has a unsorted state which is not treated here
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow
                      {...row.getRowProps()}
                      hover={linkToDetails}
                      onClick={(event) =>
                        linkToDetails ? handleRowClick(event, row.index) : null
                      }
                    >
                      {row.cells.map((cell) => {
                        return (
                          <TableCell {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
      <TablePagination
        ActionsComponent={TablePaginationActions}
        component="div"
        count={rows.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        page={pageIndex}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50]}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
        }}
      />
    </Card>
  );
};

const DataTable = (props: DataTableProps): JSX.Element => {
  const {
    title,
    rawData,
    firstRowId,
    detailsPath,
    loading,
    multipleDetailsPaths,
    noDataText = 'Sin registros',
    movimiento,
    pSize = 10,
  } = props;
  const classes = useStyles();

  let ids;
  let newData;
  let columns;
  let primaryIds; // ej. idCorte/movimiento/id

  if (!loading && rawData.length !== 0) {
    const headers = Object.getOwnPropertyNames(rawData[0]).map((header) => {
      let newHeader;
      switch (header) {
        case 'articulo':
          newHeader = 'Artículo';
          break;
        case 'cantidad':
          newHeader = 'Cantidad';
          break;
        case 'precio':
          newHeader = 'Precio';
          break;
        case 'Direccion':
          newHeader = 'Dirección';
          break;
        case 'Telefono':
          newHeader = 'Teléfono';
          break;
        default:
          newHeader = header;
          break;
      }
      return newHeader;
    });
    let data;
    if (firstRowId) {
      data = rawData;
      ids = rawData.map((obj: any) => obj[headers[0]]);
    } else if (headers[0] === '_id') {
      if (headers[1] === '_idCorte') {
        data = rawData.map(
          // @ts-expect-error: data separation
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ({ _id, _idCorte, ...rest }) => rest
        );
        headers.shift();
        headers.shift();
        ids = rawData.map((obj: any) => obj._id);
        primaryIds = rawData.map((obj: any) => obj._idCorte);
      } else {
        // @ts-expect-error: data separation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data = rawData.map(({ _id, ...rest }) => rest);
        headers.shift();
        ids = rawData.map((obj: any) => obj._id);
      }
    } else {
      data = rawData;
      ids = [];
    }
    newData = data.map((row: any) => {
      const { cantidad, precio, articulo, Direccion, Telefono, ...rest } = row;
      const newRow = rest;
      if (cantidad !== undefined) {
        assign(newRow, { Cantidad: cantidad });
      }
      if (precio !== undefined) {
        assign(newRow, { Precio: precio });
      }
      if (articulo !== undefined) {
        assign(newRow, { Artículo: articulo });
      }
      if (Telefono !== undefined) {
        assign(newRow, { Teléfono: Telefono });
      }
      if (Direccion !== undefined) {
        assign(newRow, { Dirección: Direccion });
      }
      return newRow;
    });
    columns = makeColumns(headers);
  }

  return (
    <div>
      {!loading ? (
        <>
          {rawData.length !== 0 ? (
            <EnhancedTable
              columns={columns}
              data={newData}
              detailsPath={detailsPath}
              ids={ids}
              movimiento={movimiento}
              multipleDetailsPaths={multipleDetailsPaths}
              primaryIds={primaryIds}
              pSize={pSize}
              title={title}
            />
          ) : (
            <Card className={classes.root}>
              <Toolbar className={classes.toolbar}>
                <Typography
                  className={classes.title}
                  id="tableTitle"
                  variant="h6"
                >
                  {title}
                </Typography>
              </Toolbar>
              <CardContent className={classes.content}>
                <Box display="flex" justifyContent="center" m={0}>
                  <Box>
                    <Typography
                      className={classes.title}
                      id="tableTitle"
                      variant="h4"
                    >
                      {noDataText}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.title} id="tableTitle" variant="h6">
              {title}
            </Typography>
          </Toolbar>
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <LoadingTable columns={5} rows={10} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataTable;
