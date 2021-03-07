import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useFormikContext } from 'formik';

import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const TextForm = (props) => {
  const {
    values,
    handleBlur,
    handleChange,
    touched,
    errors,
  } = useFormikContext();
  const { value, lable, icono, ...rest } = props;
  const matches = useMediaQuery('(min-width:600px)');
  const icon = {
    telefono: <PhoneOutlinedIcon />,
    persona: <PersonOutlineOutlinedIcon />,
    correo: <EmailOutlinedIcon />,
    lugar: <LocationOnOutlinedIcon />,
  };
  return (
    <Grid alignItems="center" container justify="flex-end" spacing={1}>
      {icono && (
        <Grid item xs={matches ? 1 : 2}>
          {icon[icono]}
        </Grid>
      )}
      <Grid item xs={matches ? 11 : 10}>
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          error={Boolean(touched[value]) && Boolean(errors[value])}
          fullWidth
          helperText={touched[value] && errors[value]}
          id={value}
          label={lable}
          name={value}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values[value]}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

export default TextForm;
