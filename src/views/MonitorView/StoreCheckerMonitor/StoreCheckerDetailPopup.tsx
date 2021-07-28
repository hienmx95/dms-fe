import { Descriptions, Spin } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalColumnWidths } from 'config/consts';
import {
  INDIRECT_SALES_ORDER_ROUTE,
  STORE_IMAGES_MONITOR,
  STORE_PROBLEMS_MONITOR,
} from 'config/route-consts';
import { buildLink, buildLinkWithSearch } from 'core/helpers/string';
import { Model } from 'core/models';
import { formatNumber } from 'helpers/number-format';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import nameof from 'ts-nameof.macro';
import { ImagePreviewFilter } from '../SalemansMonitor/SalemanDetailPopup';
export interface StoreCheckerDetailPopupProps<T extends Model> {
  isOpen: boolean;
  onClose?: () => void;
  previewList?: T[];
  isLoading?: boolean;
  filter?: ImagePreviewFilter;
}
function StoreCheckerDetailPopup<T extends Model>(
  props: StoreCheckerDetailPopupProps<T>,
) {
  const [translate] = useTranslation();
  const { isOpen, onClose, previewList, isLoading, filter } = props;

  const columnsPopup: ColumnProps<T>[] = [
    {
      title: translate('storeCheckerMonitors.storeCode'),
      key: nameof(previewList[0].storeCode),
      dataIndex: nameof(previewList[0].storeCode),
      ellipsis: true,
      width: generalColumnWidths.actions,
      render(...[storeCode, record]) {
        return {
          children: <>{storeCode}</>,
          props: {
            rowSpan: record?.rowSpan ? record?.rowSpan : 0,
            colSpan: 1,
          },
        };
      },
    },
    {
      title: translate('storeCheckerMonitors.storeName'),
      key: nameof(previewList[0].storeName),
      dataIndex: nameof(previewList[0].storeName),
      width: generalColumnWidths.default,
      ellipsis: true,
      render(...[storeName, record]) {
        return {
          children: <>{storeName}</>,
          props: {
            rowSpan: record?.rowSpan ? record?.rowSpan : 0,
            colSpan: 1,
          },
        };
      },
    },
    {
      title: (
        <div className="text-right">
          {translate('storeCheckerMonitors.indirectSalesOrderCode')}
        </div>
      ),
      key: nameof(previewList[0].indirectSalesOrderCode),
      dataIndex: nameof(previewList[0].indirectSalesOrderCode),
      ellipsis: true,
      width: generalColumnWidths.actions,
      render(...[indirectSalesOrderCode]) {
        return (
          <div className="text-right">
            <Link
              target="_blank"
              to={buildLink(INDIRECT_SALES_ORDER_ROUTE, indirectSalesOrderCode)}
              className="text-highlight"
            >
              {indirectSalesOrderCode}
            </Link>
          </div>
        );
      },
    },
    {
      title: (
        <div className="text-right">
          {translate('storeCheckerMonitors.sales')}
        </div>
      ),
      key: nameof(previewList[0].sales),
      dataIndex: nameof(previewList[0].sales),
      ellipsis: true,
      width: generalColumnWidths.actions,
      render(...[value]) {
        return (
          <div className="text-right text-highlight">{formatNumber(value)}</div>
        );
      },
    },
    {
      title: (
        <div className="text-right">
          {translate('storeCheckerMonitors.imageCounter')}
        </div>
      ),
      key: nameof(previewList[0].imageCounter),
      dataIndex: nameof(previewList[0].imageCounter),
      width: generalColumnWidths.default,
      ellipsis: true,
      render(...[imageCounter, record]) {
        return (
          <div className="text-right">
            <Link
              target="_blank"
              to={buildLinkWithSearch(STORE_IMAGES_MONITOR, {
                ...filter,
                storeId: record.storeId,
              })}
            >
              {imageCounter}
            </Link>
          </div>
        );
      },
    },
    {
      title: (
        <div className="text-right">
          {translate('storeCheckerMonitors.storeProblemId')}
        </div>
      ),
      key: nameof(previewList[0].problemCode),
      dataIndex: nameof(previewList[0].problemCode),
      ellipsis: true,
      width: generalColumnWidths.actions,
      render(...[problemCode, record]) {
        return (
          <div className="text-right">
            <Link
              target="_blank"
              to={buildLink(STORE_PROBLEMS_MONITOR, record.problemId)}
              className="text-highlight"
            >
              {problemCode}
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <MasterPreview
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={'Danh sách đại lý'}
    >
      <Spin spinning={isLoading}>
        <Descriptions.Item>
          <Table
            pagination={false}
            dataSource={previewList}
            columns={columnsPopup}
            bordered
            size="small"
            tableLayout="fixed"
            rowKey={nameof(previewList[0].key)}
            scroll={{ y: 400 }}
          />
        </Descriptions.Item>
      </Spin>
    </MasterPreview>
  );
}
export default StoreCheckerDetailPopup;
