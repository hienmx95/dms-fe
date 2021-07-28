import Card from 'antd/lib/card';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { Role } from 'models/Role';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import nameof from 'ts-nameof.macro';
import './ContentModal.scss';

export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading: boolean;

  pagination?: PaginationConfig;

  columns?: ColumnProps<T>[];

  children?: any;

  isSave?: boolean;

  onSave?: (selectedList: T[], currentItem) => void;

  currentItem?: any;
}

function ContentModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    title,
    loading,
    list,
    selectedList,
    setSelectedList,
    columns,
    children,
    pagination,
    onSave,
    currentItem,
  } = props;

  const rowSelection: TableRowSelection<Role> = crudService.useContentModalList<
    T
  >(selectedList, setSelectedList);

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <Card
          className="head-borderless mb-4"
          title={translate(generalLanguageKeys.actions.search)}
        >
          {children}
        </Card>
        <Table
          key={list[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(selectedList, currentItem)}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ContentModal;
