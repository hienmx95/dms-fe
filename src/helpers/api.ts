import { STANDARD_DATE_TIME_FORMAT } from 'core/config';
import { isDateTimeValue } from 'core/helpers/date-time';
import moment from 'moment';

export function transformAPIResponseValue(
  value?: string | number | boolean,
): any {
  if (typeof value === 'string' && value.match(/^[^;]+$/)) {
    if (isDateTimeValue(value)) {
      return moment(new Date(value));
    }
  }
  return value;
}

export function transformAPIRequestValue(value?: any): any {
  if (typeof value === 'object' && value !== null) {
    if ('_isAMomentObject' in value && value?._isAMomentObject) {
      return value.format(STANDARD_DATE_TIME_FORMAT);
    }
  }
  return value;
}
