import React from 'react';
import { PermissionContent } from 'models/PermissionContents';
import StringFieldInput from './FieldInput/StringFieldInput';
import NumberFieldInput from './FieldInput/NumberFieldInput';
import IdFieldInput from './FieldInput/IdFieldInput';
import DateFieldInput from './FieldInput/DateFieldInput';
import { Moment } from 'moment';

export interface FieldInputProps {
  value?: string | number | Moment | boolean | undefined;
  index?: number;
  record?: PermissionContent;
  contents?: PermissionContent[];
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function FieldInput(props: FieldInputProps) {
  const { value, index, contents, setContents, disabled } = props;

  const [type, setType] = React.useState<number>(0);
  const [fieldName, setFieldName] = React.useState<string>(undefined);

  React.useEffect(() => {
    if (contents) {
      const fieldTypeId = contents[index].field?.fieldTypeId;
      const fieldName = contents[index].field?.name;
      if (fieldTypeId) {
        setType(fieldTypeId);
      }
      if (fieldName) {
        setFieldName(fieldName);
      }
    }
  }, [contents, index]);

  const renderInput = React.useMemo(() => {
    return () => {
      switch (type) {
        /* singleList */
        case 1:
          return (
            <IdFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              fieldName={fieldName}
              disabled={disabled}
            />
          );
        /* string */
        case 2:
          return (
            <StringFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* Long or decimal */
        case 3 || 4:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* date */
        case 5:
          return (
            <DateFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* double or int */
        case 6 || 7:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* boolean */
        case 8:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
      }
    };
  }, [contents, disabled, fieldName, index, setContents, type, value]);

  return <>{renderInput()}</>;
}

export default FieldInput;
