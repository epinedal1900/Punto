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

import { ArticuloOption } from '../types/types';
import { NumberFieldArray, AutocompleteFieldArray } from '../components';

const useStyles = makeStyles((theme) => ({
  divider: {
    background: theme.palette.secondary.light,
  },
}));

interface ArticulosProps {
  opcionesArticulos: ArticuloOption[];
  incluirPrecio?: boolean;
  maxRows?: number;
  allowNegative?: boolean;
  descripcion?: string;
}
const Articulos = (props: ArticulosProps): JSX.Element => {
  const {
    opcionesArticulos,
    incluirPrecio = true,
    maxRows = 15,
    allowNegative,
    descripcion,
  } = props;
  const { values, setFieldValue } = useFormikContext<any>();
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <>
      <Typography variant="subtitle1">Artículos</Typography>
      {descripcion && (
        <Typography variant="subtitle1">{descripcion}</Typography>
      )}
      <FieldArray
        name="articulos"
        render={(arrayHelpers) => (
          <div>
            <Box display="flex" flexDirection="row-reverse" mb={1} mr={2}>
              <Button
                aria-label="add"
                color="primary"
                disabled={values.articulos.length >= maxRows}
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
            {values.articulos.map((_d: any, index: number) => (
              <Box key={index} mb={1}>
                <Grid
                  alignItems="center"
                  container
                  justify="space-between"
                  spacing={1}
                >
                  <Grid item sm={2} xs={5}>
                    <NumberFieldArray
                      allowNegative={allowNegative}
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
                          : undefined
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
            {/* <h2>{JSON.stringify(values.articulos)}</h2>
            <h2>{JSON.stringify(session.articulos)}</h2> */}
          </div>
        )}
      />
    </>
  );
};

export default Articulos;
