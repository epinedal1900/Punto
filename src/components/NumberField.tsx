import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, Field } from 'formik';

interface NumberFieldProps {
  value: string;
  label: string;
}
const NumberField = (props: NumberFieldProps): JSX.Element => {
  const { touched, errors } = useFormikContext<any>();
  const { value, label } = props;

  return (
    <Field
      as={TextField}
      error={Boolean(errors[value]) && Boolean(touched[value])}
      helperText={errors[value] && touched[value]}
      label={label}
      name={value}
      size="small"
      type="number"
      variant="outlined"
    />
  );
};
export default NumberField;
