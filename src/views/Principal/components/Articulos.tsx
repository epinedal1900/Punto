import React, { useEffect } from 'react';
import { useFormikContext, FieldArray } from 'formik';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { useSelector } from 'react-redux';

import { ArticuloOption, Session, PrincipalValues } from '../../../types/types';
import { RootState } from '../../../types/store';
import AutocompleteFieldArray from '../../../components/AutocompleteFieldArray';
import NumberFieldArray from '../../../components/NumberFieldArray';
import AgregarForm from './AgregarForm';

interface ArticulosProps {
  opcionesArticulos: ArticuloOption[];
  agregarOpen: boolean;
  setAgregarOpen: (a: boolean) => void;
  handleAgregarClose: () => void;
  setDialogOpen: (a: boolean) => void;
  setTotal: (a: number) => void;
  selectedTicket: number;
  addButton?: boolean;
}
const Articulos = (props: ArticulosProps): JSX.Element => {
  const {
    opcionesArticulos,
    agregarOpen,
    setAgregarOpen,
    handleAgregarClose,
    setDialogOpen,
    setTotal,
    selectedTicket,
    addButton,
  } = props;
  const { values, errors, setFieldValue } = useFormikContext<PrincipalValues>();
  const session: Session = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (setTotal) {
      const total = values.articulos.reduce((acc, cur) => {
        return acc + cur.precio * cur.cantidad;
      }, 0);
      setTotal(total);
      setFieldValue('cantidadPagada', total, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.articulos]);

  return (
    <>
      <FieldArray
        name="articulos"
        render={(arrayHelpers) => (
          <div>
            <AgregarForm
              arrayHelpers={arrayHelpers}
              handleAddClose={handleAgregarClose}
              opcionesArticulos={opcionesArticulos}
              open={agregarOpen}
              selectedTicket={selectedTicket}
              setAgregarOpen={setAgregarOpen}
              setDialogOpen={setDialogOpen}
            />
            {addButton && (
              <Box display="flex" flexDirection="row-reverse" mb={1} mr={2}>
                <Button
                  aria-label="add"
                  color="secondary"
                  disabled={values.articulos.length >= 15}
                  onClick={() =>
                    arrayHelpers.insert(
                      0,
                      JSON.parse(
                        JSON.stringify({
                          articulo: '',
                          cantidad: 0,
                          precio: 0,
                        })
                      )
                    )
                  }
                  size="small"
                  variant="outlined"
                >
                  añadir
                </Button>
              </Box>
            )}
            {values.articulos.length === 0 && (
              <Box display="flex" flexDirection="center" mb={1} mr={2}>
                <Typography variant="subtitle1">Sin artículos</Typography>
              </Box>
            )}
            {values.articulos.map((_e, index) => (
              <Box key={index} mb={1}>
                <Grid
                  alignItems="center"
                  container
                  justify="space-between"
                  spacing={1}
                >
                  <Grid item sm={2} xs={5}>
                    <NumberFieldArray
                      index={index}
                      label="Cantidad"
                      property="cantidad"
                      valueName="articulos"
                    />
                  </Grid>
                  <Grid item sm={7} xs={12}>
                    <AutocompleteFieldArray
                      getOptionLabel={(option: ArticuloOption) => {
                        if (option) {
                          return `${option.codigo}: ${option.nombre}`;
                        }
                        return '';
                      }}
                      handleChange={(value: ArticuloOption) => {
                        if (typeof value === 'object' && value !== null) {
                          let { precio } = value;
                          if (session.tickets[selectedTicket].esMenudeo) {
                            precio += 15;
                          }
                          setFieldValue(
                            `articulos.${index}.precio`,
                            precio,
                            false
                          );
                        }
                      }}
                      index={index}
                      label="Artículo"
                      options={opcionesArticulos}
                      property="articulo"
                      valueName="articulos"
                    />
                  </Grid>
                  <Grid item sm={2} xs={5}>
                    <NumberFieldArray
                      index={index}
                      label="Precio"
                      moneyFormat
                      property="precio"
                      valueName="articulos"
                    />
                  </Grid>
                  <Grid item sm={1} xs={2}>
                    <IconButton
                      aria-label="delete"
                      color="default"
                      onClick={() => arrayHelpers.remove(index)}
                      size="medium"
                    >
                      <ClearIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {errors.articulos === 'Ingrese al menos 1 artículo' && (
              <Typography color="error" variant="h6">
                {errors.articulos}
              </Typography>
            )}
            {/* <h2>{JSON.stringify(values.articulos)}</h2>
            <h2>{JSON.stringify(session.articulos)}</h2> */}
          </div>
        )}
      />
    </>
  );
};

export default Articulos;
