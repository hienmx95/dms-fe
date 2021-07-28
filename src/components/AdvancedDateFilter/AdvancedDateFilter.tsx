import DatePicker from 'antd/lib/date-picker';
import {
  RangePickerValue,
  DatePickerMode,
} from 'antd/lib/date-picker/interface';
import classNames from 'classnames';
import { DateFilter } from 'core/filters';
import moment, { Moment } from 'moment';
import React, { ComponentProps } from 'react';
import { FilterType } from 'react3l';
import nameof from 'ts-nameof.macro';
import './AdvancedDateFilter.scss';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config/consts';
import locale from 'antd/es/date-picker/locale/da_DK';
import { isDateTimeValue } from 'core/helpers/date-time';

export interface AdvancedDateFilterProps extends ComponentProps<any> {
  filter: DateFilter;
  filterType?: keyof DateFilter | string;
  onChange?(filter: DateFilter);
  placeholder?: string | string[];
  mode?: DatePickerMode;
}

const dateFilterTypes: FilterType<DateFilter>[] = DateFilter.types();

export const DEFAULT_DATETIME_VALUE: string = '0001-01-01T00:00:00';

function AdvancedDateFilter(props: AdvancedDateFilterProps) {
  const {
    filter,
    filterType,
    onChange,
    className,
    placeholder,
    // mode,
  } = props;

  const [type] = React.useState<keyof DateFilter>(
    filterType ?? (dateFilterTypes[0].key as any),
  );

  const handleChangeRange = React.useCallback(
    range => {
      if (range && range.length > 0) {
        const date1: Date = range[0].startOf('day').toDate();
        const date2: Date = range[1].startOf('day').toDate();
        filter.greaterEqual = moment(date1.getTime());
        filter.lessEqual = moment(date2.getTime() + 86399999);
      } else {
        filter.greaterEqual = null;
        filter.lessEqual = null;
      }
      if (onChange) {
        onChange(filter);
      }
    },
    [filter, onChange],
  );

  const handleChange = React.useCallback(
    (value: Moment) => {
      if (value) {
        const date: Date = value.startOf('day').toDate();
        filter.greaterEqual = moment(date.getTime());
        filter.lessEqual = moment(date.getTime() + 86399999);
      } else {
        filter.greaterEqual = null;
        filter.lessEqual = null;
      }
      if (onChange) {
        onChange(filter);
      }
    },
    [filter, onChange],
  );

  return React.useMemo(() => {
    if (type === nameof(filter.range)) {
      if (
        typeof filter.greaterEqual !== 'object' &&
        typeof filter.greaterEqual !== 'undefined'
      ) {
        filter.greaterEqual = moment(filter.greaterEqual);
      }
      if (
        typeof filter.lessEqual !== 'object' &&
        typeof filter.lessEqual !== 'undefined'
      ) {
        filter.lessEqual = moment(filter.lessEqual);
      }
      const dateFilterRange: RangePickerValue = [
        filter.greaterEqual,
        filter.lessEqual,
      ];
      return (
        <DatePicker.RangePicker
          value={dateFilterRange}
          onChange={handleChangeRange}
          className={classNames('advanced-date-filter', className)}
          placeholder={placeholder as [string, string]}
          format={STANDARD_DATE_FORMAT_INVERSE}
        />
      );
    }
    return (
      <DatePicker
        locale={locale}
        value={formatInputDate(filter[type] as Moment)}
        onChange={handleChange}
        className={classNames('advanced-date-filter', className)}
        placeholder={placeholder as string}
        format={STANDARD_DATE_FORMAT_INVERSE}
      />
    );
  }, [className, filter, handleChange, handleChangeRange, placeholder, type]);
}

export function formatInputDate(value: Moment | string | undefined) {
  if (typeof value === 'object') {
    return value;
  }
  if (typeof value === 'string' && value !== DEFAULT_DATETIME_VALUE) {
    /* check whether value is dateTime value, if true return moment instance */
    if (isDateTimeValue(value)) {
      return moment(value);
    }
    return moment(value, STANDARD_DATE_FORMAT_INVERSE);
  }
  return undefined;
}

export default AdvancedDateFilter;
