import { Select, Spin } from 'antd';
import { OptionProps } from 'antd/lib/select';
import { AxiosError } from 'axios';
import { IdFilter, StringFilter } from 'core/filters';
import { debounce } from 'core/helpers/debounce';
import { limitWord } from 'core/helpers/string';
import { Model, ModelFilter } from 'core/models';
import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import './SelectMultiWithTag.scss';

const { Option } = Select;

export interface SelectOptionProps extends OptionProps {
  [key: string]: any;
}

export interface DefaultOptionValue {
  id?: number;
  name?: string;
  displayName?: string;
  key: string;
  label: string;
}

export interface TAutoCompleteFilter extends ModelFilter {
  id?: IdFilter;
  name?: StringFilter;
  code?: StringFilter;
}

export interface SelectMultiWithTagProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  value?: number[] | string[];

  defaultValue?: number | string | number[];

  children?:
    | ReactElement<SelectOptionProps>
    | ReactElement<SelectOptionProps>[];

  list?: T[];

  getList?: (TModelFilter?: TModelFilter) => Promise<T[]>;

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  searchField?: string;

  searchType?: string;

  allowClear?: boolean;

  disabled?: boolean;

  className?: string;

  onChange?: (value: DefaultOptionValue[]) => void;

  onSearchError?: (error: AxiosError<T>) => void;
  placeholder?: string;
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
  selected?: T[] | DefaultOptionValue[];
  setSelected?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  defaultOptions?: T[];
  dependentField?: string;
  preLoad?: boolean;

  setPreLoad?: Dispatch<SetStateAction<boolean>>;
}
function SelectMultiWithTag<
  T extends Model,
  TModelFilter extends TAutoCompleteFilter
