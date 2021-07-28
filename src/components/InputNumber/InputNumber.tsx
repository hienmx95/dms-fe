import AntInputNumber, {
  InputNumberProps as AntInputNumberProps,
} from 'antd/lib/input-number';
import classNames from 'classnames';
import { debounce } from 'core/helpers/debounce';
import React, { ReactText, useRef } from 'react';
import './InputNumber.scss';

interface InputNumberProps {
  value?: number;

  defaultValue?: number;

  onChange?: (event) => void;

  allowNegative?: boolean;

  onlyInteger?: boolean;

  className?: string;

  disabled?: boolean;

  min?: number;

  max?: number;

  step?: number;

  formatter?(x: ReactText): string;
  placeholder?: string;
  minimumDecimalCount?: number;
  maximumDecimalCount?: number;
}

const InputNumber = (props: InputNumberProps & AntInputNumberProps) => {
  const {
    defaultValue,
    step,
    value,
    className,
    disabled,
    min,
    max,
    onChange,
    allowNegative,
    placeholder,
    minimumDecimalCount,
    maximumDecimalCount,
  } = props;

  const ref = useRef<AntInputNumber>(null);

  const isControlled: boolean =
    !props.hasOwnProperty('defaultValue') && props.hasOwnProperty('value');

  const parser = React.useMemo(() => {
    return (x: string) => {
      const result: number = parseFloat(x.split(',').join(''));
      /* decide when we need to append dot */
      if (x.indexOf('.') === x.length - 1) {
        return x;
      }
      if (result < 0) {
        if (allowNegative) {
          return result;
        }
        return undefined;
      }
      if (Number.isNaN(result)) {
        if (x === '-') {
          return x;
        }
        return undefined;
      }
      return result;
    };
  }, [allowNegative]);

  const formatter = React.useCallback(
    (x: ReactText) => {
      let hasDecimalSeperator = false;
      if (x === '-') {
        return x;
      }
      if (typeof x === 'string') {
        /* decide when we need to append dot */
        if (x.indexOf('.') === x.length - 1) {
          hasDecimalSeperator = true;
          return x;
        }
        x = parser(x);
      }
      if (typeof x === 'number') {
        return formatDecimalNumber(
          minimumDecimalCount,
          maximumDecimalCount,
          x,
          hasDecimalSeperator,
        );
      }
      return '';
    },
    [maximumDecimalCount, minimumDecimalCount, parser],
  );

  const handleChange = React.useCallback(
    debounce((value: number | undefined | string) => {
      if (onChange && typeof value === 'string') {
        value = parseFloat(value.split(',').join(''));
        onChange(!Number.isNaN(value) ? value : undefined); // if format return a string, Eg: decimal separation, return parseFloat of its value
        return;
      }
      if (onChange) onChange(typeof value !== 'undefined' ? value : undefined);
    }),
    [onChange],
  );

  return React.useMemo(() => {
    const commonProps = {
      className: classNames(
        'form-control form-control-sm input-number',
        className,
      ),
      disabled,
      max,
      min,
      step,
      formatter,
      parser,
      onChange,
    };

    if (isControlled) {
      return (
        <AntInputNumber
          ref={ref}
          {...commonProps}
          value={value}
          placeholder={placeholder}
          max={max}
          min={min}
          onChange={handleChange}
        />
      );
    }
    return (
      <AntInputNumber
        ref={ref}
        {...commonProps}
        defaultValue={defaultValue}
        placeholder={placeholder}
        max={max}
        min={min}
        onChange={handleChange}
      />
    );
  }, [
    className,
    disabled,
    max,
    min,
    step,
    formatter,
    parser,
    onChange,
    isControlled,
    ref,
    defaultValue,
    placeholder,
    value,
    handleChange,
  ]);
};

InputNumber.defaultProps = {
  allowNegative: true,
  onlyInteger: false,
  step: 1,
  minimumDecimalCount: 0,
  maximumDecimalCount: 3,
};

function formatDecimalNumber(
  minDecimal: number,
  maxDecimal: number,
  value: number,
  hasDecimalSeperator: boolean,
) {
  return (
    Intl.NumberFormat('en', {
      minimumFractionDigits: minDecimal,
      maximumFractionDigits: maxDecimal,
    }).format(value) + `${hasDecimalSeperator ? '.' : ''}`
  );
}

export default InputNumber;
