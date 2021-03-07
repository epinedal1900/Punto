/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useFormikContext, FieldArray } from 'formik';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ClearIcon from '@material-ui/icons/Clear';
import { useSelector } from 'react-redux';

import { NumberFieldArray, AutocompleteFieldArray } from '../components';
// import { setEliminarPedido } from '../actions';

const useStyles = makeStyles((theme) => ({
  divider: {
    background: theme.palette.secondary.light,
  },
}));

const Articulos = (props) => {
  const { opcionesArticulos, incluirPrecio } = props;
  const { values, errors, setFieldValue } = useFormikContext();
  // const [seEliminaraPedido, setSeEliminaraPedido] = useState(true);
  const classes = useStyles();
  const session = useSelector((state) => state.session);
  const matches = useMediaQuery('(min-width:600px)');
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (session.articulos && !session.pedidoConVentas) {
  //     if (session.articulos.length !== values.articulos.length) {
  //       dispatch(setEliminarPedido(true))
  //     }
  //     else if (session.articulos.some((sessionArr, i) => {
  //       return values.articulos[i].cantidad > sessionArr.cantidad || sessionArr.articulo !== values.articulos[i].articulo
  //     })) {
  //       dispatch(setEliminarPedido(true))
  //     }
  //     else if (session.articulos.every((sessionArr, i) => {
  //       return sessionArr.cantidad === values.articulos[i].cantidad
  //     })) {
  //       dispatch(setEliminarPedido(true))
  //     }
  //     else {
  //       dispatch(setEliminarPedido(false))
  //     }
  //   }
  // }, [values.articulos])

  return (
    <>
      <Typography variant="h5">Artículos</Typography>
      {session.eliminarPedido && (
        <Typography color="secondary" variant="h5">
          se eliminará el pedido al registrar la venta
        </Typography>
      )}
      <FieldArray
        name="articulos"
        render={(arrayHelpers) => (
          <div>
            <Box display="flex" flexDirection="row-reverse" mb={1} mr={2}>
              <Button
                aria-label="add"
                color="secondary"
                disabled={values.articulos.length >= 15}
                onClick={() =>
                  arrayHelpers.insert(
                    0,
                    incluirPrecio
                      ? JSON.parse(
                          JSON.stringify({
                            articulo: '',
                            cantidad: 0,
                            precio: 0,
                          })
                        )
                      : JSON.parse(
                          JSON.stringify({ articulo: '', cantidad: 0 })
                        )
                  )
                }
                size="small"
                variant="outlined"
              >
                añadir
              </Button>
            </Box>
            {values.articulos.map((detalle, index) => (
              <Box key={index} mb={1}>
                <Grid
                  alignItems="center"
                  container
                  justify="space-between"
                  spacing={1}
                >
                  <Grid item sm={2} xs={5}>
                    <NumberFieldArray
                      index={index}
                      label="Cantidad"
                      property="cantidad"
                      valueName="articulos"
                    />
                  </Grid>
                  <Grid
                    item
                    sm={incluirPrecio ? 7 : 9}
                    xs={incluirPrecio ? 12 : 10}
                  >
                    <AutocompleteFieldArray
                      articulos
                      freeSolo
                      getOptionLabel={(option) => {
                        if (option) {
                          if (typeof option === 'object' && option !== null) {
                            return `${option.codigo}: ${option.nombre}`;
                          }
                          return option.split(':')[1] || option;
                        }
                        return '';
                      }}
                      handleChange={
                        incluirPrecio
                          ? (value) => {
                              if (typeof value === 'object' && value !== null) {
                                setFieldValue(
                                  `articulos.${index}.precio`,
                                  value.precio,
                                  false
                                );
                              }
                            }
                          : null
                      }
                      index={index}
                      label="Artículo"
                      options={opcionesArticulos}
                      property="articulo"
                      valueName="articulos"
                    />
                  </Grid>
                  {incluirPrecio && (
                    <Grid item sm={2} xs={5}>
                      <NumberFieldArray
                        index={index}
                        label="Precio"
                        moneyFormat
                        property="precio"
                        valueName="articulos"
                      />
                    </Grid>
                  )}
                  <Grid item sm={1} xs={2}>
                    <IconButton
                      aria-label="delete"
                      color="default"
                      disabled={values.articulos.length <= 1}
                      onClick={() => arrayHelpers.remove(index)}
                      size="medium"
                    >
                      <ClearIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                {!matches && <Divider classes={{ root: classes.divider }} />}
              </Box>
            ))}
            {errors.articulos === 'Ingrese al menos 1 artículo' && (
              <Typography color="error" variant="h6">
                {errors.articulos}
              </Typography>
            )}
            {/* <h2>{JSON.stringify(values.articulos)}</h2>
            <h2>{JSON.stringify(session.articulos)}</h2> */}
          </div>
        )}
      />
    </>
  );
};

Articulos.defaultProps = {
  incluirPrecio: true,
};

export default Articulos;
