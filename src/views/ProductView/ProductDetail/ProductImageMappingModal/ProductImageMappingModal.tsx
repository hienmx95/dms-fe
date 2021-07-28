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

import { ProductImageMapping } from 'models/ProductImageMapping';
import { Image } from 'models/Image';
import { ImageFilter } from 'models/ImageFilter';

export interface ProductImageMappingModalProps extends ModalProps {
  current: ProductImageMapping[];

  loading: boolean;

  modelFilter: ImageFilter;

  setModelFilter: Dispatch<SetStateAction<ImageFilter>>;

  rowSelection: TableRowSelection<Image>;

  list: ProductImageMapping[];

  total: number;

  onClose: () => void;
}

function ProductImageMappingMappingModal(props: ProductImageMappingModalProps) {
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

  const columns: ColumnProps<ProductImageMapping>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<ProductImageMapping>(pagination),
      },
      {
        key: nameof(list[0].id),
        dataIndex: nameof(list[0].id),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.images.id'),
      },
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.images.name'),
      },
      {
        key: nameof(list[0].url),
        dataIndex: nameof(list[0].url),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].name), sorter),
        title: translate('products.images.url'),
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

export default ProductImageMappingMappingModal;
