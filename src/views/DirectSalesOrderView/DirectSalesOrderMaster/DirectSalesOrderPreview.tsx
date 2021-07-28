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
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderContent } from 'models/Direct/DirectSalesOrderContent';
import { Item } from 'models/Item';
import { PostFilter } from 'models/PostFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'reactn';
import nameof from 'ts-nameof.macro';
import { directSalesOrderRepository } from '../DirectSalesOrderRepository';

export interface DirectSalesOrderPreviewProps {
  directSalesOrder: DirectSalesOrder;
  directSalesOrderContent: DirectSalesOrderContent;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading: boolean;
}

export default function DirectSalesOrderPreview(
  props: DirectSalesOrderPreviewProps,
) {
  const {
    directSalesOrder,
    previewVisible,
    onClose,
    previewLoading,
    loading,
  } = props;
  const [translate] = useTranslation();
  const [user] = useGlobal<AppUser>('user');

  const [list, setList] = React.useState<DirectSalesOrder[]>();
  React.useEffect(() => {
    if (directSalesOrder && (directSalesOrder?.directSalesOrderContents?.length > 0 || directSalesOrder?.directSalesOrderPromotions?.length > 0)) {
      setList([...directSalesOrder?.directSalesOrderContents.concat(directSalesOrder?.directSalesOrderPromotions)]);
    }

  }, [setList, directSalesOrder]);


  const columnsPopup: ColumnProps<
    DirectSalesOrderContent
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<DirectSalesOrderContent>(),
      },
      {
        title: translate('directSalesOrderContents.items.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: translate('directSalesOrderContents.items.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].item),
        ellipsis: true,
        render(item: Item) {
          return item?.name;
        },
        width: 250,
      },
      {
        title: translate('directSalesOrderContents.unitOfMeasure'),
        key: nameof(list[0].unitOfMeasure),
        dataIndex: nameof(list[0].unitOfMeasure),
        render(unitOfMeasure: UnitOfMeasure) {
          return unitOfMeasure?.name;
        },
      },
      {
        title: translate('directSalesOrderContents.quantity'),
        key: nameof(list[0].quantity),
        dataIndex: nameof(list[0].quantity),
        align: 'right',
        render(...[quantity]) {
          return formatNumber(quantity);
        },
      },
      {
        title: translate('directSalesOrderContents.price'),
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
        render(...[salePrice]) {
          return formatNumber(salePrice);
        },
        align: 'right',
      },
      {
        title: translate('directSalesOrderContents.taxPercentage'),
        key: nameof(list[0].taxPercentage),
        dataIndex: nameof(list[0].taxPercentage),
        render(...[taxPercentage]) {
          return formatNumber(taxPercentage);
        },
        align: 'right',
      },
      {
        title: translate('directSalesOrders.discountPercentage'),
        key: nameof(list[0].discountPercentage),
        dataIndex: nameof(list[0].discountPercentage),
        align: 'right',
      },

      {
        title: translate('directSalesOrderContents.amount'),
        key: nameof(list[0].amount),
        dataIndex: nameof(list[0].amount),
        render(...[amount]) {
          return formatNumber(amount);
        },
        align: 'right',
      },
      {
        title: translate('directSalesOrders.isEditedPrice'),
        key: nameof(list[0].editedPriceStatus),
        dataIndex: nameof(list[0].directSalesOrderContents),
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

  const handlePrint = React.useCallback(
    (id: number) => {
      const url = document.URL;
      const urlTmp = url.split('dms/');
      window.open(urlTmp[0] + 'rpc/dms/direct-sales-order/print?id=' + id);
    }, []);


  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={translate('directSalesOrders.preview.title')}
      className="modal-preview"
    >
      <button
        className="btn btn-sm btn-primary ml-2 button-print"
        onClick={() => handlePrint(directSalesOrder.id)}
      >
        {translate('directSalesOrders.print')}
      </button>
      <Spin spinning={previewLoading}>
        <Descriptions>
          <Descriptions.Item label={translate('directSalesOrders.code')}>
            {directSalesOrder?.code}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('directSalesOrders.buyerStore')}
          >
            {directSalesOrder?.buyerStore?.name}
          </Descriptions.Item>

        </Descriptions>

        <Descriptions>
          <Descriptions.Item label={translate('directSalesOrders.orderDate')}>
            {formatDate(directSalesOrder?.orderDate)}
          </Descriptions.Item>

          <Descriptions.Item
            label={translate('directSalesOrders.phoneNumberBuy')}
          >
            {directSalesOrder?.buyerStore?.telephone}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            label={translate('directSalesOrders.saleEmployee')}
          >
            {directSalesOrder?.saleEmployee?.displayName}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('directSalesOrders.deliveryAddress')}
          >
            <Tooltip title={directSalesOrder?.deliveryAddress}>
              {limitWord(directSalesOrder?.deliveryAddress, 40)}
            </Tooltip>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            label={translate('directSalesOrders.isEditedPrice')}
          >
            <div className={directSalesOrder?.editedPriceStatus?.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('directSalesOrders.taxCode')}
          >
            {directSalesOrder?.buyerStore?.taxCode}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            label={translate('directSalesOrders.status')}
          >
            {directSalesOrder.requestStateId &&
              directSalesOrder.requestStateId === 1 && (
                <div className="new-state ml-4">
                  {directSalesOrder?.requestState?.name}
                </div>
              )}
            {directSalesOrder.requestStateId &&
              directSalesOrder.requestStateId === 2 && (
                <div className="pending-state ml-4">
                  {directSalesOrder?.requestState?.name}
                </div>
              )}
            {directSalesOrder.requestStateId &&
              directSalesOrder.requestStateId === 3 && (
                <div className="approved-state ml-4">
                  {directSalesOrder?.requestState?.name}
                </div>
              )}
            {directSalesOrder.requestStateId &&
              directSalesOrder.requestStateId === 4 && (
                <div className="rejected-state ml-4">
                  {directSalesOrder?.requestState?.name}
                </div>
              )}

          </Descriptions.Item>
          <Descriptions.Item
            label={translate('directSalesOrders.phoneNumber')}
          >
            {directSalesOrder?.phoneNumber}
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
              rowKey={nameof(directSalesOrder.id)}
              scroll={{ y: 240 }}
              pagination={false}
              className="mt-4 mb-3"
            />
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={1}>
          <Descriptions.Item
            label={translate('directSalesOrders.subTotal')}
            className="float-right"
          >
            {formatNumber(directSalesOrder?.subTotal)}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('directSalesOrderContents.discountAmount')}
            className="float-right"
          >
            {formatNumber(directSalesOrder?.generalDiscountAmount) || 0}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('directSalesOrders.totalTaxAmount')}
            className="float-right"
          >
            {formatNumber(directSalesOrder?.totalTaxAmount)}
          </Descriptions.Item>
          <Descriptions.Item className="float-right total">
            {formatNumber(directSalesOrder?.total)}
          </Descriptions.Item>
        </Descriptions>
        <div className="sale-order-chat-box mt-3">
          <ChatBox
            userInfo={user as AppUser || AppUser}
            discussionId={directSalesOrder.rowId}
            getMessages={directSalesOrderRepository.listPost}
            classFilter={PostFilter}
            postMessage={directSalesOrderRepository.createPost}
            countMessages={directSalesOrderRepository.countPost}
            deleteMessage={directSalesOrderRepository.deletePost}
            attachFile={directSalesOrderRepository.saveFile}
            suggestList={directSalesOrderRepository.singleListAppUser}
          />
        </div>
      </Spin>
    </MasterPreview>
  );
}
