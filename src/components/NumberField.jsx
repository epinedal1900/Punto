import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, Field } from 'formik';

const NumberField = (props) => {
  const { touched, errors } = useFormikContext();
  const { value, label } = props;

  return (
    <Field
      as={TextField}
      error={errors[value] && touched[value]}
      helperText={errors[value] && touched[value]}
      label={label}
      name={value}
      type="number"
      variant="outlined"
    />
  );
};
export default NumberField;
