/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import { useTable } from 'react-table';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import makeColumns from '../utils/makeColumns';
import LoadingTable from './LoadingTable';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    width: '100%',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    '& > * + *': {
      marginLeft: 0,
    },
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
}));

function EnhancedTable(props) {
  const {
    title,
    hasHeaderColumns,
    hasViewMoreButton,
    handleAddClick,
    handleEditClick,
    handleMoreClick,
    handleCancelClick,
    handleUploadClick,
    handleEliminarClick,
    secondEditText,
    handleSecondEditClick,
    editText,
    cancelarText,
    detailsPath,
    data,
    movimiento,
    ids,
    columns,
    readOnlyRoles,
  } = props;

  const classes = useStyles();
  const history = useHistory();
  const session = useSelector((state) => state.session);

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const handleRowClick = (e, id) => {
    history.push(`${detailsPath}/${ids[id]}`);
  };
  return (
    <Card className={classes.root}>
      <CardHeader title={title} />
      <Divider />
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <TableContainer>
            <Table {...getTableProps()}>
              {hasHeaderColumns && (
                <TableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <TableCell {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
              )}
              <TableBody>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow
                      {...row.getRowProps()}
                      hover={Boolean(ids)}
                      onClick={(event) =>
                        ids ? handleRowClick(event, row.index) : null
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
      <CardActions className={classes.actions} disableSpacing>
        {JSON.parse(session.roles).some((role) => {
          return readOnlyRoles.includes(role.role) && role.readOnly === 'false';
        }) && (
          <>
            {handleEditClick && (
              <Button onClick={handleEditClick} size="small">
                <EditOutlinedIcon className={classes.buttonIcon} />
                {editText}
              </Button>
            )}
            {handleSecondEditClick && (
              <Button onClick={handleSecondEditClick} size="small">
                <EditOutlinedIcon className={classes.buttonIcon} />
                {secondEditText}
              </Button>
            )}
            {handleAddClick && (
              <Button onClick={handleAddClick} size="small">
                <AddCircleOutlineOutlinedIcon className={classes.buttonIcon} />
                Añadir
              </Button>
            )}
            {handleCancelClick && (
              <Button onClick={handleCancelClick} size="small">
                <ClearIcon className={classes.buttonIcon} />
                {cancelarText || `Cancelar ${movimiento}`}
              </Button>
            )}
            {handleEliminarClick && (
              <Button onClick={handleEliminarClick} size="small">
                <DeleteForeverIcon className={classes.buttonIcon} />
                {`Eliminar ${movimiento}`}
              </Button>
            )}
            {handleUploadClick && (
              <Button onClick={handleUploadClick} size="small">
                <CloudUploadOutlinedIcon className={classes.buttonIcon} />
                Subir comprobante de envío
              </Button>
            )}
          </>
        )}
        {handleMoreClick && hasViewMoreButton && (
          <Button onClick={handleMoreClick} size="small">
            <ArrowForwardIcon className={classes.buttonIcon} />
            Ver más
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

const DetailsTable = (props) => {
  const {
    title,
    hasHeaderColumns,
    hasViewMoreButton,
    handleAddClick,
    handleEditClick,
    handleSecondEditClick,
    handleMoreClick,
    handleCancelClick,
    handleUploadClick,
    handleEliminarClick,
    detailsPath,
    loading,
    editText,
    secondEditText,
    cancelarText,
    movimiento,
    data,
    ids,
    noDataText,
    readOnlyRoles,
  } = props;
  const classes = useStyles();

  let headers;
  let columns;
  if (data && data.length !== 0) {
    headers = Object.getOwnPropertyNames(data[0]);
    columns = makeColumns(headers);
  }

  // const [headers, setHeaders] = useState(null)
  // const [columns, setColumns] = useState(null)
  // useEffect(() => {
  //   alert('headers changed')
  //   if (data && data.length !== 0) {
  //     setHeaders(Object.getOwnPropertyNames(data[0]));
  //     setColumns(makeColumns(headers))
  //   }
  // }, [data])

  return (
    <div>
      {!loading && data ? (
        <>
          {data.length !== 0 ? (
            <EnhancedTable
              cancelarText={cancelarText}
              columns={columns}
              data={data}
              detailsPath={detailsPath}
              editText={editText}
              handleAddClick={handleAddClick}
              handleCancelClick={handleCancelClick}
              handleEditClick={handleEditClick}
              handleEliminarClick={handleEliminarClick}
              handleMoreClick={handleMoreClick}
              handleSecondEditClick={handleSecondEditClick}
              handleUploadClick={handleUploadClick}
              hasHeaderColumns={hasHeaderColumns}
              hasViewMoreButton={hasViewMoreButton}
              ids={ids}
              movimiento={movimiento}
              readOnlyRoles={readOnlyRoles}
              secondEditText={secondEditText}
              title={title}
            />
          ) : (
            <Card>
              <CardHeader title={title} />
              <Divider />
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
        <Card>
          <CardHeader title={title} />
          <Divider />
          <CardContent className={classes.content}>
            <div className={classes.inner}>
              <LoadingTable columns={2} rows={5} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

DetailsTable.defaultProps = {
  hasViewMoreButton: true,
  editText: 'Editar',
  readOnlyRoles: [],
};

export default DetailsTable;
