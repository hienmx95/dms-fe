import { debounce } from 'core/helpers/debounce';
import { PermissionContent } from 'models/PermissionContents';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moment } from 'moment';
import Form from 'antd/lib/form';
import { formService } from 'core/services/FormService';
import nameof from 'ts-nameof.macro';

const { Item: FormItem } = Form;

export interface StringFieldInputProps {
  value?: string | number | Moment | boolean | undefined;
  contents?: PermissionContent[];
  index?: number;
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function StringFieldInput(props: StringFieldInputProps) {
  const [translate] = useTranslation();
  const { value: defaultValue, contents, index, setContents, disabled } = props;
  const handleChange = React.useCallback(
    debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
      if (contents) {
        contents[index] = { ...contents[index], value: ev.currentTarget.value };
        setContents([...contents]);
      }
    }),
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
      <input
        type="text"
        placeholder={translate('fields.placeholder.stringTypeKey1')}
        onChange={handleChange}
        className="form-control form-control-sm mt-2 mb-2"
        value={`${defaultValue}`}
        disabled={disabled}
      />
    </FormItem>
  );
}

export default StringFieldInput;
