import React from 'react';
import { Grid, IconButton, Typography, Box } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { FieldArrayRenderProps, useFormikContext } from 'formik';
import { RxDocument } from 'rxdb';
import { NumberFieldArray } from '../../../components';
import { PrincipalValues, Qr } from '../../../types/types';
import { aFormatoDeNumero } from '../../../utils/functions';
import * as Database from '../../../Database';
import { Casos } from '../ArticulosEscaner';

interface QRProps {
  idx: number;
  resaltado: { id: number; name: string };
  setResaltado: (a: { id: number; name: string }) => void;
  qr: Qr;
  name: 'escaneos' | 'intercambioValues.escaneos';
  arrayHelpers: FieldArrayRenderProps;
  eliminarDePrecios: (a: string, b: Casos, c: number) => void;
  incluirPrecio: boolean;
  doc?: RxDocument<Database.TicketDb>;
  docIntercambio?: RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  >;

  matches: boolean;
}

const QR = (props: QRProps): JSX.Element => {
  const {
    idx,
    resaltado,
    arrayHelpers,
    qr,
    setResaltado,
    name,
    eliminarDePrecios,
    incluirPrecio,
    docIntercambio,
    doc,
    matches,
  } = props;
  const { values } = useFormikContext<PrincipalValues>();
  const resaltar = resaltado.id === idx && resaltado.name === name;
  return (
    <Grid
      alignContent="center"
      alignItems="center"
      container
      justify="center"
      spacing={1}
    >
      <Grid xs={3}>
        <Grid alignItems="center" container>
          <Grid item xs={8}>
            <NumberFieldArray
              decimals={
                name === 'escaneos' || name === 'intercambioValues.escaneos'
              }
              handleBlur={async (
                _accesor: string,
                val: number,
                _mainIndex: number,
                index: number
              ) => {
                if (docIntercambio) {
                  await docIntercambio.atomicUpdate((oldData) => {
                    const v = name === 'escaneos' && val > 70 ? 0 : val;
                    oldData.escaneos[index].cantidad = v;
                    return oldData;
                  });
                } else if (doc) {
                  await doc.atomicUpdate((oldData) => {
                    const v = name === 'escaneos' && val > 70 ? 0 : val;
                    if (name === 'escaneos') {
                      oldData.escaneos[index].cantidad = v;
                    }
                    return oldData;
                  });
                }
              }}
              id={
                name === 'escaneos'
                  ? `e${values.escaneos[idx].qr}`
                  : `ie${values.intercambioValues.escaneos[idx].qr}`
              }
              index={idx}
              label="Paquetes"
              maxVal={70}
              property="cantidad"
              valueName={name}
            />
          </Grid>
          {(name === 'escaneos' || name === 'intercambioValues.escaneos') && (
            <Grid item xs={4}>
              <Typography align="center" variant={matches ? 'h6' : 'subtitle1'}>
                <b>{aFormatoDeNumero(qr.piezas * qr.cantidad)}</b>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Grid alignItems="center" container>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" m={1}>
              <Box mr={3}>
                <Typography
                  color={resaltar ? 'secondary' : 'textSecondary'}
                  variant={matches ? 'h6' : 'subtitle1'}
                >
                  {qr.tallas}
                </Typography>
              </Box>
              <Box mr={3}>
                <Typography
                  color={resaltar ? 'secondary' : undefined}
                  variant={matches ? 'h6' : 'subtitle1'}
                >
                  {qr.id}
                </Typography>
              </Box>
              <Box mr={3}>
                <Typography
                  color={resaltar ? 'secondary' : 'textSecondary'}
                  variant={matches ? 'h6' : 'subtitle1'}
                >
                  {`${qr.piezas} pzs.`}
                </Typography>
              </Box>
              <Box>
                <Typography
                  color={resaltar ? 'secondary' : 'textSecondary'}
                  variant={matches ? 'h6' : 'subtitle1'}
                >
                  {qr.nombre}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          aria-label="delete"
          color="default"
          onClick={async () => {
            arrayHelpers.remove(idx);
            if (docIntercambio) {
              await docIntercambio.atomicUpdate((oldData) => {
                oldData.escaneos.splice(idx, 1);
                return oldData;
              });
            } else if (doc) {
              await doc.atomicUpdate((oldData) => {
                if (name === 'escaneos') {
                  oldData.escaneos.splice(idx, 1);
                }
                return oldData;
              });
            }
            setResaltado({ id: -1, name: 'null' });
            if (incluirPrecio && name !== 'intercambioValues.escaneos') {
              const { nombre } = values.escaneos[idx];
              eliminarDePrecios(nombre, name, idx);
            }
          }}
          size="medium"
          tabIndex={-1}
        >
          <ClearIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};
export default QR;
