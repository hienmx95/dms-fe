import { Col } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Row from 'antd/lib/row';
import InputNumber from 'components/InputNumber/InputNumber';
import { Field } from 'models/Field';
import { Moment } from 'moment';
import React from 'react';
import nameof from 'ts-nameof.macro';
import './InputStyle.scss';
import { debounce } from 'core/helpers/debounce';

export interface LongFilterInputProps {
  item: Field;
  handleList?: (value: string) => void;
  value?: string;
}
export type CurrenObject = {
  key1: number | string | Moment | null | undefined;
  key2: number | string | Moment | null | undefined;
};
function LongFieldInput(props: LongFilterInputProps) {
  const { item, handleList, value } = props;
  const [currentObject, setCurrentObject] = React.useState<CurrenObject>({
    key1: null,
    key2: null,
  });
  const [prefix, setPrefix] = React.useState<number>(undefined);
  const [suffix, setSuffix] = React.useState<number>(undefined);

  React.useEffect(() => {
    if (item && value) {
      const defaultListValue =
        value.length > 0
          ? value.split(';').map((item: string) => +item)
          : [undefined, undefined];
      setPrefix(defaultListValue[0]);
      setSuffix(defaultListValue[1]);
    }
  }, [item, value]);

  // React.useEffect(() => {console.log(`test prefix`, prefix);}, [prefix]);
  // React.useEffect(() => {console.log(`test suffix`, suffix);}, [suffix]);

  const fieldMappingsValue = React.useCallback(() => {
    const listValue = [];
    Object.entries(currentObject).forEach(([, value]) => {
      listValue.push(value);
    });
    return listValue.join(';');
  }, [currentObject]);

  const handleChange = React.useCallback(
    (key: string) => {
      return debounce((value => {
        currentObject[key] = value;
        setCurrentObject(currentObject);
        if (handleList) {
          handleList(fieldMappingsValue());
        }
      }));
    },
    [currentObject, fieldMappingsValue, handleList],
  );

  return (
    <>
      {item && (
        <Row>
          <Col lg={12}>
            <FormItem className="input-long">
              <InputNumber
                value={prefix}
                allowNegative={false}
                maximumDecimalCount={0}
                min={0}
                onChange={handleChange(nameof(currentObject.key1))}
              />
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem>
              <InputNumber
                value={suffix}
                allowNegative={false}
                maximumDecimalCount={0}
                min={0}
                onChange={handleChange(nameof(currentObject.key2))}
              />
            </FormItem>
          </Col>
        </Row>
      )}
    </>
  );
}

export default LongFieldInput;
