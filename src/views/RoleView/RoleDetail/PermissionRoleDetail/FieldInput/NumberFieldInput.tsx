import InputNumber from 'components/InputNumber/InputNumber';
import { PermissionContent } from 'models/PermissionContents';
import React from 'react';
import { Moment } from 'moment';
import Form from 'antd/lib/form';
import { formService } from 'core/services/FormService';
import nameof from 'ts-nameof.macro';
import './NumberFieldInput.scss';

const { Item: FormItem } = Form;

export interface NumberInputProps {
  value?: string | number | Moment | boolean | undefined;
  contents?: PermissionContent[];
  index?: number;
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function NumberFieldInput(props: NumberInputProps) {
  const { value: defaultValue, contents, index, setContents, disabled } = props;

  const handleChange = React.useCallback(
    (value: number) => {
      if (contents) {
        contents[index] = { ...contents[index], value };
        setContents([...contents]);
      }
    },
    [contents, index, setContents],
  );

  return (
    <FormItem
      validateStatus={formService.getValidationStatus<any>(
        contents[index].errors,
        nameof(contents[index].value),
      )}
      help={contents[index].errors?.value}
    >
      <InputNumber
        value={defaultValue ? +defaultValue : 0}
        onChange={handleChange}
        disabled={disabled}
        allowNegative={false}
        min={0}
        className="form-control-sm number-field-input"
      />
    </FormItem>
  );
}

export default NumberFieldInput;
