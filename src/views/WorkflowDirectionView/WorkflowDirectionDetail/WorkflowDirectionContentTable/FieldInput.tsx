import React from 'react';
import { Moment } from 'moment';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import IdFieldInput from './FieldInput/IdFieldInput';
import StringFieldInput from './FieldInput/StringFieldInput';
import NumberFieldInput from './FieldInput/NumberFieldInput';
import DateFieldInput from './FieldInput/DateFieldInput';

export interface FieldInputProps {
  value?: string | number | Moment | boolean | undefined;
  index?: number;
  record?: WorkflowDefinition;
  contents?: WorkflowDefinition[];
  setContents?: (v: WorkflowDefinition[]) => void;
  disabled?: boolean;
}

function FieldInput(props: FieldInputProps) {
  const { value, index, contents, setContents, disabled } = props;

  const [type, setType] = React.useState<number>(0);
  const [workflowparameterName, setWorkflowParameterName] = React.useState<string>(undefined);

  React.useEffect(() => {
    if (contents) {
      const workflowParameterTypeId = contents[index].workflowParameter?.workflowParameterTypeId;
      const workflowParameterName = contents[index].workflowParameter?.code;
      if (workflowParameterTypeId) {
        setType(workflowParameterTypeId);
      }
      if (workflowParameterName) {
        setWorkflowParameterName(workflowParameterName);
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
              fieldName={workflowparameterName}
              disabled={disabled}
            />
          );
        /* string */
        case 2:
          return (
            <StringFieldInput
              value={value as string}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* Long or decimal */
        case 3:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        case 4:
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
      }
    };
  }, [contents, disabled, workflowparameterName, index, setContents, type, value]);

  return <>{renderInput()}</>;
}

export default FieldInput;
