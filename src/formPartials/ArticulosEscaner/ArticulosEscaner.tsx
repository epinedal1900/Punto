/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Divider, Grid, Typography, useMediaQuery } from '@material-ui/core';
import { RxDocument } from 'rxdb';

import Escaneos from './components/Escaneos';
import PrendasSueltas from './components/PrendasSueltas';
import PaquetesAbiertos from './components/PaquetesAbiertos';
import Precios from './components/Precios';
import * as Database from '../../Database';
import { Productos_productos_productos } from '../../types/apollo';
import {
  ArticulosValues,
  FormikSetFieldValue,
  PrincipalValues,
  SetState,
} from '../../types/types';
import {
  montoDeArticulosEscaner,
  prendaIdDeQR,
  resolverPrendas,
} from '../../utils/functions';
import AgregarForm, {
  AgregarFormProps,
} from '../../views/Principal/components/AgregarForm';
// import { omit, pick } from 'lodash';

const useStyles = makeStyles((theme) => ({
  divider: {
    background: theme.palette.secondary.light,
  },
  list: {
    flexGrow: 1,
  },
  grid: {
    padding: 0,
    margin: 0,
  },
  box: {},
}));

export type Accesor =
  | keyof ArticulosValues
  | 'intercambioValues.escaneos'
  | 'intercambioValues.prendasSueltas';
export type Casos = 'escaneos' | 'prendasSueltas' | 'paquetesAbiertos';

export const handleAgregarPrecio = async (
  nombre: string,
  _id: string,
  precio: number,
  values: PrincipalValues,
  setFieldValue: FormikSetFieldValue,
  doc: RxDocument<Database.TicketDb>
) => {
  if (
    !values.precios.some((val) => {
      return val && val.nombre === nombre;
    }) &&
    doc
  ) {
    const obj = {
      nombre,
      _id,
      precio,
    };
    const i = values.precios.length;
    await doc.atomicUpdate((oldData) => {
      oldData.precios[i] = obj;
      return oldData;
    });
    setFieldValue(`precios.${i}`, obj, false);
  }
};

interface ArticulosCompProps {
  codigoStr: string;
  setCodigoStr: SetState<string>;
  productos: Productos_productos_productos[];
  intercambioOpen: boolean;
  esIntercambio: boolean;
  docIntercambio?: RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  >;
  doc?: RxDocument<Database.TicketDb>;
  incluirPrecio?: boolean;
  setTotal?: SetState<number>;
  maxRows?: number;
  allowZero?: boolean;
  abrirPaquetes?: boolean;
  esRegistro?: boolean;
  agregarFormProps?: AgregarFormProps;
}

