import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { AutocompleteField } from 'components';
import { useLazyQuery } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import { Field, useFormikContext } from 'formik';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { RadioGroup } from 'formik-material-ui';
import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';

import { REGRESOS_MERCANCIA } from 'utils/queries'


const InformacionDeSalida = (props) => {
  const { puntosActivos, regresos, setRegresos } = props
  const { values, setFieldValue } = useFormikContext();
  const [opcionesValidas, setOpcionesValidas] = useState([]);
  const [firstLoad, setFirstLoad] = useState(null);

  const [getRegresos] = useLazyQuery(REGRESOS_MERCANCIA, {
    onCompleted(data) {
      if (values.puntoId.nombre === 'Moroleón' && regresos) {
        let regresosObj = JSON.parse(JSON.stringify(regresos))
        regresosObj = regresosObj.concat(data.regresosMercancia)
        let obj = groupBy(regresosObj, 'articulo');
        const prendasAgrupadas = Object.keys(obj).map(function (key) {
          return {
            articulo: key,
            cantidad: obj[key].reduce((acc, cur) => {
              return acc + cur.cantidad
            }, 0)
          };
        });
        setRegresos(prendasAgrupadas)
      } else {
        setRegresos(data.regresosMercancia)
      }
    }
  });
  useEffect(() => {
    setFirstLoad(false)
  }, [])

  useEffect(() => {
    const opcionesArr = [];
    const moroleonObj = {};
    if (values.tipoDeMovimiento === 'regreso') {
      puntosActivos.forEach(val => {
        if (val.registrarRegresos && val.id) {
          if (val.nombre === 'Pasillo 6') {
            assign(moroleonObj, { nombre: 'Moroleón', idPasillo6: val.id })
          } else if (val.nombre === 'Pasillo 2') {
            assign(moroleonObj, { nombre: 'Moroleón', idPasillo2: val.id })
          } else {
            opcionesArr.push(val)
          }
        }
      })
      if (!isEmpty(moroleonObj)) {
        opcionesArr.push(moroleonObj)
      }
    }
    else if (values.tipoDeMovimiento === 'salida') {
      puntosActivos.forEach(val => {
        if (val.registrarSalidas && val.id) {
          opcionesArr.push(val)
        }
      })
    }
    setOpcionesValidas(opcionesArr)
    if (!firstLoad) {
      setFieldValue('puntoId', '', false)
    }
  }, [values.tipoDeMovimiento])

  useEffect(() => {
    if (values.tipoDeMovimiento === 'regreso' && values.puntoId) {
      if (values.puntoId.nombre === 'Moroleón') {
        if (values.puntoId.idPasillo2) {
          getRegresos({ variables: { _id: values.puntoId.idPasillo2 } })
        }
        if (values.puntoId.idPasillo6) {
          getRegresos({ variables: { _id: values.puntoId.idPasillo6 } })
        }
      } else {
        getRegresos({ variables: { _id: values.puntoId.id } })
      }
    }
  }, [values.puntoId])

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
          <Typography variant="h5"> Información del movimiento</Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Field
            component={RadioGroup}
            name="tipoDeMovimiento"
          >
            <FormControlLabel
              control={<Radio />}
              label="Salida"
              value="salida"
            />
            <FormControlLabel
              control={<Radio />}
              label="Regreso"
              value="regreso"
            />
          </Field>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <AutocompleteField
            getOptionsLabel={option => option.nombre ? option.nombre : ''}
            label="Punto de venta"
            options={opcionesValidas}
            valueName="puntoId"
          />
          {/* <h2>{JSON.stringify(values)}</h2> */}
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
export default InformacionDeSalida