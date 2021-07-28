import { Descriptions, Spin } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import {
  INDIRECT_SALES_ORDER_ROUTE,
  STORE_IMAGES_MONITOR,
  STORE_PROBLEMS_MONITOR,
} from 'config/route-consts';
import { buildLinkWithSearch, buildLink } from 'core/helpers/string';
import { Model } from 'core/models';
import { formatNumber } from 'helpers/number-format';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import nameof from 'ts-nameof.macro';
import '../../MonitorView/MonitorPopup.scss';

export interface ImagePreviewFilter {
  date?: string;
  storeId?: number;
  saleEmployeeId?: number;
  isOpen?: boolean;
}

export interface SalemansDetailPopupProps<T extends Model> {
  isOpen: boolean;
  onClose?: () => void;
  previewList?: T[];
  isLoading?: boolean;
  filter?: ImagePreviewFilter;
}
function SalemansDetailPopup<T extends Model>(
  props: SalemansDetailPopupProps<T>,
) {
  const [translate] = useTranslation();
  const { isOpen, onClose, previewList, isLoading, filter } = props;
  const columnsPopup: ColumnProps<T>[] = [
    {
      title: translate('salemansMonitors.storeCode'),
      key: nameof(previewList[0].storeCode),
      dataIndex: nameof(previewList[0].storeCode),
      ellipsis: true,
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
      title: translate('salemansMonitors.storeName'),
      key: nameof(previewList[0].storeName),
      dataIndex: nameof(previewList[0].storeName),
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
          {translate('salemansMonitors.salesOrderCounter')}
        </div>
      ),
      key: nameof(previewList[0].indirectSalesOrderCode),
      dataIndex: nameof(previewList[0].indirectSalesOrderCode),
      ellipsis: true,
      render(...[indirectSalesOrderCode]) {
        return (
          <div className="text-right">
            <Link
              to={buildLink(INDIRECT_SALES_ORDER_ROUTE, indirectSalesOrderCode)}
              className="text-highlight"
              target="_blank"
            >
              {indirectSalesOrderCode}
            </Link>
          </div>
        );
      },
    },
    {
      title: (
        <div className="text-right">{translate('salemansMonitors.sales')}</div>
      ),
      key: nameof(previewList[0].sales),
      dataIndex: nameof(previewList[0].sales),
      ellipsis: true,
      render(...[value]) {
        return (
          <div className="text-right tex-highlight">{formatNumber(value)}</div>
        );
      },
    },
    {
      title: (
        <div className="text-right">
          {translate('salemansMonitors.imageCounter')}
        </div>
      ),
      key: nameof(previewList[0].imageCounter),
      dataIndex: nameof(previewList[0].imageCounter),
      ellipsis: true,
      render(...[imageCounter, record]) {
        return {
          children: (
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
          ),
          props: {
            rowSpan: record?.rowSpan ? record?.rowSpan : 0,
            colSpan: 1,
          },
        };
      },
    },
    {
      title: translate('salemansMonitors.storeProblem'),
      key: nameof(previewList[0].problemCode),
      dataIndex: nameof(previewList[0].problemCode),
      ellipsis: true,
      render(...[storeProblemCode, record]) {
        return (
          <Link
            target="_blank"
            to={buildLink(STORE_PROBLEMS_MONITOR, record.problemId)}>
            {storeProblemCode}
          </Link>
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
      className="monitor-popup"
    >
      <Spin spinning={isLoading}>
        <Descriptions.Item>
          <Table
            dataSource={previewList}
            bordered
            columns={columnsPopup}
            size="small"
            tableLayout="fixed"
            rowKey={nameof(previewList[0].key)}
            pagination={false}
            scroll={{ y: 400 }}
          />
        </Descriptions.Item>
      </Spin>
    </MasterPreview>
  );
}

export default SalemansDetailPopup;
