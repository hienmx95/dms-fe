import locale from 'antd/es/date-picker/locale/da_DK';
import DatePicker from 'antd/lib/date-picker';
import {
  DatePickerMode,
} from 'antd/lib/date-picker/interface';
import classNames from 'classnames';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config/consts';
import { DateFilter } from 'core/filters';
import { isDateTimeValue } from 'core/helpers/date-time';
import moment, { Moment } from 'moment';
import React, { ComponentProps } from 'react';
import { FilterType } from 'react3l';
import nameof from 'ts-nameof.macro';
import './AdvancedRangeFilter.scss';

export interface AdvancedRangeFilterProps extends ComponentProps<any> {
  filter: DateFilter;
  filterType?: keyof DateFilter | string;
  onChange?(filter: DateFilter);
  placeholder?: string | string[];
  mode?: DatePickerMode;
  disabledDate?: (current: Moment) => boolean;
}

const dateFilterTypes: FilterType<DateFilter>[] = DateFilter.types();

export const DEFAULT_DATETIME_VALUE: string = '0001-01-01T00:00:00';

function AdvancedRangeFilter(props: AdvancedRangeFilterProps) {
  const {
    filter,
    filterType,
    onChange,
    className,
    placeholder,
    disabledDate,
    // mode,
  } = props;


  const [dateFilter, setDateFiter] = React.useState<DateFilter>(new DateFilter());

  React.useEffect(() => {
    setDateFiter({ ...filter });
  }, [filter]);

  const [type] = React.useState<keyof DateFilter>(
    filterType ?? (dateFilterTypes[0].key as any),
  );


  // const handleChangeRange = React.useCallback(
  //   range => {
  //     if (range && range.length > 0) {
  //       const date1: Date = range[0].startOf('day').toDate();
  //       const date2: Date = range[1].startOf('day').toDate();
  //       filter.greaterEqual = moment(date1.getTime());
  //       filter.lessEqual = moment(date2.getTime() + 86399999);
  //     } else {
  //       filter.greaterEqual = null;
  //       filter.lessEqual = null;
  //     }
  //     if (onChange) {
  //       onChange(filter);
  //     }
  //   },
  //   [filter, onChange],
  // );

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

  const handleChangeStartDate = React.useCallback(
    (value: Moment) => {
      if (value) {
        const date: Date = value.startOf('day').toDate();
        filter.greaterEqual = moment(date.getTime());
        setDateFiter({ ...filter });
        filter.lessEqual = null;
      } else {
        filter.greaterEqual = null;
        filter.lessEqual = null;
        setDateFiter({ ...filter });
      }
      if (onChange) {
        onChange(filter);
      }
    },
    [filter, onChange]);

  const handleChangeEndDate = React.useCallback((value: Moment) => {
    if (value) {
      const date: Date = value.startOf('day').toDate();
      filter.lessEqual = moment(date.getTime() + 86399999);
      setDateFiter({ ...filter });
    }
    else {
      filter.lessEqual = null;
      setDateFiter({ ...filter });
    }

    if (onChange) {
      onChange(filter);
    }
  }, [filter, onChange]);
  return React.useMemo(() => {
    if (type === nameof(filter.range)) {

      if (
        typeof filter.greaterEqual !== 'object' &&
        typeof filter.greaterEqual !== 'undefined'
      ) {
        filter.greaterEqual = moment(dateFilter.greaterEqual);
      }
      if (
        typeof filter.lessEqual !== 'object' &&
        typeof filter.lessEqual !== 'undefined'
      ) {
        filter.lessEqual = moment(dateFilter.lessEqual);
      }

      return (
        <div className="d-flex align-items-center">
          <DatePicker
            locale={locale}
            value={formatInputDate((dateFilter.greaterEqual))}
            onChange={handleChangeStartDate}
            className={classNames('advanced-date-filter', className)}
            placeholder={(placeholder && placeholder[0] as string) || null}
            format={STANDARD_DATE_FORMAT_INVERSE}
            disabledDate={disabledDate}
          />
          <span className="mr-2 ml-2">-</span>
          <DatePicker
            locale={locale}
            value={formatInputDate((dateFilter.lessEqual))}
            onChange={handleChangeEndDate}
            className={classNames('advanced-date-filter', className)}
            placeholder={(placeholder && placeholder[1] as string) || null}
            format={STANDARD_DATE_FORMAT_INVERSE}
            disabledDate={disabledDate}
            disabled={!dateFilter.greaterEqual}
          />
        </div>
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
  }, [type, filter, handleChange, className, placeholder, dateFilter, handleChangeStartDate, handleChangeEndDate, disabledDate]);
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

export default AdvancedRangeFilter;
