import { TreeSelect } from 'antd';
import { AxiosError } from 'axios';
import { debounce } from 'core/helpers/debounce';
import { Model, ModelFilter } from 'core/models';
import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import './TreeSelect.scss';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';

export type TreeSelectMode = 'single' | 'multiple';

export interface ITreeSelectProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  mode: TreeSelectMode;

  onlyLeaf?: boolean;

  defaultValue?: any;

  value?: number | number[];

  onChange?: (value: number | number[], node?) => void;

  treeCheckable?: boolean;

  allowClear?: boolean;

  treeDefaultExpandAll?: boolean;

  getList?: (TModelFilter?: TModelFilter) => Promise<T[]>;

  list?: T[];

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  onSearchError?: (error: AxiosError<T>) => void;

  searchField?: string;

  placeholder?: string;

  disabled?: boolean;

  className?: string;
}

const { TreeNode } = TreeSelect;

const TreeSelectDropdown = React.forwardRef(
  <T extends Model, TModelFilter extends ModelFilter>(
    props: ITreeSelectProps<T, TModelFilter>,
    ref: React.Ref<any>,
  ) => {
    const {
      modelFilter,
      setModelFilter,
      treeCheckable,
      treeDefaultExpandAll,
      allowClear,
      defaultValue,
      onlyLeaf,
      onChange,
      mode,
      getList,
      list: defaultList,
      onSearchError,
      searchField,
      placeholder,
      disabled,
      className,
    } = props;

    const multiple: boolean = mode === 'multiple';

    const isControlled: boolean = props.hasOwnProperty('value');

    const [list, setList] = React.useState<T[]>(defaultList ?? []);

    const [, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (typeof defaultList === 'object' && defaultList instanceof Array) {
        setList(defaultList);
      }
    }, [defaultList]);

    const handleLoadList = React.useCallback(async () => {
      try {
        setLoading(true);
        setList(await getList(modelFilter));
      } catch (error) {
        if (typeof onSearchError === 'function') {
          onSearchError(error);
        }
      }
      setLoading(false);
    }, [getList, onSearchError, modelFilter]);

    React.useEffect(() => {
      handleLoadList();
    }, [handleLoadList]);

    const handleToggle = React.useCallback(
      async (visible: boolean) => {
        if (visible && typeof getList === 'function') {
          await handleLoadList();
        }
      },
      [getList, handleLoadList],
    );
    const renderItemTree = React.useCallback(
      listData => {
        return listData.map((item: any) => (
          <TreeNode
            key={item.id}
            value={item.id}
            title={
              window.innerWidth < 1920 ? (
                <Tooltip
                  title={
                    item.name
                      ? item.name
                      : item.displayName
                      ? item.displayName
                      : ''
                  }
                >
                  {limitWord(
                    item.name
                      ? item.name
                      : item.displayName
                      ? item.displayName
                      : '',
                    30,
                  )}
                </Tooltip>
              ) : (
                <Tooltip
                  title={
                    item.name
                      ? item.name
                      : item.displayName
                      ? item.displayName
                      : ''
                  }
                >
                  {limitWord(
                    item.name
                      ? item.name
                      : item.displayName
                      ? item.displayName
                      : '',
                    55,
                  )}
                </Tooltip>
              )
            }
            disabled={onlyLeaf && (!item.children || item.children.length > 0)}
            data-content={item}
          >
            {item.children && renderItemTree(item.children)}
          </TreeNode>
        ));
      },
      [onlyLeaf],
    );
    const handleSearch = React.useMemo(
      () =>
        debounce((value: string) => {
          setModelFilter(
            ModelFilter.clone<TModelFilter>({
              ...modelFilter,
              [searchField]: value,
            }),
          );
        }),
      [modelFilter, searchField, setModelFilter],
    );

    const handleControlledChange = React.useCallback(
      (...[newValue, , extra]: [number | number[], any, any]) => {
        if (mode === 'single') {
          if (onChange) {
            onChange(
              newValue,
              newValue ? extra.triggerNode.props['data-content'] : undefined,
            );
          }
          return;
        }
        if (treeCheckable) {
          if (onChange) {
            onChange(newValue);
          }
          return;
        }
        if (onChange) {
          if ((newValue as number[]).length === 0) {
            onChange([], []);
            return;
          }
          onChange(newValue, extra.triggerNode.props['data-content']);
        }
      },
      [mode, onChange, treeCheckable],
    );

    const renderTree = React.useCallback(
      (list, value: number | number[], handleChange) => {
        return (
          <TreeSelect
            ref={ref}
            multiple={multiple}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onDropdownVisibleChange={handleToggle}
            treeCheckable={treeCheckable}
            allowClear={allowClear}
            treeDefaultExpandAll={treeDefaultExpandAll}
            onSearch={handleSearch}
            placeholder={placeholder}
            disabled={disabled}
            className={classNames('select-auto-complete', className)}
            suffixIcon={
              <i className="tio tio-chevron_down ant-select-arrow-icon"></i>
            }
          >
            {renderItemTree(list)}
          </TreeSelect>
        );
      },
      [
        ref,
        multiple,
        defaultValue,
        handleToggle,
        treeCheckable,
        allowClear,
        treeDefaultExpandAll,
        handleSearch,
        renderItemTree,
        placeholder,
        disabled,
        className,
      ],
    );

    if (isControlled) {
      return renderTree(list, props.value, handleControlledChange);
    }

    const [value, setValue] = React.useState<number | number[]>(
      multiple ? [] : undefined,
    );

    const handleChange = React.useCallback(
      (...[newValue, , extra]: [number | number[], any, any]) => {
        if (mode === 'single') {
          setValue(newValue);
          if (onChange) {
            onChange(
              newValue,
              newValue ? extra.triggerNode.props['data-content'] : undefined,
            );
          }
          return;
        }
        if (treeCheckable) {
          setValue(newValue);
          if (onChange) {
            onChange(newValue);
          }
          return;
        }
        setValue(newValue);
        if (onChange) {
          if ((newValue as number[]).length === 0) {
            onChange([], []);
            return;
          }
          onChange(newValue, extra.triggerNode.props['data-content']);
        }
      },
      [mode, onChange, treeCheckable, setValue],
    );

    const handleUpdateValue = React.useCallback(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    React.useEffect(() => {
      handleUpdateValue();
    }, [handleUpdateValue]);

    return renderTree(list, value, handleChange);
  },
);

TreeSelectDropdown.defaultProps = {
  mode: 'single',
  onlyLeaf: false,
  allowClear: true,
  treeDefaultExpandAll: false,
};

export default TreeSelectDropdown;
