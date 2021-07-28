import { ButtonType } from 'antd/lib/button';
import { AxiosError } from 'axios';
import Tree from 'components/TreeMap/TreeMap';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { ITreeItem } from 'helpers/tree';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import classNames from 'classnames';
import './TreePopup.scss';

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

  list?: T[];

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  onSearchError?: (error: AxiosError<T>) => void;

  searchField?: string;

  checkable?: boolean;

  onlyLeaf?: boolean;
}

const TreePopup = <T extends Model, TModelFilter extends ModelFilter>(
  props: ITreeInModalProps<T, TModelFilter>,
) => {
  const { modelFilter, getList, list: defaultList, onChange, onlyLeaf } = props;

  const [translate] = useTranslation();

  const [selectedItems, setSelectedItems] = useState<T[]>(
    props.selectedItems || props.defaultSelectedItems || [],
  );

  const [list, setList] = React.useState<T[]>(defaultList ?? []);

  const [, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (props.selectedItems) {
      setSelectedItems(props.selectedItems);
    }
  }, [props.selectedItems]);

  const handleSave = React.useCallback(() => {
    if (onChange) {
      onChange(selectedItems);
      return;
    }
  }, [selectedItems, onChange]);
  const handleLoadList = React.useCallback(async () => {
    try {
      setLoading(true);
      setList(await getList(modelFilter));
    } catch (error) {
      // if (typeof onSearchError === 'function') {
      //   onSearchError(error);
      // }
    }
    setLoading(false);
  }, [getList, modelFilter]);

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  const handleClose = React.useCallback(
    event => {
      setSelectedItems(props.selectedItems || props.defaultSelectedItems || []);
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );

  const handleChangeTree = React.useCallback(
    (items: T[], checked: boolean) => {
      let listItem = selectedItems;
      if (!checked) {
        listItem = listItem.filter(
          item => !items.map(i => i.id).includes(item.id),
        );
      } else {
        listItem = [...listItem, ...items];
      }

      setSelectedItems([...listItem]);
    },
    [selectedItems],
  );

  return renderModal();

  function renderModal() {
    return (
      <>
        <Modal
          className={classNames(props.className, 'tree-popup')}
          isOpen={props.visible}
          toggle={handleClose}
          size="xl"
          style={{ maxWidth: '1000px', width: '90%' }}
          unmountOnClose
          centered
        >
          <ModalHeader toggle={props.onClose}>
            {translate(props.title)}
          </ModalHeader>
          <ModalBody>
            <Tree
              selectedItems={selectedItems}
              onChange={handleChangeTree}
              value={list}
              isEdit={false}
              checkable={true}
              onlyLeaf={onlyLeaf}
            />
            <div className="d-flex justify-content-end mt-4 mr-3">
              <button className="btn btn-sm btn-primary" onClick={handleSave}>
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
              <button
                className="btn btn-sm btn-outline-primary ml-2"
                onClick={handleClose}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
};

TreePopup.defaultProps = {
  allowOk: true,
  okText: 'OK',
  okType: 'primary',
  allowClose: true,
  closeText: 'Cancel',
  closeType: 'default',
  defaultDataSource: [],
};

export default TreePopup;
