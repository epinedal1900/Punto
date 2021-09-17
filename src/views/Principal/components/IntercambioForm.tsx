/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useMutation } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RadioGroup } from 'formik-material-ui';
import Radio from '@material-ui/core/Radio';
import { Field, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { RxDocument } from 'rxdb';
import ObjectId from 'bson-objectid';

import { LinearProgress } from '@material-ui/core';
import * as Database from '../../../Database';
import { NUEVO_INTERCAMBIO } from '../../../utils/mutations';
import { RootState } from '../../../types/store';
import {
  NuevaVentaUtils_puntosActivos_plazasConInventarios,
  nuevoIntercambio,
  nuevoIntercambioVariables,
  Productos_productos_productos,
} from '../../../types/apollo';
import {
  PrendasRevision,
  PrincipalValues,
  SetState,
} from '../../../types/types';
import { PLAZA } from '../../../utils/queries';
import {
  agruparArticulosParaRegistro,
  crearTicketSinPrecioData,
  fechaPorId,
  restablecerIntercambio,
} from '../../../utils/functions';
import { AutocompleteField } from '../../../components';
import ArticulosEscaner from '../../../formPartials/ArticulosEscaner';
import { IntercambiosInitialValues } from '../../../utils/Constants';

const { ipcRenderer } = window.require('electron');

interface NuevoIntercambioProps {
  opcionesArticulos: Productos_productos_productos[];
  open: boolean;
  setDialogOpen: SetState<boolean>;
  setIntercambioOpen: SetState<boolean>;
  setMessage: SetState<string | null>;
  setSuccess: SetState<boolean>;
  mutationVariablesDoc: RxDocument<Database.mutation_variables>;
  plazaDoc: RxDocument<Database.plazaDB>;
  plazasParaIntercambios: NuevaVentaUtils_puntosActivos_plazasConInventarios[];
  codigoStr: string;
  setCodigoStr: SetState<string>;
  docIntercambio: RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  >;
}
const IntercambioForm = (props: NuevoIntercambioProps): JSX.Element => {
  const {
    opcionesArticulos,
    open,
    setDialogOpen,
    setIntercambioOpen,
    setMessage,
    setSuccess,
    plazasParaIntercambios,
    codigoStr,
    docIntercambio,
    mutationVariablesDoc,
    plazaDoc,
    setCodigoStr,
  } = props;
  const session = useSelector((state: RootState) => state.session);
  const plazaState = useSelector((state: RootState) => state.plaza);
  const { values, setFieldValue, validateForm, setTouched } = useFormikContext<
    PrincipalValues
  >();
  const [loading, setLoading] = useState(false);
  const [
    nuevoIntercambioFunction,
    { loading: intercambioLoading },
  ] = useMutation<nuevoIntercambio, nuevoIntercambioVariables>(
    NUEVO_INTERCAMBIO,
    {
      onCompleted: (data) => {
        if (data.nuevoIntercambio.success === true) {
          setMessage(data.nuevoIntercambio.message);
          setSuccess(true);
        } else {
          setMessage(data.nuevoIntercambio.message);
        }
      },
      refetchQueries: [
        {
          query: PLAZA,
          variables: { _id: plazaState._idPunto },
        },
      ],
    }
  );

  const handleClose = () => {
    if (!loading) {
      setDialogOpen(false);
      setIntercambioOpen(false);
    }
  };
  const finalizar = (articulos: PrendasRevision[]) => {
    if (values.intercambioValues.tipoDeImpresion === 'imprimir') {
      const data = crearTicketSinPrecioData({
        infoPunto: plazaState.infoPunto || 'GIRL STATE <br><br>',
        articulos,
      });
      if (plazaState.ancho && plazaState.impresora) {
        ipcRenderer.send('PRINT', {
          data,
          impresora: plazaState.impresora,
          ancho: plazaState.ancho,
        });
      } else {
        // eslint-disable-next-line no-alert
        alert('seleccione una impresora y un ancho');
      }
    }
    if (docIntercambio) {
      restablecerIntercambio(docIntercambio);
    }
    setFieldValue('intercambioValues', IntercambiosInitialValues, false);
    setDialogOpen(false);
    setIntercambioOpen(false);
  };

  const handleIntercambio = async () => {
    setLoading(true);
    const { intercambioValues } = values;
    await validateForm().then(async (validation) => {
      // @ts-expect-error:investigar
      await setTouched(validation);
      if (
        typeof validation?.intercambioValues?.plazaReceptora !== 'string' &&
        // @ts-expect-error:err
        !validation?.intercambioValues?.plazaReceptora?.id &&
        !validation?.intercambioValues?.escaneos &&
        !validation?.intercambioValues?.prendasSueltas &&
        // @ts-expect-error:err
        !validation?.intercambioValues?.plazaReceptora?.nombre &&
        plazaState._idPunto
      ) {
        // @ts-expect-error:err
        const Recibe = intercambioValues.plazaReceptora.nombre || '';
        const { prendas, revision } = agruparArticulosParaRegistro(
          intercambioValues
        );
        const variables: nuevoIntercambioVariables = {
          _id: new ObjectId().toString(),
          prendas,
          // @ts-expect-error:err
          puntoIdReceptor: intercambioValues.plazaReceptora.id,
          puntoIdEmisor: plazaState._idPunto,
        };
        if (plazaState.online) {
          await nuevoIntercambioFunction({
            variables,
          }).then((res) => {
            if (res.data && res.data.nuevoIntercambio.success === true) {
              finalizar(revision);
            }
          });
        } else {
          const _id = new ObjectId();
          await mutationVariablesDoc.atomicUpdate((oldData) => {
            oldData.intercambio.push(variables);
            return oldData;
          });
          await plazaDoc.atomicUpdate((oldData) => {
            oldData.intercambios?.unshift({
              _id: _id.toString(),
              esEmision: true,
              Fecha: fechaPorId(_id),
              Envia: `sin conexión: ${session.nombre}`,
              Recibe,
              ar: prendas,
              discrepancias: null,
              ca: false,
            });
            return oldData;
          });
          finalizar(revision);
          setMessage('Intercambio añadido');
          setSuccess(true);
        }
      }
    });
    setLoading(false);
  };

  return (
    <Dialog fullWidth maxWidth="lg" onClose={handleClose} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Nuevo intercambio</Typography>
          </Grid>
          <Grid item xs={12}>
            <ArticulosEscaner
              codigoStr={codigoStr}
              docIntercambio={docIntercambio}
              esIntercambio
              intercambioOpen={open}
              productos={opcionesArticulos}
              setCodigoStr={setCodigoStr}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={RadioGroup}
              name="intercambioValues.tipoDeImpresion"
            >
              <FormControlLabel
                control={<Radio disabled={loading || intercambioLoading} />}
                disabled={loading || intercambioLoading}
                label="Registrar e im primir"
                value="imprimir"
              />
              <FormControlLabel
                control={<Radio disabled={loading || intercambioLoading} />}
                disabled={loading || intercambioLoading}
                label="Solo registrar"
                value="noImprimir"
              />
            </Field>
          </Grid>
          <Grid item xs={12}>
            <AutocompleteField
              getOptionsLabel={(option) => (option.nombre ? option.nombre : '')}
              label="Plaza"
              options={plazasParaIntercambios}
              valueName="intercambioValues.plazaReceptora"
            />
          </Grid>
          {loading && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="default"
          disabled={loading || intercambioLoading}
          onClick={handleClose}
          size="small"
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          disabled={
            loading ||
            (values.intercambioValues.escaneos.length === 0 &&
              values.intercambioValues.prendasSueltas.length === 0)
          }
          onClick={handleIntercambio}
          size="small"
          variant="contained"
        >
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IntercambioForm;
