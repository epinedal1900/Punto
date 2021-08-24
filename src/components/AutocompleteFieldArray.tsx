/* eslint-disable no-unused-vars */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import get from 'lodash/get';

interface AutocompleteFieldArrayProps {
  options: any[];
  getOptionLabel: (option: any) => string;
  index: number;
  valueName: string;
  property: string;
  label: string;
  handleChange?: (value: any, index: any) => void;
  freeSolo?: boolean;
  articulos?: boolean;
}

const AutocompleteFieldArray = (
  props: AutocompleteFieldArrayProps
): JSX.Element => {
  const {
    values,
    setFieldValue,
    initialValues,
    touched,
    errors,
  } = useFormikContext<any>();
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
  } = props;

  const accesor = `${valueName}.${index}.${property}`;
  const error = get(errors, accesor);
  const value = get(values, accesor);
  const touchedField = get(touched, accesor);
  return (
    <Autocomplete
      autoHighlight
      disableClearable
      freeSolo={freeSolo}
      getOptionLabel={getOptionLabel}
      id={accesor}
      onBlur={
        articulos && freeSolo
          ? async (e: any) => {
              setFieldValue(
                accesor,
                e.target.value.split(':')[1]
                  ? e.target.value.split(':')[1].trim()
                  : e.target.value,
                false
              );
            }
          : undefined
      }
      onChange={(_e: any, v) => {
        setFieldValue(
          accesor,
          v !== null ? v : initialValues.value.property,
          false
        );
        if (handleChange) {
          handleChange(v, index);
        }
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={Boolean(error) && Boolean(touchedField)}
          helperText={error && touchedField ? error : ''}
          label={label}
          margin="dense"
          name={accesor}
          size="small"
          variant="outlined"
        />
      )}
      value={value}
    />
  );
};

export default AutocompleteFieldArray;
