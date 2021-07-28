import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Warehouse } from 'models/Warehouse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Item } from 'models/Item';
import Table, { ColumnProps } from 'antd/lib/table';
import { Inventory } from 'models/Inventory';
import nameof from 'ts-nameof.macro';

export interface ShowingWarehousePreviewIProps {
  previewModel: Warehouse;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading: boolean;
}
// const { Item: FormItem } = Form;
export default function ShowingWarehousePreview(
  props: ShowingWarehousePreviewIProps,
) {
  const {
    previewModel,
    previewVisible,
    onClose,
    previewLoading,
    loading,
  } = props;
  const [translate] = useTranslation();
  const columnsPopup: ColumnProps<Inventory>[] = [
    {
      title: translate('warehouses.item.name'),
      key: nameof(previewModel.inventories[0].item.name),
      dataIndex: nameof(previewModel.inventories[0].item),
      align: 'left',
      render(item: Item) {
        return item?.name;
      },
      ellipsis: true,
    },
    {
      title: translate('warehouses.item.code'),
      key: nameof(previewModel.items[0].code),
      dataIndex: nameof(previewModel.item),
      align: 'left',
      render(item: Item) {
        return item?.code;
      },
      ellipsis: true,
    },
    {
      title: translate('warehouses.saleStock'),
      key: nameof(previewModel.inventories[0].saleStock),
      dataIndex: nameof(previewModel.inventories[0].saleStock),
      align: 'center',
    },
    {
      title: translate('warehouses.accountingStock'),
      key: nameof(previewModel.inventories[0].accountingStock),
      dataIndex: nameof(previewModel.inventories[0].accountingStock),
      align: 'center',
    },
    {
      title: translate('warehouses.item.unitOfMeasure'),
      key: nameof(previewModel.inventories[0].itemProduct),
      dataIndex: nameof(previewModel.inventories[0].item),
      align: 'center',
      render(item: Item) {
        return item?.product?.unitOfMeasure?.name;
      },
    },
  ];
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
      code={previewModel.code}
      statusId={previewModel.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={3}>
          <Descriptions.Item label={translate('warehouses.address')}>
            {previewModel?.address}
          </Descriptions.Item>
          <Descriptions.Item label={translate('warehouses.organization')}>
            {previewModel?.organization && previewModel?.organization.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('warehouses.province')}>
            {previewModel?.province?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('warehouses.district')}>
            {previewModel?.district?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('warehouses.ward')}>
            {previewModel?.ward?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={translate('products.variationAndPrice')}
          column={1}
        >
          <Descriptions.Item>
            <Table
              dataSource={previewModel.inventories}
              columns={columnsPopup}
              size="small"
              tableLayout="fixed"
              loading={loading}
              rowKey={nameof(previewModel.id)}
              // pagination={pagination}
            />
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
