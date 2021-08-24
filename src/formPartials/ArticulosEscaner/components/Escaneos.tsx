import React from 'react';
import {
  Box,
  Grid,
  LinearProgress,
  List,
  Typography,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import { FieldArray, useFormikContext } from 'formik';
import { ClassNameMap } from '@material-ui/styles';
import { RxDocument } from 'rxdb';

import { Casos } from '../ArticulosEscaner';
import QR from './QR';
import * as Database from '../../../Database';
import { PrincipalValues } from '../../../types/types';

interface EscaneosProps {
  resaltado: { id: number; name: string };
  setResaltado: (a: { id: number; name: string }) => void;
  procesando: boolean;
  classes: ClassNameMap;
  eliminarDePrecios: (a: string, b: Casos, c: number) => void;
  incluirPrecio: boolean;
  doc?: RxDocument<Database.TicketDb>;
  docIntercambio?: RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  >;
  matches: boolean;
  esRegistro?: boolean;
}

const Escaneos = (props: EscaneosProps): JSX.Element => {
  const { values, errors } = useFormikContext<PrincipalValues>();

  const {
    resaltado,
    procesando,
    setResaltado,
    classes,
    eliminarDePrecios,
    incluirPrecio,
    doc,
    docIntercambio,
    matches,
    esRegistro,
  } = props;
  const name =
    docIntercambio && !esRegistro ? 'intercambioValues.escaneos' : 'escaneos';
  const escaneos =
    docIntercambio && !esRegistro
      ? values.intercambioValues.escaneos
      : values.escaneos;

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          {procesando && (
            <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
              <LinearProgress />
            </Grid>
          )}
          <Box mb={1} mt={2}>
            <Typography
              color={errors.escaneos ? 'error' : 'textSecondary'}
              variant="subtitle1"
            >
              {`Escaneos (${escaneos.length} proceso${
                escaneos.length > 1 || escaneos.length === 0 ? 's' : ''
              }) `}
            </Typography>
          </Box>
          <Divider className={classes.divider} />
          <Box
            className={classes.box}
            height={
              matches
                ? esRegistro
                  ? '60vh'
                  : '37vh'
                : esRegistro
                ? '50vh'
                : '27vh'
            }
            maxHeight={
              matches
                ? esRegistro
                  ? '60vh'
                  : '37vh'
                : esRegistro
                ? '50vh'
                : '27vh'
            }
            overflow="auto"
          >
            <div className={classes.list}>
              <List dense disablePadding>
                {!doc && !docIntercambio ? (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Box mt={3}>
                      <CircularProgress />
                    </Box>
                  </Box>
                ) : (
                  <>
                    {escaneos.length === 0 && (
                      <Typography align="center" variant="h6">
                        Sin escaneos
                      </Typography>
                    )}
                    {escaneos.map((qr, idx) => (
                      <ListItem key={`esceneo${idx}`}>
                        <ListItemText
                          primary={
                            <QR
                              arrayHelpers={arrayHelpers}
                              doc={doc}
                              docIntercambio={docIntercambio}
                              eliminarDePrecios={eliminarDePrecios}
                              idx={idx}
                              incluirPrecio={incluirPrecio}
                              matches={matches}
                              name={name}
                              qr={qr}
                              resaltado={resaltado}
                              setResaltado={setResaltado}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </>
                )}
              </List>
            </div>
          </Box>
        </div>
      )}
    />
  );
};
export default Escaneos;
