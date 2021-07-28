import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Field } from 'models/Field';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { CurrenObject } from './LongFieldInput';

export interface StringFilterInputProps {
  item: Field;
  handleList?: (value: string) => void;
  value?: string;
}

function StringFieldInput(props: StringFilterInputProps) {
  const [translate] = useTranslation();
  const { item, handleList, value } = props;
  const [prefix, setPrefix] = React.useState<string>(undefined);
  const [suffix, setSuffix] = React.useState<string>(undefined);

  const [currentObject, setCurrentObject] = React.useState<CurrenObject>({
    key1: null,
    key2: null,
  });

  React.useEffect(() => {
    if (item && value) {
      // debugger;
      const defaultListValue =
        value.length > 0 ? value.split(';') : [undefined, undefined];
      setPrefix(defaultListValue[0]);
      setSuffix(defaultListValue[1]);
    }
  }, [item, value]);

  const fieldMappingsValue = React.useCallback(() => {
    const listValue = [];
    Object.entries(currentObject).forEach(([, value]) => {
      listValue.push(value);
    });
    return listValue.join(';');
  }, [currentObject]);

  const handleChange = React.useCallback(
    (key: string) => {
      return (ev: React.ChangeEvent<HTMLInputElement>) => {
        currentObject[key] = ev.currentTarget.value;
        setCurrentObject(currentObject);
        if (handleList) {
          handleList(fieldMappingsValue());
        }
      };
    },
    [currentObject, fieldMappingsValue, handleList],
  );

  return (
    <>
      {item && (
        <Row>
          <Col lg={12}>
            <FormItem>
              <input
                type="text"
                placeholder={translate('fields.placeholder.stringTypeKey1')}
                onChange={handleChange(nameof(currentObject.key1))}
                className="form-control form-control-sm mt-2 mb-2"
                defaultValue={prefix}
              />
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem>
              <input
                type="text"
                className="form-control form-control-sm mt-2 mb-2 ml-4"
                placeholder={translate('fields.placeholder.stringTypeKey2')}
                onChange={handleChange(nameof(currentObject.key2))}
                defaultValue={suffix}
              />
            </FormItem>
          </Col>
        </Row>
      )}
    </>
  );
}

export default StringFieldInput;
