import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';

interface AutocompleteFieldProps {
  valueName: string;
  label: string;
  getOptionsLabel: (a: any) => string;
  options: any[];
}
const AutocompleteField = (props: AutocompleteFieldProps): JSX.Element => {
  const { valueName, label, getOptionsLabel, options, ...rest } = props;
  const {
    values,
    setFieldValue,
    initialValues,
    touched,
    errors,
  } = useFormikContext<any>();

  return (
    <Autocomplete
      {...rest}
      disableClearable
      getOptionLabel={getOptionsLabel}
      id={valueName}
      onChange={(_e, value) => {
        setFieldValue(
          valueName,
          value !== null ? value : initialValues[valueName]
        );
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={Boolean(touched[valueName]) && Boolean(errors[valueName])}
          helperText={touched[valueName] && errors[valueName]}
          label={label}
          name={valueName}
          size="small"
          variant="outlined"
        />
      )}
      value={values[valueName]}
    />
  );
};

export default AutocompleteField;
