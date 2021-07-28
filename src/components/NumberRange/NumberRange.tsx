import InputNumber from 'components/InputNumber/InputNumber';
import 'components/NumberRange/NumberRange.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'core/helpers/debounce';

export interface NumberRangeProps {
  value?: [number | undefined, number | undefined];

  onChange?(value: [number | undefined, number | undefined]);

  onPressEnter?(value);
}

function NumberRange(props: NumberRangeProps) {
  const [translate] = useTranslation();

  const {
    value: [minValue, maxValue] = [undefined, undefined],
    onChange,
    onPressEnter,
  } = props ?? {};

  const handleChangeMinValue = React.useCallback(
    (value: number) => {
      if (typeof onChange === 'function') {
        onChange([value, maxValue]);
      }
    },
    [maxValue, onChange],
  );

  const handleChangeMaxValue = React.useCallback(
    (value: number) => {
      if (typeof onChange === 'function') {
        onChange([minValue, value]);
      }
    },
    [minValue, onChange],
  );

  const handlePressEnterMinValue = React.useCallback(
    debounce((event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && typeof onChange === 'function') {
        onPressEnter(minValue);
      }
    }),
    [onPressEnter, minValue],
  );

  const handlePressEnterMaxValue = React.useCallback(
    debounce((event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && typeof onChange === 'function') {
        onPressEnter(maxValue);
      }
    }),
    [onPressEnter, maxValue],
  );


  return (
    <div className="number-range">
      <InputNumber
        placeholder={translate('general.numberRange.from')}
        value={minValue}
        onChange={handleChangeMinValue}
        onPressEnter={handlePressEnterMinValue} />
      <span className="separator" />
      <InputNumber
        value={maxValue}
        onChange={handleChangeMaxValue}
        placeholder={translate('general.numberRange.to')}
        onPressEnter={handlePressEnterMaxValue} />
    </div>
  );
}

export default NumberRange;
