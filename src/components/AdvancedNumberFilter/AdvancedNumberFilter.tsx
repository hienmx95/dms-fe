import { InputNumber } from 'antd';
import classNames from 'classnames';
import 'components/AdvancedNumberFilter/AdvancedNumberFilter.scss';
import NumberRange from 'components/NumberRange/NumberRange';
import { NumberFilter } from 'core/filters';
import { debounce } from 'core/helpers/debounce';
import React, { ComponentProps, Dispatch, SetStateAction } from 'react';
import nameof from 'ts-nameof.macro';

export interface AdvancedNumberFilterProps extends ComponentProps<any> {
  filter: NumberFilter;

  filterType: keyof NumberFilter | string;

  placeholder?: string;

  onChange?(filter: NumberFilter);
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
}

function AdvancedNumberFilter(props: AdvancedNumberFilterProps) {
  const {
    filter,
    filterType,
    onChange,
    className,
    isReset,
    setIsReset,
    placeholder,
  } = props;

  const handleChangeRange = React.useCallback(
    range => {
      filter.greaterEqual = range[0];
      filter.lessEqual = range[1];
      if (typeof onChange === 'function') {
        onChange(filter);
      }
    },
    [filter, onChange],
  );

  React.useEffect(() => {
    if (isReset) {
      filter[filterType] = undefined;
      if (typeof onChange === 'function') {
        onChange(filter);
      }
      setIsReset(false);
    }
  }, [filter, filterType, isReset, onChange, setIsReset]);

  const handleChange = React.useCallback(
    (value: number | string) => {
      filter[filterType] = value;
      if (typeof onChange === 'function') {
        onChange(filter);
      }
    },
    [filter, filterType, onChange],
  );
  const handlePressEnter = React.useCallback(
    debounce((event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && typeof onChange === 'function') {
        onChange(filter);
      }
    }),
    [filter, onChange],
  );

  if (filterType === nameof(filter.range)) {
    const numberFilterRange: [number | undefined, number | undefined] = [
      filter.greaterEqual,
      filter.lessEqual,
    ];
    return (
      <NumberRange
        value={numberFilterRange}
        onChange={handleChangeRange}
        onPressEnter={handlePressEnter}
      />
    );
  }
  return (
    <InputNumber
      value={filter[filterType] as number}
      onChange={handleChange}
      className={classNames('advanced-string-filter') + ` ${className}`}
      onPressEnter={handlePressEnter}
      placeholder={placeholder}
    />
  );
}

export default AdvancedNumberFilter;
