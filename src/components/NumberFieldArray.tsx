/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */

import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import {
  MoneyFormat,
  IntegerFormat,
  DecimalFormat,
} from '../utils/TextFieldFormats';

interface NumberFieldArrayProps {
  index: number;
  valueName: string;
  property: string;
  label: string;
  disabled?: boolean;
  moneyFormat?: boolean;
  maxVal?: number;
  allowZero?: boolean;
  decimals?: boolean;
  id?: string;
  handleBlur?: (
    accesor: string,
    val: number,
    mainIndex: number,
    index: number,
    values: any,
    setFieldValue: any
  ) => void;
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
    maxVal,
    handleBlur,
    allowZero,
    id,
    decimals,
  } = props;

  const accesor = `${valueName}.${index}.${property}`;
  const error = get(errors, accesor);
  const value = get(values, accesor);
  const touchedField = get(touched, accesor);
  return (
    <TextField
      // defaultValue={value > 0 ? value : ''}
      disabled={disabled || false}
      error={Boolean(error) && Boolean(touchedField)}
      helperText={error && touchedField ? error : ''}
      id={id || accesor}
      InputProps={
        moneyFormat
          ? { inputComponent: MoneyFormat }
          : decimals
          ? { inputComponent: DecimalFormat }
          : { inputComponent: IntegerFormat }
      }
      inputProps={{ maxLength: 7 }}
      label={label}
      margin="dense"
      name={accesor}
      onBlur={async (e) => {
        const val = parseFloat(e.target.value.replace(/[,$]+/g, '')) || 0;
        if (maxVal) {
          if (val <= maxVal) {
            setFieldValue(accesor, val, false);
          } else {
            setFieldValue(accesor, 0, false);
          }
        } else {
          setFieldValue(accesor, val, false);
        }
        if (handleBlur) {
          await handleBlur(
            accesor,
            val,
            parseInt(valueName.split('.')[1]),
            index,
            values,
            setFieldValue
          );
        }
      }}
      size="small"
      value={allowZero ? value : value > 0 ? value : ''}
      variant="outlined"
    />
  );
};

export default NumberFieldArray;
