import React from 'react';
import { DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { Moment } from 'moment';
import Form from 'antd/lib/form';
import { formService } from 'core/services/FormService';
import nameof from 'ts-nameof.macro';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { WorkflowDefinition } from 'models/WorkflowDefinition';

const { Item: FormItem } = Form;
export interface DateFieldInputProps {
  value: string | number | Moment | boolean | undefined;
  index?: number;
  contents?: WorkflowDefinition[];
  setContents?: (v: WorkflowDefinition[]) => void;
  disabled?: boolean;
}
function DateFieldInput(props: DateFieldInputProps) {
  const [translate] = useTranslation();
  const { value, index, contents, setContents, disabled } = props;
  const handleChange = React.useCallback(
    (moment: Moment) => {
      if (contents) {
        contents[index] = { ...contents[index], value: moment };
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
      <DatePicker
        value={typeof value === 'object' ? value : undefined}
        onChange={handleChange}
        className="w-100 mr-3"
        placeholder={translate('eRouteChangeRequests.placeholder.startDate')}
        disabled={disabled}
        format={STANDARD_DATE_FORMAT_INVERSE}
      />
    </FormItem>
  );
}

export default DateFieldInput;
