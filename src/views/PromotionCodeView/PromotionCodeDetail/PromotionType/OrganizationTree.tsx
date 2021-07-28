import { ButtonType } from 'antd/lib/button';
import { AxiosError } from 'axios';
import Tree from 'components/TreeMap/TreeMap';
import { Model, ModelFilter } from 'core/models';
import { ITreeItem } from 'helpers/tree';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

export interface ISelectedItems<T> {
  [key: number]: T;
}

interface ITreeInModalProps<T extends Model, TModelFilter extends ModelFilter> {
  defaultSelectedItems?: T[];

  selectedItems?: T[];

  defaultDataSource?: ITreeItem[];

  visible?: boolean;

  onChange?: (selectedItem: T[]) => void;

  onClose?: (event) => void;

  title?: string;

  className?: string;

  allowOk?: boolean;

  okText?: string;

  okType?: ButtonType;

  allowClose?: boolean;

  closeText?: string;

  closeType?: ButtonType;

  getList?: (TModelFilter?: TModelFilter) => Promise<T[]>;

  listDefault?: T[];

  list?: T[];

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  onSearchError?: (error: AxiosError<T>) => void;

  searchField?: string;

  isPreview?: boolean;

  disabled?: boolean;
}

const OrganizationTree = <T extends Model, TModelFilter extends ModelFilter>(
  props: ITreeInModalProps<T, TModelFilter>,
) => {
  const { list: defaultList, onChange, listDefault, disabled } = props;


  const [selectedItems, setSelectedItems] = useState<T[]>(
    props.selectedItems || props.defaultSelectedItems || [],
  );

  const [list, setList] = React.useState<T[]>(defaultList ?? []);


  useEffect(() => {
    if (props.selectedItems) {
      setSelectedItems(props.selectedItems);
    }
  }, [props.selectedItems]);


  React.useEffect(() => {
    setList([...listDefault]);

  }, [setList, listDefault]);


  const handleChangeTree = React.useCallback(
    (items: T[], checked: boolean) => {
      let listItem = selectedItems;
      if (!checked) {
        listItem = listItem.filter(item => !items.map(i => i.id).includes(item.id));
      } else {
        listItem = [...listItem, ...items];
      }

      setSelectedItems([...listItem]);
      if (onChange) {
        onChange(listItem);
        return;
      }
    },
    [selectedItems, onChange],
  );

  return (
    <Tree
      selectedItems={selectedItems}
      onChange={handleChangeTree}
      value={list}
      isEdit={false}
      checkable={true}
      disabled={disabled}
    />
  );
};

OrganizationTree.defaultProps = {
  allowOk: true,
  okText: 'OK',
  okType: 'primary',
  allowClose: true,
  closeText: 'Cancel',
  closeType: 'default',
  defaultDataSource: [],
};

export default OrganizationTree;