const ArticulosComp = (props: ArticulosCompProps): JSX.Element => {
  const {
    incluirPrecio = false,
    maxRows = 15,
    allowZero = false,
    abrirPaquetes,
    productos,
    doc,
    agregarFormProps,
    codigoStr,
    setTotal,
    esIntercambio,
    esRegistro,
    setCodigoStr,
    docIntercambio,
    intercambioOpen,
  } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('xl'));
  const { values, setFieldValue } = useFormikContext<PrincipalValues>();
  const [escaneoParaAbrirPaquete, setEscaneoParaAbrirPaquete] = useState(false);
  const classes = useStyles();
  const [procesando, setProcesando] = useState(false);
  const [resaltado, setResaltado] = useState<{ id: number; name: string }>({
    id: -1,
    name: 'null',
  });
  const [errorDeEscaneo, setErrorDeEscaneo] = useState<null | string>(null);

  window.onbeforeunload = () => {
    // @ts-expect-error:err
    document.activeElement?.blur();
  };

  useEffect(() => {
    setErrorDeEscaneo(null);
    if (setTotal) {
      const t = montoDeArticulosEscaner(values);
      setTotal(t);
      setFieldValue('cantidadPagada', t, false);
      doc?.atomicUpdate((o) => {
        o.cantidadPagada = t;
        return o;
      });
    }
  }, [
    values.escaneos,
    values.paquetesAbiertos,
    values.precios,
    values.prendasSueltas,
  ]);

  const eliminarDePrecios = async (
    nombre: string,
    valueName: Casos,
    index: number
  ) => {
    const casos: Casos[] = ['escaneos', 'paquetesAbiertos', 'prendasSueltas'];
    let noEliminar = values[valueName].some((val, i) => {
      const valNombre =
        // @ts-expect-error:casos
        valueName === 'prendasSueltas' ? val.articulo.nombre : val.nombre;
      return valNombre === nombre && i !== index;
    });
    if (!noEliminar) {
      casos
        .filter((val) => val !== valueName)
        .forEach((caso) => {
          if (!noEliminar) {
            const s = values[caso].some((val) => {
              const valNombre =
                // @ts-expect-error:casos
                caso === 'prendasSueltas' ? val.articulo.nombre : val.nombre;
              return valNombre === nombre;
            });
            noEliminar = !noEliminar && s;
          }
        });
    }
    if (!noEliminar && doc) {
      const precios = values.precios.filter((val) => {
        return val && val.nombre !== nombre;
      });
      await doc.atomicUpdate((oldData) => {
        oldData.precios = precios;
        return oldData;
      });
      setFieldValue('precios', precios, false);
    }
  };

  const onEscaneo = async (codigo: string) => {
    setProcesando(true);
    // TODO actualizar para responder a version con \ al inicio
    // @ts-expect-error:err
    await document.activeElement?.blur();
    const escaneosAccesor: Accesor =
      esIntercambio && !esRegistro ? 'intercambioValues.escaneos' : 'escaneos';
    const escaneos =
      esIntercambio && !esRegistro
        ? values.intercambioValues.escaneos
        : values.escaneos;
    const elementId = escaneoParaAbrirPaquete
      ? `p${codigo}`
      : esIntercambio && !esRegistro
      ? `ie${codigo}`
      : `e${codigo}`;
    setErrorDeEscaneo(null);
    const prenda = await resolverPrendas([prendaIdDeQR(codigo)]);
    if (codigo.length !== 58 && codigo.length !== 54) {
      setErrorDeEscaneo('Código inválido (longitud inválida)');
    } else if (prenda[0].nombre === 'prenda no definida') {
      setErrorDeEscaneo('Código inválido (prenda no definida)');
    } else if (!escaneoParaAbrirPaquete && document.getElementById(elementId)) {
      const idx = escaneos.findIndex((val) => {
        return val.qr === codigo;
      });
      setResaltado({
        id: idx,
        name: escaneoParaAbrirPaquete ? 'paquetesAbiertos' : escaneosAccesor,
      });
    } else {
      const tallaInicial = parseInt(codigo.slice(0, 2));
      const tallaFinal = parseInt(codigo.slice(2, 4));
      const prendasPorTalla = parseInt(codigo.slice(4, 6));
      const push = {
        qr: codigo,
        id: codigo.slice(54, 58),
        tallas: `${tallaInicial.toString()}-${tallaFinal.toString()} (${prendasPorTalla.toString()})`,
        piezas: ((tallaFinal - tallaInicial) / 2 + 1) * prendasPorTalla,
        nombre: prenda[0].nombre,
        cantidad: 0,
      };
      let index: number;
      if (incluirPrecio && doc) {
        handleAgregarPrecio(
          prenda[0].nombre,
          prendaIdDeQR(codigo),
          prenda[0].precio,
          values,
          setFieldValue,
          doc
        );
      }
      if (escaneoParaAbrirPaquete && doc) {
        index = values.paquetesAbiertos.length;
        setResaltado({
          id: index,
          name: 'paquetesAbiertos',
        });
        await doc.atomicUpdate((oldData) => {
          oldData.paquetesAbiertos[index] = JSON.parse(JSON.stringify(push));
          return oldData;
        });
        setFieldValue(
          `paquetesAbiertos.${index}`,
          JSON.parse(JSON.stringify(push)),
          false
        );
        setEscaneoParaAbrirPaquete(false);
      } else {
        index = escaneos.length;
        setResaltado({
          id: index,
          name: 'escaneos',
        });
        if (docIntercambio) {
          await docIntercambio?.atomicUpdate((oldData) => {
            oldData.escaneos.push(JSON.parse(JSON.stringify(push)));
            return oldData;
          });
        } else {
          await doc?.atomicUpdate((oldData) => {
            oldData.escaneos.push(JSON.parse(JSON.stringify(push)));
            return oldData;
          });
        }
        setFieldValue(`${escaneosAccesor}.${index}`, push, false);
      }
    }
    const d = document.getElementById(elementId);
    if (d && !escaneoParaAbrirPaquete) {
      d.focus();
    }
    setProcesando(false);
  };

  useEffect(() => {
    if (
      ((intercambioOpen && esIntercambio) ||
        (!esIntercambio && !intercambioOpen)) &&
      codigoStr.slice(-5) === 'Enter' &&
      codigoStr.length >= 58
    ) {
      onEscaneo(codigoStr.slice(-58 - 5, -5));
      setCodigoStr('');
    }
  }, [codigoStr, intercambioOpen]);

  return (
    <>
      {agregarFormProps && <AgregarForm {...agregarFormProps} />}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          {errorDeEscaneo && <Typography>{errorDeEscaneo}</Typography>}
          <Escaneos
            classes={classes}
            doc={doc}
            docIntercambio={esIntercambio ? docIntercambio : undefined}
            eliminarDePrecios={eliminarDePrecios}
            esRegistro={esRegistro}
            incluirPrecio={incluirPrecio}
            matches={matches}
            procesando={procesando}
            resaltado={resaltado}
            setResaltado={setResaltado}
          />
          <PaquetesAbiertos
            abrirPaquetes={Boolean(abrirPaquetes)}
            classes={classes}
            doc={doc}
            eliminarDePrecios={eliminarDePrecios}
            escaneoParaAbrirPaquete={escaneoParaAbrirPaquete}
            incluirPrecio={incluirPrecio}
            matches={matches}
            resaltado={resaltado}
            setEscaneoParaAbrirPaquete={setEscaneoParaAbrirPaquete}
            setResaltado={setResaltado}
          />
        </Grid>
        <Grid item xs={6}>
          {incluirPrecio && (
            <Precios classes={classes} doc={doc} matches={matches} />
          )}
          <PrendasSueltas
            allowZero={allowZero}
            classes={classes}
            doc={doc}
            docIntercambio={esIntercambio ? docIntercambio : undefined}
            eliminarDePrecios={eliminarDePrecios}
            esRegistro={esRegistro}
            incluirPrecio={incluirPrecio}
            matches={matches}
            maxRows={maxRows}
            productos={productos}
          />
        </Grid>
      </Grid>
      <Divider />
      <Divider />
      <Divider />
    </>
  );
};

export default ArticulosComp;
