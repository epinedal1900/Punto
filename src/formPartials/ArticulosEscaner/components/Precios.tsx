import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@material-ui/core';
import { FieldArray, useFormikContext } from 'formik';
import { ClassNameMap } from '@material-ui/styles';
import { RxDocument } from 'rxdb';

import { NumberFieldArray } from '../../../components';
import * as Database from '../../../Database';
import { ArticulosValues } from '../../../types/types';

interface PrendasSueltasProps {
  classes: ClassNameMap;
  doc?: RxDocument<Database.TicketDb>;
  matches: boolean;
}

const Precios = (props: PrendasSueltasProps): JSX.Element => {
  const { values, errors } = useFormikContext<ArticulosValues>();
  const { classes, doc, matches } = props;
  return (
    <FieldArray
      name="precios"
      render={() => (
        <>
          <Box mb={1} mt={2}>
            <Typography
              color={errors.precios ? 'error' : 'textSecondary'}
              variant="subtitle1"
            >
              Precios
            </Typography>
          </Box>
          <Divider className={classes.divider} />
          <Box
            className={classes.box}
            height={matches ? '35vh' : '27vh'}
            maxHeight={matches ? '35vh' : '27vh'}
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
                    {values.precios?.length === 0 && (
                      <Typography align="center" variant="h6">
                        Sin prendas
                      </Typography>
                    )}
                    {values.precios.map((precio, index) => (
                      <>
                        {precio && (
                          <ListItem key={`precios${index}`}>
                            <ListItemText
                              primary={
                                <Grid alignItems="center" container spacing={3}>
                                  <Grid item xs={4}>
                                    <NumberFieldArray
                                      handleBlur={async (
                                        _accesor: string,
                                        val: number,
                                        _mainIndex: number,
                                        id: number
                                      ) => {
                                        await doc.atomicUpdate((oldData) => {
                                          oldData.precios[id].precio = val;
                                          return oldData;
                                        });
                                      }}
                                      index={index}
                                      label="Precio"
                                      moneyFormat
                                      property="precio"
                                      valueName="precios"
                                    />
                                  </Grid>
                                  <Grid item xs={8}>
                                    <Typography
                                      variant={matches ? 'h6' : 'subtitle1'}
                                    >
                                      {precio.nombre}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              }
                            />
                          </ListItem>
                        )}
                      </>
                    ))}
                  </>
                )}
              </List>
            </div>
          </Box>
        </>
      )}
    />
  );
};
export default Precios;
