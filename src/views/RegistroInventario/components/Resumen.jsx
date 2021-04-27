import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import groupBy from 'lodash/groupBy';
import Divider from '@material-ui/core/Divider'


const Resumen = (props) => {
  const { regresos } = props;
  const {
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
  } = useFormikContext();

  var NoDeArticulos = values.articulos.reduce((acc, cur) => {
    return acc + cur.cantidad
  }, 0);
  const articulos = values.articulos.map(val => {
    return { articulo: val.articulo.nombre, cantidad: val.cantidad }
  });
  let obj = groupBy(articulos, 'articulo');
  const prendasAgrupadas = Object.keys(obj).map(function (key) {
    return {
      articulo: key,
      cantidad: obj[key].reduce((acc, cur) => {
        return acc + cur.cantidad
      }, 0)
    };
  });
  let hayDiscrepancias = false;
  if (regresos) {
    hayDiscrepancias = regresos.length !== prendasAgrupadas.length || regresos.some(val => {
      const p = prendasAgrupadas.find(val2 => {
        return val2.articulo === val.articulo;
      })
      return val.cantidad !== p.cantidad;
    })
  }

  return (
    <React.Fragment>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Typography variant="h5"> Resumen</Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          {hayDiscrepancias &&
            <Typography
              color="error"
              variant="subtitle1"
            >
              Hay discrepancias en los artículos registrados, se recomienda volver a revisar.
            </Typography>}
          <Typography variant="subtitle1"> {`Plaza: ${values.puntoId.nombre}`}</Typography>
          <Typography variant="subtitle1"> {`Número de artículos  : ${NoDeArticulos}`}</Typography>
          <Box m={2}>
            <Divider />
          </Box>
          {prendasAgrupadas && prendasAgrupadas.map(r => (
            <Typography variant="subtitle1"> {`${r.articulo}: ${r.cantidad}`}</Typography>
          ))
          }
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TextField
            error={touched['comentarios'] && Boolean(errors['comentarios'])}
            fullWidth
            helperText={touched['comentarios'] && errors['comentarios']}
            id="comentarios"
            label="Comentarios"
            multiline
            name="comentarios"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values['comentarios']}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Resumen