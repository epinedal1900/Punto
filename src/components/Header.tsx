import React from 'react';
import { Typography, Box, Grid, Button, Chip } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSelector } from 'react-redux';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import PrintIcon from '@material-ui/icons/Print';

import { Link as RouterLink } from 'react-router-dom';
import { RootState } from '../types/store';
import { AppRole } from '../types/types';

type IconOptions = 'añadir' | 'editar' | 'flecha' | 'imprimir' | 'subir';
interface HeaderProps {
  categoria?: string;
  titulo?: string | null;
  addPath?: string;
  handleOpen?: () => void;
  buttonText?: string;
  buttonIcon?: IconOptions;
  loading?: boolean;
  disabled?: boolean;
  cancelado?: boolean;
  /** roles que pueden ver el botón si no son solo lectura */
  readOnlyRoles?: AppRole[];
  handleSecondaryOpen?: () => void;
  buttonSecondaryIcon?: IconOptions;
  buttonSecondaryText?: string;
}

const Header = ({
  categoria,
  titulo,
  addPath,
  handleOpen,
  buttonText,
  buttonIcon,
  loading,
  disabled,
  readOnlyRoles = [],
  handleSecondaryOpen,
  buttonSecondaryIcon,
  buttonSecondaryText,
  cancelado,
}: HeaderProps): JSX.Element => {
  const icon = {
    añadir: <AddCircleOutlineOutlinedIcon />,
    editar: <EditOutlinedIcon />,
    flecha: <ArrowRightAltIcon />,
    imprimir: <PrintIcon />,
    subir: <CloudUploadOutlinedIcon />,
  };
  const session = useSelector((state: RootState) => state.session);

  return (
    <Box mb={1}>
      <Grid alignItems="center" container justify="space-between" spacing={2}>
        <Grid item>
          {categoria && (
            <Typography component="h2" gutterBottom variant="overline">
              {categoria}
            </Typography>
          )}
          {!loading && titulo ? (
            <Box display="flex" flexDirection="row">
              <Box>
                <Typography component="h1" gutterBottom variant="h5">
                  {titulo}
                </Typography>
              </Box>
              {cancelado && (
                <Box ml={2}>
                  <Chip
                    label={`CANCELAD${titulo
                      .trim()
                      .charAt(titulo.trim().length - 1)
                      .toUpperCase()}`}
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Skeleton height={40} width={200} />
          )}
        </Grid>
        {(addPath || handleOpen) && (
          <>
            {session.roles?.some((role) => {
              return readOnlyRoles.includes(role.role) && !role.readOnly;
            }) && (
              <>
                {addPath && (
                  <Grid item>
                    <Button
                      color="primary"
                      component={RouterLink}
                      disabled={disabled}
                      to={addPath}
                      variant="contained"
                    >
                      Añadir
                    </Button>
                  </Grid>
                )}
              </>
            )}
            {((handleOpen &&
              session.roles?.some(
                (role) => readOnlyRoles.includes(role.role) && !role.readOnly
              )) ||
              (handleOpen &&
                (buttonText === 'Ver estado' ||
                  buttonText === 'Ver corte'))) && (
              <Grid item>
                <Button
                  color="primary"
                  disabled={disabled}
                  onClick={handleOpen}
                  startIcon={buttonIcon && icon[buttonIcon]}
                  variant="contained"
                >
                  {buttonText}
                </Button>
              </Grid>
            )}
            {handleSecondaryOpen && (
              <Grid item>
                <Button
                  color="primary"
                  disabled={disabled}
                  onClick={handleSecondaryOpen}
                  startIcon={buttonSecondaryIcon && icon[buttonSecondaryIcon]}
                  variant="contained"
                >
                  {buttonSecondaryText}
                </Button>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Header;
