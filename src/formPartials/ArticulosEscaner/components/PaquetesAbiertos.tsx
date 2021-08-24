/* eslint-disable react/jsx-key */
import React from 'react';
import {
  Box,
  List,
  Typography,
  ListItem,
  ListItemText,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import { FieldArray, useFormikContext } from 'formik';
import { ClassNameMap } from '@material-ui/styles';
import { RxDocument } from 'rxdb';

import { ArticulosValues } from '../../../types/types';
import { Casos } from '../ArticulosEscaner';
import QR from './QR';
import { TicketDb } from '../../../Database';

interface PaquetesAbiertosProps {
  resaltado: { id: number; name: string };
  setResaltado: (a: { id: number; name: string }) => void;
  classes: ClassNameMap;
  abrirPaquetes: boolean;
  escaneoParaAbrirPaquete: boolean;
  setEscaneoParaAbrirPaquete: any;
  eliminarDePrecios: (a: string, b: Casos, c: number) => void;
  incluirPrecio: boolean;
  doc?: RxDocument<TicketDb>;
  matches: boolean;
}

const PaquetesAbiertos = (props: PaquetesAbiertosProps): JSX.Element => {
  const { values, errors } = useFormikContext<ArticulosValues>();

  const {
    resaltado,
    setResaltado,
    classes,
    abrirPaquetes,
    escaneoParaAbrirPaquete,
    setEscaneoParaAbrirPaquete,
    eliminarDePrecios,
    incluirPrecio,
    doc,
    matches,
  } = props;
  return (
    <>
      {abrirPaquetes && (
        <>
          <FieldArray
            name="paquetesAbiertos"
            render={(arrayHelpers) => (
              <div>
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                  mb={1}
                  mt={2}
                >
                  <Box flexGrow={1}>
                    <Typography
                      color={
                        errors.paquetesAbiertos ? 'error' : 'textSecondary'
                      }
                      variant="subtitle1"
                    >
                      Paquetes abiertos
                    </Typography>
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={escaneoParaAbrirPaquete}
                          color="primary"
                          name="escaneoParaAbrirPaquete"
                          onChange={() => {
                            setEscaneoParaAbrirPaquete((e: any) => !e);
                          }}
                        />
                      }
                      label="Escanear para abrir paquete"
                    />
                  </Box>
                </Box>
                <Divider className={classes.divider} />
                <Box
                  className={classes.box}
                  height={matches ? '22vh' : '17vh'}
                  maxHeight={matches ? '22vh' : '17vh'}
                  overflow="auto"
                >
                  <div className={classes.list}>
                    <List dense disablePadding>
                      {!doc ? (
                        <Box display="flex" justifyContent="center" mt={2}>
                          <Box mt={3}>
                            <CircularProgress />
                          </Box>
                        </Box>
                      ) : (
                        <>
                          {values.paquetesAbiertos.length === 0 && (
                            <Typography align="center" variant="h6">
                              Sin paquetes abiertos
                            </Typography>
                          )}
                          {values.paquetesAbiertos.map((qr, index) => (
                            <ListItem id={`paquetesAbiertos.${index}`}>
                              <ListItemText
                                primary={
                                  <QR
                                    arrayHelpers={arrayHelpers}
                                    doc={doc}
                                    eliminarDePrecios={eliminarDePrecios}
                                    idx={index}
                                    incluirPrecio={incluirPrecio}
                                    matches={matches}
                                    name="paquetesAbiertos"
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
                  {typeof errors.paquetesAbiertos === 'string' && (
                    <Typography color="error" variant="h6">
                      {errors.paquetesAbiertos}
                    </Typography>
                  )}
                </Box>
              </div>
            )}
          />
        </>
      )}
    </>
  );
};
export default PaquetesAbiertos;
