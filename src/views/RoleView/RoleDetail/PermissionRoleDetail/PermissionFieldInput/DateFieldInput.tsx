import { DatePicker, Row } from 'antd';
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import FormItem from 'antd/lib/form/FormItem';
import {
  STANDARD_DATE_FORMAT_INVERSE,
  STANDARD_DATE_TIME_FORMAT,
} from 'core/config';
import { isDateTimeValue } from 'core/helpers/date-time';
import { Field } from 'models/Field';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './InputStyle.scss';
import { CurrenObject } from './LongFieldInput';

export interface DateFilterInputProps {
  item: Field;
  handleList?: (value: string) => void;
  value?: string;
}

function DateFieldInput(props: DateFilterInputProps) {
  const [translate] = useTranslation();
  const { item, handleList, value } = props;
  const [rangeValue, setRangeValue] = React.useState<RangePickerValue>([
    undefined,
    undefined,
  ]);

  const [currentObject, setCurrentObject] = React.useState<CurrenObject>({
    key1: null,
    key2: null,
  });

  React.useEffect(() => {
    if (item && value) {
      // convert value from string to list of local time
      const defaultListTime =
        value.length > 0
          ? value.split(';').map((i: string) => {
              if (isDateTimeValue(i)) {
                return moment(new Date(i));
              }
              return undefined;
            })
          : [undefined, undefined];

      setRangeValue([defaultListTime[0], defaultListTime[1]]);
    }
  }, [item, value]);
  const fieldMappingsValue = React.useCallback(() => {
    const listValue = [];
    Object.entries(currentObject).forEach(([, value]) => {
      listValue.push(value);
    });
    return listValue.join(';');
  }, [currentObject]);

  const handleChangeRange = React.useCallback(
    (range: any) => {
      const newRange = range.map(item => {
        if ('_isAMomentObject' in item && item?._isAMomentObject) {
          return item.format(STANDARD_DATE_TIME_FORMAT);
        }
        return item;
      });
      currentObject.key1 = newRange[0];
      currentObject.key2 = newRange[1];
      setCurrentObject(currentObject);
      if (handleList) {
        handleList(fieldMappingsValue());
      }
    },
    [currentObject, fieldMappingsValue, handleList],
  );

  return (
    <>
      {item && (
        <Row>
          <FormItem className="input-date">
            <DatePicker.RangePicker
              value={rangeValue}
              onChange={handleChangeRange}
              className={'advanced-date-filter'}
              placeholder={[
                translate('fields.placeholder.dateTypeKey1'),
                translate('fields.placeholder.dateTypeKey2'),
              ]}
              format={STANDARD_DATE_FORMAT_INVERSE}
            />
          </FormItem>
        </Row>
      )}
    </>
  );
}

export default DateFieldInput;
