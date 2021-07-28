import 'components/AdvancedIdFilter/AdvancedIdFilter.scss';
import { GuidFilter, IdFilter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import React from 'react';
import classNames from 'classnames';
import SelectAutoComplete, {
  SelectAutoCompleteProps,
} from 'components/SelectAutoComplete/SelectAutoComplete';

export enum AdvancedIdFilterType {
  NORMAL,
  SELECTION,
}

export interface AdvancedIdFilterProps<
  T extends Model,
  TModelFilter extends ModelFilter
> extends SelectAutoCompleteProps<T, TModelFilter> {
  filter: IdFilter | GuidFilter;

  filterType?: keyof IdFilter | keyof GuidFilter | string;

  onChange?: any;

  value?: string | number;

  allowClear?: boolean;

  type?: AdvancedIdFilterType;

  selectedIds?: number[] | string[];
}

function AdvancedIdFilter<T extends Model, TModelFilter extends ModelFilter>(
  props: AdvancedIdFilterProps<T, TModelFilter>,
) {
  const { list, filter, filterType, allowClear, type, selectedIds } = props;

  const onChange: (filter: IdFilter | GuidFilter) => void = props.onChange;

  const handleChange = React.useCallback(
    (id: string | number) => {
      if (
        type === AdvancedIdFilterType.SELECTION &&
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
    <SelectAutoComplete
      allowClear={allowClear || true}
      {...props}
      list={list}
      onChange={handleChange}
      size="small"
      className={classNames('advanced-id-filter')}
    />
  );
}

export default AdvancedIdFilter;
