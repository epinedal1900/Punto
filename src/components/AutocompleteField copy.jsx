import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';

const AutocompleteField = (props) => {
  const { valueName, label, getOptionsLabel, options, ...rest } = props;
  const {
    values,
    setFieldValue,
    initialValues,
    touched,
    errors,
  } = useFormikContext();

  return (
    <Autocomplete
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      disableClearable
      getOptionLabel={getOptionsLabel}
      id={valueName}
      name={valueName}
      onChange={(e, value) => {
        setFieldValue(
          valueName,
          value !== null ? value : initialValues[valueName]
        );
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={touched[valueName] && errors[valueName]}
          helperText={touched[valueName] && errors[valueName]}
          label={label}
          name={valueName}
          variant="outlined"
        />
      )}
      value={values[valueName]}
    />
  );
};

export default AutocompleteField;
