/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ArticulosValues, PrendasRevision } from '../../../types/types';
import {
  agruparArticulosParaRegistro,
  encontrarDiscrepanciasDePrendas,
} from '../../../utils/functions';
import {
  Inventario_inventario_inv,
  PrendasNuevoRegistro,
} from '../../../types/apollo';

import RevisionDeArticulos from '../../../components/RevisionDeArticulos';

interface ResumenProps {
  inventario: Inventario_inventario_inv[];
  setDiscrepancias: (a: PrendasNuevoRegistro[]) => void;
  setNuevoInventario: (a: PrendasNuevoRegistro[]) => void;
}
const Resumen = (props: ResumenProps): JSX.Element => {
  const { setDiscrepancias, setNuevoInventario, inventario } = props;
  const { values } = useFormikContext<ArticulosValues>();
  const [revisionDePrendas, setRevisionDePrendas] = useState<PrendasRevision[]>(
    []
  );
  const [revisionDeDiscrepancias, setRevisionDeDiscrepancias] = useState<
    PrendasRevision[]
  >([]);
  useEffect(() => {
    const { revision, prendas } = agruparArticulosParaRegistro(values);
    setRevisionDePrendas(revision);
    setNuevoInventario(prendas);
    const {
      revision: revisionDiscrepancias,
      prendas: discrepancias,
    } = encontrarDiscrepanciasDePrendas(revision, inventario, true);
    setDiscrepancias(discrepancias);
    setRevisionDeDiscrepancias(revisionDiscrepancias);
  }, []);

  return (
    <>
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
    </>
  );
};

export default Resumen;
