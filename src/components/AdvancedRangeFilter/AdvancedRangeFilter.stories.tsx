import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/theme/monokai.css';
import { DateFilter } from 'core/filters';
import React from 'react';
import nameof from 'ts-nameof.macro';
import AdvancedRangeFilter from './AdvancedRangeFilter';
import { Moment } from 'moment';
import { formatDate } from 'core/helpers/date-time';
import { translate } from 'core/helpers/internationalization';

export default {
  title: nameof(AdvancedRangeFilter),
};


export function Examples() {
  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );
  const [date, setDate] = React.useState<Moment[]>([]);

  const handleChange = React.useCallback(
    (event) => {
      // setType(event.target.value as InputType);
      dateFilter.greaterEqual = event?.greaterEqual;
      dateFilter.lessEqual = event?.lessEqual;
      const startDate = event?.greaterEqual;
      const endDate = event?.lessEqual;
      setDate([startDate, endDate]);
      setDateFilter({
        ...dateFilter,
      });
    },
    [dateFilter, setDateFilter, setDate],
  );

  // khi chọn ngày bắt đầu, thì ngày kết thúc chi duoc chon trong ngay bắt đầu và kết thúc của tháng
  // const disabledDate = React.useCallback(
  //   (current) => {
  //     if (date[0]) {
  //       if (!dateFilter.greaterEqual) {
  //         return false;
  //       }
  //       const endOfMonth = date[0].clone().endOf('month');
  //       const startOfMonth = date[0].clone().startOf('month');
  //       const currentDate = current.clone();
  //       return currentDate.valueOf() < startOfMonth || currentDate.valueOf() > endOfMonth;
  //     }
  //     return false;
  //   }, [dateFilter, date]);


  // chọn trong vòng 7 ngày
  const disabledDate = React.useCallback(
    (current) => {
      if (date[0]) {
        if (!dateFilter.greaterEqual) {
          return false;
        }
        const currentDate = current.clone();
        const tooLate = date[0] && currentDate.diff(date[0], 'day') > 7;

        const tooEarly = currentDate && currentDate.diff(date[0], 'day') <= 0;
        return tooLate || tooEarly;
      }
      return false;
    }, [dateFilter, date]);



  return (
    <>
      <AdvancedRangeFilter
        filter={dateFilter}
        filterType={nameof(dateFilter.range)}
        onChange={handleChange}
        disabledDate={disabledDate}
        placeholder={[
          translate('eRoutes.placeholder.startDate'),
          translate('eRoutes.placeholder.endDate'),
        ]}
      />
      {/* <CodeMirror value={types[type].toString()} options={{theme: 'monokai', mode: 'text/typescript-jsx'}}/> */}
    </>
  );
}
