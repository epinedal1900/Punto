/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, getIn } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';

const AutocompleteFieldArray = (props) => {
  const {
    values,
    setFieldValue,
    initialValues,
    touched,
    errors,
  } = useFormikContext();
  const {
    options,
    getOptionLabel,
    index,
    valueName,
    property,
    label,
    handleChange,
    freeSolo,
    articulos,
    renderOption,
    onBlur,
  } = props;

  return (
    <Autocomplete
      autoHighlight
      disableClearable
      getOptionLabel={getOptionLabel}
      id={`${valueName}.${index}.${property}`}
      name={`${valueName}.${index}.${property}`}
      onBlur={onBlur}
      onChange={(e, value) => {
        setFieldValue(
          `${valueName}.${index}.${property}`,
          value !== null ? value : initialValues.value.property,
          false
        );
        if (handleChange) {
          handleChange(value);
        }
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={
            getIn(errors, `${valueName}.${index}.${property}`) &&
            getIn(touched, `${valueName}.${index}.${property}`)
          }
          helperText={
            getIn(errors, `${valueName}.${index}.${property}`) &&
            getIn(touched, `${valueName}.${index}.${property}`)
              ? getIn(errors, `${valueName}.${index}.${property}`)
              : ''
          }
          label={label}
          margin="dense"
          name={`${valueName}.${index}.${property}`}
          size="small"
          variant="outlined"
        />
      )}
      renderOption={renderOption}
      value={getIn(values, `${valueName}.${index}.${property}`)}
    />
  );
};

export default AutocompleteFieldArray;
