import 'components/AdvancedIdFilter/AdvancedIdFilter.scss';
import { GuidFilter, IdFilter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import React from 'react';
import classNames from 'classnames';

import TreeSelectDropdown, {
  ITreeSelectProps,
} from 'components/TreeSelect/TreeSelect';

export interface AdvancedTreeFilterProps<
  T extends Model,
  TModelFilter extends ModelFilter
> extends ITreeSelectProps<T, TModelFilter> {
  filter: IdFilter | IdFilter[];

  filterType: keyof IdFilter | keyof GuidFilter | string;

  onChange?: any;
}

function AdvancedTreeFilter<T extends Model, TModelFilter extends ModelFilter>(
  props: AdvancedTreeFilterProps<T, TModelFilter>,
) {
  const { list, filter, filterType } = props;

  const onChange: (filter: IdFilter | IdFilter[], node) => void =
    props.onChange;

  const handleChange = React.useCallback(
    (value: number | number[], node) => {
      filter[filterType] = value;
      if (typeof onChange === 'function') {
        onChange(filter, node);
      }
    },
    [filter, filterType, onChange],
  );

  return (
    <TreeSelectDropdown
      {...props}
      list={list}
      onChange={handleChange}
      mode="single"
      className={classNames('advanced-id-filter')}
    />
  );
}

export default AdvancedTreeFilter;
