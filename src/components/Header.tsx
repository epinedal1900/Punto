import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Skeleton from '@material-ui/lab/Skeleton';
import PrintIcon from '@material-ui/icons/Print';
import { useSelector } from 'react-redux';

import { Link as RouterLink } from 'react-router-dom';
import { AppRole, Role, Session } from '../types/types';
import { RootState } from '../types/store';

interface HeaderProps {
  categoria?: string;
  titulo: string;
  addPath?: string;
  handleOpen?: () => Promise<void> | void;
  buttonText?: string;
  buttonIcon?: 'añadir' | 'editar' | 'flecha' | 'imprimir';
  loading?: boolean;
  disabled?: boolean;
  readOnlyRoles?: AppRole[];
}
const Header = (props: HeaderProps): JSX.Element => {
  const {
    categoria,
    titulo,
    addPath,
    handleOpen,
    buttonText,
    buttonIcon,
    loading,
    disabled,
    readOnlyRoles = [],
  } = props;
  const icon = {
    añadir: <AddCircleOutlineOutlinedIcon />,
    editar: <EditOutlinedIcon />,
    flecha: <ArrowRightAltIcon />,
    imprimir: <PrintIcon />,
  };
  const session: Session = useSelector((state: RootState) => state.session);

  return (
    <Grid alignItems="center" container justify="space-between" spacing={3}>
      <Grid item>
        {categoria && (
          <Typography component="h2" gutterBottom variant="overline">
            {categoria}
          </Typography>
        )}
        {!loading ? (
          <Typography component="h1" gutterBottom variant="h4">
            {titulo}
          </Typography>
        ) : (
          <Skeleton height={40} width={200} />
        )}
      </Grid>
      {(addPath || handleOpen) && (
        <>
          {JSON.parse(session.roles).some((role: Role) => {
            return (
              readOnlyRoles.includes(role.role) && role.readOnly === 'false'
            );
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
          {handleOpen && (
            <Grid item>
              <Button
                color="primary"
                disabled={disabled}
                onClick={handleOpen}
                startIcon={buttonIcon ? icon[buttonIcon] : undefined}
                variant="contained"
              >
                {buttonText}
              </Button>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};
Header.defaultProps = {
  readOnlyRoles: [],
};

export default Header;
