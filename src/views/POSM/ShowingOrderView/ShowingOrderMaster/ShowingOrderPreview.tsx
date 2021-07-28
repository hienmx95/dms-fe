import { Descriptions, Spin, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { formatDate } from 'core/helpers/date-time';
import { formatNumber } from 'core/helpers/number';
import { limitWord } from 'core/helpers/string';
import { ShowingOrder } from 'models/posm/ShowingOrder';
import { ShowingOrderContent } from 'models/posm/ShowingOrderContent';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
export interface ShowingOrderPreviewIProps {
  previewModel: ShowingOrder;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  list?: ShowingOrderContent[];
}

export default function ShowingOrderPreview(props: ShowingOrderPreviewIProps) {
  const { previewModel, previewVisible, onClose, previewLoading, list } = props;
  const [translate] = useTranslation();

  const columns: ColumnProps<ShowingOrderContent>[] = React.useMemo(() => {
    return [
      {
        title: translate('showingOrderContents.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].showingItem),
        ellipsis: true,
        render(...[showingItem]) {
          return showingItem?.code;
        },
      },
      {
        title: translate('showingOrderContents.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].showingItem),
        ellipsis: true,
        width: 250,
        render(...[showingItem]) {
          return showingItem?.name;
        },
      },
      {
        title: translate('showingOrderContents.category'),
        key: nameof(list[0].category),
        dataIndex: nameof(list[0].showingItem),
        width: 200,
        render(...[showingItem]) {
          return showingItem?.showingCategory?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('showingOrderContents.uom'),
        key: nameof(list[0].unitOfMeasure),
        dataIndex: nameof(list[0].unitOfMeasure),
        width: 100,
        render(unitOfMeasure: UnitOfMeasure) {
          return unitOfMeasure?.name;
        },
        ellipsis: true,
      },

      {
        title: translate('showingOrderContents.salePrice'),
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
        align: 'right',
        render(...[salePrice]) {
          return formatNumber(salePrice);
        },
      },
      {
        title: translate('showingOrderContents.quantity'),
        key: nameof(list[0].quantity),
        dataIndex: nameof(list[0].quantity),
        align: 'right',
        render(...[quantity]) {
          return formatNumber(quantity);
        },
      },
      {
        title: translate('showingOrderContents.amount'),
        key: nameof(list[0].amount),
        dataIndex: nameof(list[0].amount),
        align: 'right',
        render(...[amount]) {
          return formatNumber(amount);
        },
      },
    ];
  }, [list, translate]);
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.code}
      code={previewModel?.store?.name}
      statusId={previewModel?.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item label={translate('showingOrders.storeCode')}>
            {previewModel?.store?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('showingOrders.storeName')}>
            <Tooltip title={previewModel?.store?.name} placement="bottom">
              {limitWord(previewModel?.store?.name, 20)}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={translate('showingOrders.appUser')}>
            {previewModel?.appUser && previewModel?.appUser?.displayName}
          </Descriptions.Item>
          <Descriptions.Item label={translate('showingOrders.date')}>
            {previewModel?.date ? formatDate(previewModel?.date) : ' '}
          </Descriptions.Item>
        </Descriptions>
        {/* <Descriptions> */}
        <Table
          key={uuidv4()}
          tableLayout="fixed"
          columns={columns}
          dataSource={list}
          rowKey={nameof(list[0].id)}
          className="ml-2 mr-2 mt-2"
          pagination={false}
        />

        <div
          className="d-flex justify-content-end"
          style={{
            alignItems: 'baseline',
            marginTop: 20,
          }}
        >
          <span
            className="title"
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              paddingRight: 65,
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.85)',
            }}
          >
            {translate('showingOrders.total')}
          </span>
          <span style={{ fontSize: 20, color: '#a32f4a', fontWeight: 500 }}>
            {' '}
            {formatNumber(previewModel?.total)}
          </span>
        </div>
        {/* </Descriptions> */}
      </Spin>
    </MasterPreview>
  );
}
