import { Select } from 'antd';
import AntSelect, {
  OptionProps,
  SelectProps as AntSelectProps,
} from 'antd/lib/select';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { debounce } from 'core/helpers/debounce';
import { Model, ModelFilter } from 'core/models';
import React, { Dispatch, ReactElement, Ref, SetStateAction } from 'react';
import './SelectAutoComplete.scss';

const { Option } = AntSelect;

export interface SelectOptionProps<T extends Model> extends OptionProps {
  'data-content': T;

  [key: string]: any;
}

export type DefaultSelectChange<T extends Model> = (
  value: string | number,
  subject?: T,
) => void;

export interface SelectAutoCompleteProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  value?: number | string;

  defaultValue?: number | string;

  children?:
    | ReactElement<SelectOptionProps<T>>
    | ReactElement<SelectOptionProps<T>>[];

  list?: T[];

  getList?: (TModelFilter?: TModelFilter) => Promise<T[]>;

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  searchField?: string;

  searchType?: string;

  allowClear?: boolean;

  disabled?: boolean;

  className?: string;

  onChange?: DefaultSelectChange<T>;

  onSearchError?: (error: AxiosError<T>) => void;

  render?: (t: T) => string;

  placeholder?: string;

  isReset?: boolean;

  setIsReset?: Dispatch<SetStateAction<boolean>>;

  preLoad?: boolean;

  setPreLoad?: Dispatch<SetStateAction<boolean>>;
}

