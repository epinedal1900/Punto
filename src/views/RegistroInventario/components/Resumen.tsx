/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import groupBy from 'lodash/groupBy';
import Divider from '@material-ui/core/Divider';

const Resumen = (props) => {
  const { inventario, discrepancias, setDiscrepancias } = props;
  const { values } = useFormikContext();
  const NoDeArticulos = values.articulos.reduce((acc, cur) => {
    return acc + cur.cantidad;
  }, 0);
  const articulos = values.articulos.map((val) => {
    return { articulo: val.articulo.nombre, cantidad: val.cantidad };
  });
  const obj = groupBy(articulos, 'articulo');
  const prendasAgrupadas = Object.keys(obj).map((key) => {
    return {
      articulo: key,
      cantidad: obj[key].reduce((acc, cur) => {
        return acc + cur.cantidad;
      }, 0),
    };
  });
  useEffect(() => {
    const registrosDePrendasNoExistentes = [];
    const prendasEnComun = [];
    const prendasQueNoSeRegistraron = [];
    inventario.forEach((val) => {
      const p = prendasAgrupadas.find((val2) => {
        return val2.articulo === val.articulo;
      });
      if (p) {
        if (val.cantidad !== p.cantidad) {
          prendasEnComun.push({
            articulo: val.articulo,
            cantidad: val.cantidad - p.cantidad,
          });
        }
      } else if (val.cantidad !== 0) {
        prendasQueNoSeRegistraron.push({
          articulo: val.articulo,
          cantidad: val.cantidad,
        });
      }
    });
    prendasAgrupadas.forEach((val) => {
      const p = inventario.find((val2) => {
        return val2.articulo === val.articulo;
      });
      if (!p) {
        registrosDePrendasNoExistentes.push({
          articulo: val.articulo,
          cantidad: -val.cantidad,
        });
      }
    });
    setDiscrepancias(
      registrosDePrendasNoExistentes
        .concat(prendasEnComun)
        .concat(prendasQueNoSeRegistraron)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5"> Resumen</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color="error" variant="h4">
            <b>Alerta</b>: se va a sobrescribir el inventario actual con los
            artículos registrados
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {`Número de artículos  : ${NoDeArticulos}`}
          </Typography>
          {discrepancias && discrepancias.length > 0 && (
            <>
              <Typography color="error" variant="subtitle1">
                Hay discrepancias en los artículos registrados, se recomienda
                volver a revisar.
              </Typography>
              <Box m={2}>
                <Typography color="error" variant="subtitle1">
                  Artículos con discrepancias
                </Typography>
                <Divider />
                {discrepancias.map((r) => (
                  <Typography color="error" variant="subtitle1">
                    {r.articulo}
                  </Typography>
                ))}
              </Box>
            </>
          )}
          <Box m={2}>
            <Typography variant="subtitle1"> Artículos registrados</Typography>
            <Divider />
            {prendasAgrupadas &&
              prendasAgrupadas.map((r) => (
                <Typography variant="subtitle1">
                  {`${r.articulo}: ${r.cantidad}`}
                </Typography>
              ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Resumen;
