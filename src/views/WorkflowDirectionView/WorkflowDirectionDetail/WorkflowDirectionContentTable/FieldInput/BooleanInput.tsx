import React from 'react';
import Switch from 'components/Switch/Switch';
import { WorkflowDefinition } from 'models/WorkflowDefinition';

export interface BooleanInputProps {
  value?: boolean;
  index?: number;
  contents?: WorkflowDefinition[];
  setContents?: (v: WorkflowDefinition[]) => void;
}

function BooleanInput(props: BooleanInputProps) {
  const { value, index, contents, setContents } = props;

  const [statusList] = React.useState<any[]>([
    { id: 0, value: false },
    { id: 1, value: true },
  ]);

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
    <Switch
      checked={value === statusList[1]?.id ? true : false}
      list={statusList}
      onChange={handleChange}
    />
  );
}