const SelectAutoComplete = React.forwardRef(
  <T extends Model, TModelFilter extends ModelFilter>(
    props: SelectAutoCompleteProps<T, TModelFilter> & AntSelectProps,
    ref: Ref<any>,
  ) => {
    const {
      modelFilter,
      setModelFilter,
      className,
      getList,
      onSearchError,
      allowClear,
      onChange,
      searchField,
      searchType,
      defaultValue,
      render,
      placeholder,
      isReset,
      setIsReset,
      disabled,
    } = props;

    const [list, setList] = React.useState<T[]>([]);
    const [, setLoading] = React.useState<boolean>(false);
    const [loadList, setLoadList] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string | number>(undefined);
    const [preLoad, setPreLoad] = React.useState<boolean>(true);

    const firstLoad = React.useMemo<boolean>(() => {
      if (typeof props.preLoad !== 'undefined') return props.preLoad;
      return preLoad;
    }, [preLoad, props.preLoad]);

    const setFirstLoad = React.useMemo<
      Dispatch<SetStateAction<boolean>>
    >(() => {
      if (typeof props.setPreLoad !== 'undefined') return props.setPreLoad;
      return setPreLoad;
    }, [setPreLoad, props.setPreLoad]);

    const fetchList = React.useCallback(
      (firstLoad: boolean = false, callback?: (items: T[]) => void) => {
        if (typeof getList === 'function') {
          setLoading(true);
          getList(
            firstLoad
              ? {
                  ...modelFilter,
                  id: {
                    equal: props.value,
                  },
                }
              : modelFilter,
          )
            .then((newList: T[]) => {
              setList(newList);
              if (typeof callback === 'function') callback(newList);
            })
            .catch(error => {
              if (typeof onSearchError === 'function') {
                onSearchError(error);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
      [getList, setList, modelFilter, onSearchError, props.value],
    );

    const updateValue = React.useCallback((item: T) => {
      setValue(typeof item.name !== 'undefined' ? item.name : item.displayName);
    }, []); // updateValue

    const handleResetFilter = React.useCallback(() => {
      if (setModelFilter) {
        setModelFilter({
          ...modelFilter,
          [searchField]: searchType ? { [searchType]: undefined } : undefined,
        });
      }
    }, [modelFilter, searchField, searchType, setModelFilter]); // resetFilter

    React.useEffect(() => {
      if (props.list?.length > 0) setList(props.list); // set enum list
      if (
        firstLoad &&
        typeof props.value !== 'undefined' &&
        props.list?.length > 0
      ) {
        findDefaultItem(props.list, props.value, updateValue); // default value from props.list
        setFirstLoad(false);
        return;
      } // first priority list for enum
      if (
        firstLoad &&
        typeof props.value !== 'undefined' &&
        typeof modelFilter !== 'undefined' &&
        typeof getList === 'function'
      ) {
        fetchList(true, list =>
          findDefaultItem(list, props.value, updateValue),
        ); // default value from get list, if props.list is undefined
        setFirstLoad(false);
        return;
      } // second priority list
    }, [
      firstLoad,
      setFirstLoad,
      fetchList,
      getList,
      modelFilter,
      props.list,
      props.value,
      updateValue,
    ]);

    React.useEffect(() => {
      if (isReset) {
        handleResetFilter();
        setValue(undefined);
        setIsReset(false);
      }
    }, [handleResetFilter, isReset, setIsReset]); // effect when clicking cancelFilter button or focusing

    React.useEffect(() => {
      if (loadList) {
        setLoadList(false);
        setFirstLoad(false); // turn of firstLoad mode for avoiding duplicate call fetch
        fetchList();
      }
    }, [fetchList, loadList, setFirstLoad]); // effect when focusing or searching

    const handleFocus = React.useCallback(() => {
      handleResetFilter();
      setLoadList(true);
    }, [handleResetFilter]); // handleFocus

    const handleSearch = React.useCallback(
      (value: string) => {
        if (typeof searchType !== 'undefined') {
          modelFilter[searchField] = { [searchType]: value };
        } else {
          modelFilter[searchField] = value;
        }
        setModelFilter({
          ...modelFilter,
        });
        setLoadList(true);
      },
      [modelFilter, searchField, searchType, setModelFilter], // handleSearch
    );

    const handleChange = React.useCallback(
      (value: number | string, option?: ReactElement<SelectOptionProps<T>>) => {
        handleResetFilter();
        if (
          typeof onChange === 'function' &&
          typeof value !== 'undefined' &&
          option
        ) {
          let displayValue = null;
          if (option.props['data-content'].name) {
            displayValue = option.props['data-content'].name;
          }
          if (option.props['data-content'].displayName) {
            displayValue = option.props['data-content'].displayName;
          }
          setValue(displayValue);
          onChange(value, option.props['data-content']);
          return;
        }
        setValue(undefined);
        onChange(undefined, undefined);
      },
      [onChange, handleResetFilter],
    );

    const options = React.useMemo(() => {
      const el = list.map((t: T) => (
        <Option key={t?.id} data-content={t}>
          {render(t)}
        </Option>
      ));
      return el;
    }, [list, render]);

    return (
      <>
        <Select
          ref={ref}
          showSearch={typeof getList === 'function'}
          placeholder={placeholder}
          optionFilterProp="children"
          onChange={handleChange}
          onFocus={handleFocus}
          onSearch={debounce(handleSearch)}
          allowClear={allowClear}
          className={classNames('select-auto-complete', className)}
          defaultValue={defaultValue}
          value={value}
          mode="default"
          disabled={disabled}
          data-toggle="tooltip"
          suffixIcon={<i className="tio tio-chevron_down"></i>}
          filterOption={false}
        >
          {options}
        </Select>
      </>
    );
  },
);

SelectAutoComplete.defaultProps = {
  allowClear: true,
  render<T extends Model>(t: T) {
    return t?.name || t?.displayName;
  },
};

function findDefaultItem<T extends Model>(
  list: T[],
  value: number | string,
  callback?: (item: T) => void,
) {
  if (list?.length > 0) {
    const item = list.filter((item: T) => item.id === +value)[0];
    if (typeof item !== 'undefined' && typeof callback === 'function') {
      callback(item);
    }
  }
}

export default SelectAutoComplete;
