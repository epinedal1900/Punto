/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, getIn } from 'formik';
import {
  MoneyFormat,
  IntegerFormat,
  NegativeIntegerFormat,
} from '../utils/TextFieldFormats';

interface NumberFieldArrayProps {
  index: number;
  valueName: string;
  property: string;
  label: string;
  disabled?: boolean;
  moneyFormat?: boolean;
  allowNegative?: boolean;
}
const NumberFieldArray = (props: NumberFieldArrayProps): JSX.Element => {
  const { values, touched, errors, setFieldValue } = useFormikContext<any>();
  const {
    index,
    valueName,
    property,
    label,
    disabled,
    moneyFormat,
    allowNegative,
  } = props;

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
          : allowNegative
          ? { inputComponent: NegativeIntegerFormat }
          : { inputComponent: IntegerFormat }
      }
      inputProps={{ maxLength: 7 }}
      label={label}
      margin="dense"
      name={accesor}
      onChange={(e) => {
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
