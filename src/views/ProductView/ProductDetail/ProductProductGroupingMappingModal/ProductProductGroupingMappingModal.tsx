import React, { Dispatch, SetStateAction } from 'react';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import nameof from 'ts-nameof.macro';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { tableService } from 'core/services';
import { useTranslation } from 'react-i18next';

import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';

export interface ProductProductGroupingMappingModalProps extends ModalProps {
  current: ProductProductGroupingMapping[];

  loading: boolean;

  modelFilter: ProductGroupingFilter;

  setModelFilter: Dispatch<SetStateAction<ProductGroupingFilter>>;

  rowSelection: TableRowSelection<ProductGrouping>;

  list: ProductProductGroupingMapping[];

  total: number;

  onClose: () => void;
}

function ProductProductGroupingMappingMappingModal(
  props: ProductProductGroupingMappingModalProps,
) {
  const [translate] = useTranslation();

  const {
    isOpen,
    toggle,
    onClose,
    list,
    loading,
    rowSelection,
    modelFilter,
    setModelFilter,
    total,
  } = props;

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    modelFilter,
    setModelFilter,
    total,
  );

  const columns: ColumnProps<
    ProductProductGroupingMapping
  >[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<ProductProductGroupingMapping>(pagination),
      },
      {
        key: nameof(list[0].id),
        dataIndex: nameof(list[0].id),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.productGroupings.id'),
      },
      {
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.productGroupings.code'),
      },
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.productGroupings.name'),
      },
      {
        key: nameof(list[0].parentId),
        dataIndex: nameof(list[0].parentId),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.productGroupings.parentId'),
      },
      {
        key: nameof(list[0].path),
        dataIndex: nameof(list[0].path),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.productGroupings.path'),
      },
      {
        key: nameof(list[0].description),
        dataIndex: nameof(list[0].description),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.productGroupings.description'),
      },
    ];
  }, [list, pagination, sorter, translate]);

  return (
    <Modal size="xl" unmountOnClose={true} toggle={toggle} isOpen={isOpen}>
      <ModalHeader></ModalHeader>
      <ModalBody>
        <Table
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
        />
      </ModalBody>
      <ModalFooter className="d-flex justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={onClose}>
          {translate(generalLanguageKeys.actions.close)}
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default ProductProductGroupingMappingMappingModal;
