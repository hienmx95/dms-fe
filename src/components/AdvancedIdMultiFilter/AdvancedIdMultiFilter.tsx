import './AdvancedIdMultiFilter.scss';
import SelectMultiWithTag, {
  SelectMultiWithTagProps,
} from 'components/SelectMultiWithTag/SelectMultiWithTag';
import { GuidFilter, IdFilter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import React from 'react';

export enum AdvancedIdMultiFilterType {
  NORMAL,
  SELECTION,
}

export interface AdvancedIdMultiFilterProps<
  T extends Model,
  TModelFilter extends ModelFilter
> extends SelectMultiWithTagProps<T, TModelFilter> {
  filter: IdFilter | GuidFilter;

  filterType?: keyof IdFilter | keyof GuidFilter | string;

  onChange?: any;

  value?: number[] | string[];

  allowClear?: boolean;

  type?: AdvancedIdMultiFilterType;

  selectedIds?: number[] | string[];
}

function AdvancedIdMultiFilter<
  T extends Model,
  TModelFilter extends ModelFilter
>(props: AdvancedIdMultiFilterProps<T, TModelFilter>) {
  const { list, filter, filterType, allowClear, type, selectedIds } = props;

  const onChange: (filter: IdFilter | GuidFilter) => void = props.onChange;

  const handleChange = React.useCallback(
    id => {
      if (
        type === AdvancedIdMultiFilterType.SELECTION &&
        typeof onChange === 'function'
      ) {
        if (+id === 1) onChange({ ...filter, in: undefined, notIn: undefined }); // selectAll
        if (+id === 2)
          onChange({
            ...(filter as IdFilter),
            in: selectedIds as number[],
            notIn: undefined,
          }); // filterSelected
        if (+id === 3)
          onChange({
            ...(filter as IdFilter),
            in: undefined,
            notIn: selectedIds as number[],
          }); // filterSelected
        return;
      }
      filter[filterType] = id;
      if (typeof onChange === 'function') onChange(filter);
    },
    [filter, filterType, onChange, type, selectedIds],
  );

  return (
    <SelectMultiWithTag
      allowClear={allowClear || true}
      {...props}
      list={list}
      onChange={handleChange}
      value={props.value}
    />
  );
}

export default AdvancedIdMultiFilter;
