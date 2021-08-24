/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useSelector } from 'react-redux';
import { assign } from 'lodash';

import useRouter from '../utils/useRouter';
import { makeColumns } from '../utils/functions';
import { AppRole } from '../types/types';
import { RootState } from '../types/store';
import LoadingTable from './LoadingTable';
import { Theme } from '../theme';

const useStyles = makeStyles((theme: Theme) => ({
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

interface CommonProps {
  title?: string;
  hasHeaderColumns?: boolean;
  hasViewMoreButton?: boolean;
  handleAddClick?: () => void;
  handleEditClick?: () => void;
  handleMoreClick?: () => void;
  handleCancelClick?: () => void;
  handleUploadClick?: () => void;
  handleEliminarClick?: () => void;
  handleSecondEditClick?: () => void;
  secondEditText?: string;
  editText?: string;
  detailsPath?: string;
  data: any;
  movimiento?: string;
  ids?: string[];
  readOnlyRoles?: AppRole[];
  cancelarText?: string;
}

interface EnhancedTableProps extends CommonProps {
  columns: any;
}

interface DetailsTableProps extends CommonProps {
  loading: boolean;
  noDataText?: string;
}

function EnhancedTable(props: EnhancedTableProps) {
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
    detailsPath,
    data,
    movimiento,
    ids,
    columns,
    readOnlyRoles = [],
    cancelarText,
  } = props;

  const classes = useStyles();
  const { history } = useRouter();
  const session = useSelector((state: RootState) => state.session);

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const handleRowClick = (_e: any, id: number) => {
    if (ids) {
      history.push(`${detailsPath}/${ids[id]}`);
    }
  };
  return (
    <Card className={classes.root} elevation={4}>
      <CardHeader title={<Typography variant="h6">{title}</Typography>} />
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
        {session.roles?.some((role) => {
          return readOnlyRoles.includes(role.role) && !role.readOnly;
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

const DetailsTable = (props: DetailsTableProps): JSX.Element => {
  const {
    title,
    hasHeaderColumns,
    hasViewMoreButton = true,
    handleAddClick,
    handleEditClick,
    handleSecondEditClick,
    handleMoreClick,
    handleCancelClick,
    handleUploadClick,
    handleEliminarClick,
    detailsPath,
    loading,
    editText = 'Editar',
    secondEditText,
    movimiento,
    data,
    ids,
    noDataText = 'sin registros',
    readOnlyRoles = [],
    cancelarText,
  } = props;
  const classes = useStyles();

  let columns;
  let newData;
  if (data && data.length !== 0) {
    const headers = Object.getOwnPropertyNames(data[0]).map((header) => {
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
        default:
          newHeader = header;
          break;
      }
      return newHeader;
    });
    newData = data.map((row: any) => {
      const { cantidad, precio, articulo, Direccion, ...rest } = row;
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
      if (typeof Direccion !== 'undefined') {
        assign(newRow, { Dirección: Direccion });
      }
      return newRow;
    });
    // alert(JSON.stringify(newData));
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
              data={newData}
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
            <Card elevation={4}>
              <CardHeader
                title={<Typography variant="h6">{title}</Typography>}
              />
              <Divider />
              <CardContent className={classes.content}>
                <Box display="flex" justifyContent="center" m={0}>
                  <Box>
                    <Typography id="tableTitle" variant="h4">
                      {noDataText}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card elevation={4}>
          <CardHeader title={<Typography variant="h6">{title}</Typography>} />
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

export default DetailsTable;