>(props: SelectMultiWithTagProps<T, TModelFilter>) {
  const {
    list: defaultList,
    getList,
    allowClear,
    onChange,
    placeholder,
    onSearchError,
    defaultOptions,
    searchField,
    searchType,
    modelFilter,
    dependentField, // add this to make list item filtered by this field
  } = props;

  const initialFilter: TModelFilter = {
    ...modelFilter,
    id: new IdFilter(),
    name: new StringFilter(),
    code: new StringFilter(),
  };

  const [list, setList] = React.useState<T[]>(defaultList ?? []);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadList, setLoadList] = React.useState<boolean>(false);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [selected, setSelected] = React.useState<DefaultOptionValue[]>([]);
  const [filter, setFilter] = React.useState<TModelFilter>(initialFilter);
  const [preLoad, setPreLoad] = React.useState<boolean>(true);

  const firstLoad = React.useMemo<boolean>(() => {
    if (typeof props.preLoad !== 'undefined') return props.preLoad;
    return preLoad;
  }, [preLoad, props.preLoad]);

  const setFirstLoad = React.useMemo<Dispatch<SetStateAction<boolean>>>(() => {
    if (typeof props.setPreLoad !== 'undefined') return props.setPreLoad;
    return setPreLoad;
  }, [setPreLoad, props.setPreLoad]);

  const handleSetList = React.useCallback(() => {
    if (getList) {
      setLoading(true);
      // set id notIn to filter option
      filter.id.notIn = [...selectedIds];
      if (modelFilter[dependentField]) {
        filter[dependentField] = modelFilter[dependentField]; // add value of dependent field to filter
      }
      getList(filter)
        .then((newList: T[]) => {
          setList(newList);
        })
        .catch(error => {
          if (typeof onSearchError === 'function') {
            onSearchError(error);
          }
        })
        .finally(() => {
          setLoading(false);
          setLoadList(false);
        });
    }
  }, [
    getList,
    filter,
    selectedIds,
    onSearchError,
    dependentField,
    modelFilter,
  ]);

  React.useEffect(() => {
    if (typeof defaultList === 'object' && defaultList instanceof Array) {
      setList(defaultList);
    }
  }, [defaultList, setList]);

  React.useEffect(() => {
    if (loadList) {
      handleSetList();
    }
  }, [handleSetList, loadList]);

  React.useEffect(() => {
    const defaultSelected = [];
    if (props.value && props.value?.length > 0) {
      if (firstLoad) {
        props.value.forEach(value => {
          if (list?.length > 0) {
            const item = list.filter((item: T) => item.id === +value)[0];
            if (item?.name) {
              const newOption: DefaultOptionValue = {
                key: item?.id,
                id: item?.id,
                name: item?.name,
                label: item?.name,
              };
              defaultSelected.push(newOption);
            } else {
              const newOption: DefaultOptionValue = {
                key: item?.id,
                id: item?.id,
                displayName: item?.displayName,
                label: item?.displayName,
              };
              defaultSelected.push(newOption);
            }
            setFirstLoad(false);
          }
          setSelected([...defaultSelected]);
          const defaultSelectedIds = defaultSelected.map((i: T) => i?.id);
          setSelectedIds([...defaultSelectedIds]);
        });
      }
    } else {
      setSelected([]);
      setSelectedIds([]);
    }

    // if (defaultOptions && defaultOptions.length > 0) {
    //   const defaultSelected = defaultOptions.map((i: T) => {
    //     if (i?.name) {
    //       const newOption: DefaultOptionValue = {
    //         key: i?.id,
    //         id: i?.id,
    //         name: i?.name,
    //         label: i?.name,
    //       };
    //       return newOption;
    //     } else {
    //       const newOption: DefaultOptionValue = {
    //         key: i?.id,
    //         id: i?.id,
    //         displayName: i?.displayName,
    //         label: i?.displayName,
    //       };
    //       return newOption;
    //     }
    //   });
    //   setSelected([...defaultSelected]);
    //   const defaultSelectedIds = defaultOptions.map((i: T) => i?.id);
    //   setSelectedIds([...defaultSelectedIds]);
    // }
  }, [defaultOptions, firstLoad, getList, list, props.value, setFirstLoad]);

  // const handleSearch = React.useCallback(
  //   debounce((value: string) => {
  //     if (searchField === 'name') {
  //       filter.name.contain = value;
  //     } else {
  //       filter.code.contain = value;
  //     }
  //     setFilter({ ...filter });
  //     setLoadList(true);
  //   }),
  //   [setFilter, setLoadList],
  // );

  const handleSearch = React.useCallback(
    debounce((value: string) => {
      if (typeof searchType !== 'undefined') {
        filter[searchField] = { [searchType]: value };
      } else {
        filter[searchField] = value;
      }
      setFilter({ ...filter });
      setLoadList(true);
    }),
    [searchType, setFilter, setLoadList], // handleSearch
  );

  const handleChange = React.useCallback(
    (value: DefaultOptionValue[]) => {
      if (onChange) {
        if (value && value.length > 0) {
          let newItems: any[] = [];
          if (searchField === 'name') {
            newItems = value.map(item => {
              item.id = +item.key;
              item.name = limitWord(item.label, 20);
              return item;
            });
          } else {
            newItems = value.map(item => {
              item.id = +item.key;
              item.displayName = limitWord(item.label, 20);
              return item;
            });
          }
          const newItemIds = newItems.map(item => {
            return item.id;
          });
          // set selectedIds
          setSelectedIds([...newItemIds]);
          // set selectedItems
          setSelected([...newItems]);
          // reset name filter, set notIn id filter
          if (searchField === 'name') {
            filter.name.contain = '';
          } else {
            filter.code.contain = '';
          }
          setFilter({ ...filter });
          setLoadList(true);
          return onChange([...newItemIds]);
        } else {
          setSelected([]);
          setSelectedIds([]);
        }
        return onChange([]);
      }
    },
    [filter, onChange, searchField],
  );

  const handleFocus = React.useCallback(() => {
    if (searchField === 'name') {
      filter.name.contain = '';
    } else {
      filter.code.contain = '';
    }
    setFilter({ ...filter });
    setLoadList(true);
  }, [filter, searchField]);

  // const handleRemoveOption = React.useCallback(
  //   (id: number) => {
  //     return () => {
  //       const newSeletedIds = selectedIds.filter(i => i !== id);
  //       setSelectedIds([...newSeletedIds]);
  //       const newSelected = selected.filter(item => item.id !== id);
  //       setSelected([...newSelected]);
  //       setLoadList(true);
  //       onChange([...newSelected]);
  //     };
  //   },
  //   [onChange, selected, selectedIds],
  // );

  return (
    // <div className={classNames(' multi-tag ', `${className}`)}>
    //   {selected.length > 0 &&
    //     selected.map(item => {
    //       return (
    //         <React.Fragment key={item.key ? item.key : item.id}>
    //           <IdSelectedTag item={item} onRemove={handleRemoveOption} />
    //         </React.Fragment>
    //       );
    //     })}

    // </div>
    <Select
      mode="multiple"
      value={selected || []}
      // defaultValue={selected}
      labelInValue
      placeholder={placeholder}
      notFoundContent={loading ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      allowClear={allowClear}
      className={`select-auto-complete select-input-tag`}
      onFocus={handleFocus}
    >
      {list.length > 0 &&
        list.map(d => (
          <Option className="item-option" key={d.id}>
            {d.displayName || d.name}
          </Option>
        ))}
    </Select>
  );
}

export default SelectMultiWithTag;
