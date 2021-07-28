import React from 'react';
import { DefaultSelectChange } from 'components/Select/Select';
import { Model } from 'core/models';
import { Switch } from 'antd';

export interface SwitchEnumProps<T> {
  onChange?: DefaultSelectChange<T>;
  checked: boolean;
  list: T[];
  disabled?: boolean;
}

function SwitchStatus<T extends Model>(props: SwitchEnumProps<T>) {
  const { onChange, checked, list, disabled } = props;
  const handleChangeStatus = React.useCallback(
    value => {
      const statusId = value ? 1 : 0;
      const status = list.filter(item => item.id === statusId)[0];

      if (onChange && typeof onChange === 'function') {
        return onChange(statusId, status);
      }
      return;
    },
    [list, onChange],
  );

  return <Switch checked={checked} onChange={handleChangeStatus} disabled={disabled} />;
}

export default SwitchStatus;
