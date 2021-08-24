/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import NumberFormat from 'react-number-format';

export const MoneyFormat = (props: any) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      allowNegative={false}
      getInputRef={inputRef}
      isNumericString
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      prefix="$"
      thousandSeparator
    />
  );
};

export const IntegerFormat = (props: any) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      allowNegative={false}
      decimalSeparator={null}
      getInputRef={inputRef}
      isNumericString
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
};

export const DecimalFormat = (props: any) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      allowNegative={false}
      getInputRef={inputRef}
      isNumericString
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
};
export const DigitsFormat = (props: any) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      allowLeadingZeros
      allowNegative={false}
      decimalSeparator={null}
      getInputRef={inputRef}
      isNumericString
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
};
