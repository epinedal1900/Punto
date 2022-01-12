import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';

interface TextFieldProps {
  valueName: string;
  label: string;
  disabled?: boolean;
  minusculas?: boolean;
  mayusculas?: boolean;
  maxLength?: number;
  handleChange?: (s: string) => void;
}

const Field = (props: TextFieldProps): JSX.Element => {
  const {
    valueName,
    label,
    disabled,
    maxLength = 250,
    minusculas,
    mayusculas,
    handleChange,
  } = props;
  const {
    values,
    touched,
    errors,
    handleBlur,
    setFieldValue,
    isSubmitting,
  } = useFormikContext<any>();

  return (
    <TextField
      disabled={disabled || isSubmitting}
      error={touched[valueName] && Boolean(errors[valueName])}
      fullWidth
      helperText={touched[valueName] && errors[valueName]}
      id={valueName}
      inputProps={{ maxLength }}
      label={label}
      name={valueName}
      onBlur={handleBlur}
      onChange={(e) => {
        const val = e.target.value;
        if (handleChange) handleChange(val);
        setFieldValue(
          valueName,
          minusculas ? val.toLowerCase() : mayusculas ? val.toUpperCase() : val,
          false
        );
      }}
      size="small"
      value={values[valueName]}
      variant="outlined"
    />
  );
};

export default Field;
