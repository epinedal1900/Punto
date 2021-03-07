import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, getIn } from 'formik';
import { MoneyFormat, IntegerFormat } from '../utils/TextFieldFormats';

const NumberFieldArray = (props) => {
  const { values, touched, errors, setFieldValue } = useFormikContext();
  const { index, valueName, property, label, disabled, moneyFormat } = props;

  const accesor = `${valueName}.${index}.${property}`;
  const error = getIn(errors, accesor);
  const value = getIn(values, accesor);
  const touchedField = getIn(touched, accesor);
  return (
    <TextField
      // defaultValue={value > 0 ? value : ''}
      disabled={disabled || false}
      error={error && touchedField}
      helperText={error && touchedField ? error : ''}
      id={accesor}
      InputProps={
        moneyFormat
          ? { inputComponent: MoneyFormat }
          : { inputComponent: IntegerFormat }
      }
      inputProps={{ maxLength: 7 }}
      label={label}
      margin="dense"
      name={accesor}
      onBlur={(e) => {
        const val = parseFloat(e.target.value.replace(/[,$]+/g, '')) || 0;
        setFieldValue(accesor, val, false);
      }}
      size="small"
      value={value > 0 ? value : ''}
      variant="outlined"
    />
  );
};
export default NumberFieldArray;
