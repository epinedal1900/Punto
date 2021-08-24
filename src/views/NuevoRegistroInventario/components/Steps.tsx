/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { RxDatabase, RxDocument } from 'rxdb';
import { useFormikContext } from 'formik';

import ArticulosEscaner from '../../../formPartials/ArticulosEscaner';
import {
  Inventario_inventario_inv,
  PrendasNuevoRegistro,
  Productos_productos_productos,
} from '../../../types/apollo';
import * as Database from '../../../Database';
import {
  agruparArticulosParaRegistro,
  encontrarDiscrepanciasDePrendas,
  obtenerRegistroInventario,
} from '../../../utils/functions';
import {
  ArticulosValues,
  PrendasRevision,
  SetState,
} from '../../../types/types';
import RevisionDeArticulos from '../../../components/RevisionDeArticulos';

interface StepsProps {
  activeStep: number;
  productos: Productos_productos_productos[];
  db: RxDatabase<Database.db> | null;
  codigoStr: string;
  setNuevoInventario: SetState<PrendasNuevoRegistro[]>;
  inventario: Inventario_inventario_inv[] | null;
  setDiscrepancias: SetState<PrendasNuevoRegistro[]>;
  setCodigoStr: SetState<string>;
  docRegistroInventario: RxDocument<
    Database.registroInventarioDB | Database.intercambioDB
  > | null;
  setDocRegistroInventario: SetState<RxDocument<
    Database.registroInventarioDB | Database.intercambioDB
  > | null>;
}
const Steps = (props: StepsProps): JSX.Element => {
  const {
    activeStep,
    productos,
    db,
    codigoStr,
    setNuevoInventario,
    inventario,
    setDiscrepancias,
    setCodigoStr,
    setDocRegistroInventario,
    docRegistroInventario,
  } = props;
  const { values, setValues } = useFormikContext<ArticulosValues>();
  const [revisionDePrendas, setRevisionDePrendas] = useState<PrendasRevision[]>(
    []
  );
  const [revisionDeDiscrepancias, setRevisionDeDiscrepancias] = useState<
    PrendasRevision[]
  >([]);
  useEffect(() => {
    if (inventario && activeStep === 1) {
      const { revision, prendas } = agruparArticulosParaRegistro(values);
      setRevisionDePrendas(revision);
      setNuevoInventario(prendas);
      const {
        revision: revisionDiscrepancias,
        prendas: discrepancias,
      } = encontrarDiscrepanciasDePrendas(revision, inventario, true);
      setDiscrepancias(discrepancias);
      setRevisionDeDiscrepancias(revisionDiscrepancias);
    }
  }, [activeStep]);

  useEffect(() => {
    obtenerRegistroInventario(db, setValues, setDocRegistroInventario);
  }, [db]);

  return (
    <>
      {activeStep === 0 && (
        <ArticulosEscaner
          allowZero
          codigoStr={codigoStr}
          docIntercambio={docRegistroInventario || undefined}
          esIntercambio
          esRegistro
          intercambioOpen
          maxRows={50}
          productos={productos}
          setCodigoStr={setCodigoStr}
        />
      )}
      {activeStep === 1 && (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5"> Resumen</Typography>
            </Grid>
            <Grid item xs={12}>
              <RevisionDeArticulos
                articulos={revisionDePrendas}
                discrepancias={revisionDeDiscrepancias}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
export default Steps;
