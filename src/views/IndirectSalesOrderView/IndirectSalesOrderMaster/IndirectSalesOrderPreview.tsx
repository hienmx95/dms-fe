import { Descriptions, Spin, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import ChatBox from 'components/ChatBox/ChatBox';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formatDate } from 'core/helpers/date-time';
import { limitWord } from 'core/helpers/string';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { AppUser } from 'models/AppUser';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import { Item } from 'models/Item';
import { PostFilter } from 'models/PostFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'reactn';
import nameof from 'ts-nameof.macro';
import { indirectSalesOrderRepository } from '../IndirectSalesOrderRepository';
import './IndirectSalesOrderMaster.scss';

export interface IndirectSalesOrderPreviewProps {
  indirectSalesOrder: IndirectSalesOrder;
  indirectSalesOrderContent: IndirectSalesOrderContent;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading: boolean;
}

export default function IndirectSalesOrderPreview(
  props: IndirectSalesOrderPreviewProps,
) {
  const {
    indirectSalesOrder,
    previewVisible,
    onClose,
    previewLoading,
    loading,
  } = props;
  const [translate] = useTranslation();

  const [list, setList] = React.useState<IndirectSalesOrder[]>();
  const [user] = useGlobal<AppUser>('user');

  React.useEffect(() => {
    if (indirectSalesOrder && (indirectSalesOrder?.indirectSalesOrderContents?.length > 0 || indirectSalesOrder?.indirectSalesOrderPromotions?.length > 0)) {
      setList([...indirectSalesOrder?.indirectSalesOrderContents.concat(indirectSalesOrder?.indirectSalesOrderPromotions)]);
    }

  }, [setList, indirectSalesOrder]);

  const handlePrint = React.useCallback(
    (id: number) => {
      const url = document.URL;
      const urlTmp = url.split('dms/');
      window.open(urlTmp[0] + 'rpc/dms/indirect-sales-order/print?id=' + id);
    }, []);

  const columnsPopup: ColumnProps<
    IndirectSalesOrderContent
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<IndirectSalesOrderContent>(),
      },
      {
        title: translate('indirectSalesOrderContents.items.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: translate('indirectSalesOrderContents.items.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].item),
        ellipsis: true,
        render(item: Item) {
          return item?.name;
        },
      },
      {
        title: translate('indirectSalesOrderContents.unitOfMeasure'),
        key: nameof(list[0].unitOfMeasure),
        dataIndex: nameof(list[0].unitOfMeasure),
        render(unitOfMeasure: UnitOfMeasure) {
          return unitOfMeasure?.name;
        },
      },
      {
        title: translate('indirectSalesOrderContents.quantity'),
        key: nameof(list[0].quantity),
        dataIndex: nameof(list[0].quantity),
        align: 'right',
      },
      {
        title: translate('indirectSalesOrderContents.price'),
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
        render(...[salePrice]) {
          return formatNumber(salePrice);
        },
        align: 'right',
      },

      {
        title: translate('indirectSalesOrderContents.taxPercentage'),
        key: nameof(list[0].taxPercentage),
        dataIndex: nameof(list[0].taxPercentage),
        render(...[taxPercentage]) {
          return formatNumber(taxPercentage);
        },
        align: 'right',
      },
      {
        title: translate('indirectSalesOrders.discountPercentage'),
        key: nameof(list[0].discountPercentage),
        dataIndex: nameof(list[0].discountPercentage),
        align: 'right',
      },

      {
        title: translate('indirectSalesOrderContents.amount'),
        key: nameof(list[0].amount),
        dataIndex: nameof(list[0].amount),
        render(...[amount]) {
          return formatNumber(amount);
        },
        align: 'right',
      },
      {
        title: translate('indirectSalesOrders.isEditedPrice'),
        key: nameof(list[0].editedPriceStatus),
        dataIndex: nameof(list[0].indirectSalesOrderContents),
        render(...[, content]) {
          return (
            <>
              {content.editedPriceStatus &&
                <div className={content?.editedPriceStatus?.id === 1 ? 'active' : ''}>
                  <i className="fa fa-check-circle d-flex justify-content-center"></i>
                </div>
              }
            </>
          );
        },
        ellipsis: true,
        align: 'center',
      },
    ];
  }, [list, translate]);

  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={translate('indirectSalesOrders.preview.title')}
      className="modal-preview"
    >
      <button
        className="btn btn-sm btn-primary ml-2 button-print"
        onClick={() => handlePrint(indirectSalesOrder.id)}
      >
        {translate('indirectSalesOrders.print')}
      </button>
      <Spin spinning={previewLoading}>
        <Descriptions>
          <Descriptions.Item label={translate('indirectSalesOrders.code')}>
            {indirectSalesOrder?.code}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('indirectSalesOrders.buyerStore')}
          >
            {indirectSalesOrder?.buyerStore?.name}
          </Descriptions.Item>

          <Descriptions.Item
            label={translate('indirectSalesOrders.sellerStore')}
          >
            {indirectSalesOrder?.sellerStore?.name}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions>
          <Descriptions.Item label={translate('indirectSalesOrders.orderDate')}>
            {formatDate(indirectSalesOrder?.orderDate)}
          </Descriptions.Item>

          <Descriptions.Item
            label={translate('indirectSalesOrders.phoneNumberBuy')}
          >
            {indirectSalesOrder?.buyerStore?.telephone}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('indirectSalesOrders.phoneNumberSaller')}
          >
            {indirectSalesOrder?.sellerStore?.telephone}
          </Descriptions.Item>

        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            label={translate('indirectSalesOrders.saleEmployee')}
          >
            {indirectSalesOrder?.saleEmployee?.displayName}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('indirectSalesOrders.deliveryAddress')}
          >
            <Tooltip title={indirectSalesOrder?.deliveryAddress}>
              {limitWord(indirectSalesOrder?.deliveryAddress, 40)}
            </Tooltip>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            label={translate('indirectSalesOrders.isEditedPrice')}
          >
            <div className={indirectSalesOrder?.editedPriceStatus?.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            label={translate('indirectSalesOrders.status')}
          >
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 1 && (
                <div className="new-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </div>
              )}
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 2 && (
                <div className="pending-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </div>
              )}
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 3 && (
                <div className="approved-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </div>
              )}
            {indirectSalesOrder.requestStateId &&
              indirectSalesOrder.requestStateId === 4 && (
                <div className="rejected-state ml-4">
                  {indirectSalesOrder?.requestState?.name}
                </div>
              )}

          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={1}>
          <Descriptions.Item>
            <Table
              dataSource={list}
              columns={columnsPopup}
              size="small"
              tableLayout="fixed"
              loading={loading}
              rowKey={nameof(indirectSalesOrder.id)}
              scroll={{ y: 240 }}
              pagination={false}
              className="mt-4 mb-3"
            />
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={1}>
          <Descriptions.Item
            label={translate('indirectSalesOrders.subTotal')}
            className="float-right"
          >
            {formatNumber(indirectSalesOrder?.subTotal)}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('indirectSalesOrderContents.discountAmount')}
            className="float-right"
          >
            {formatNumber(indirectSalesOrder?.generalDiscountAmount) || 0}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('indirectSalesOrders.totalTaxAmount')}
            className="float-right"
          >
            {formatNumber(indirectSalesOrder?.totalTaxAmount)}
          </Descriptions.Item>
          <Descriptions.Item
            className="float-right total"
          >
            {formatNumber(indirectSalesOrder?.total)}
          </Descriptions.Item>
        </Descriptions>
        <div className="sale-order-chat-box mt-3">
          <ChatBox
            userInfo={user as AppUser || AppUser}
            discussionId={indirectSalesOrder.rowId}
            getMessages={indirectSalesOrderRepository.listPost}
            classFilter={PostFilter}
            postMessage={indirectSalesOrderRepository.createPost}
            countMessages={indirectSalesOrderRepository.countPost}
            deleteMessage={indirectSalesOrderRepository.deletePost}
            attachFile={indirectSalesOrderRepository.saveFile}
            suggestList={indirectSalesOrderRepository.singleListAppUser}
          />
        </div>
      </Spin>
    </MasterPreview>
  );
}
