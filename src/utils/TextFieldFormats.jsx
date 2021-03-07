/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import NumberFormat from 'react-number-format';

export const MoneyFormat = (props) => {
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
export const IntegerFormat = (props) => {
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

export const DigitsFormat = (props) => {
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
    />
  );
};
