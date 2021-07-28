import { Checkbox, Descriptions, Spin } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { formatDate } from 'core/helpers/date-time';
import { ERouteChangeRequest } from 'models/ERouteChangeRequest';
import { Store } from 'models/Store';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { generalLanguageKeys, generalColumnWidths } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { PaginationProps, PaginationConfig } from 'antd/lib/pagination';
import './ERouteChangeRequestMaster.scss';
import { ERouteChangeRequestFilter } from 'models/ERouteChangeRequestFilter';
export interface PreviewERouteChangeRequestProps {
  previewModel: ERouteChangeRequest;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading: boolean;
  modelFilter: ERouteChangeRequestFilter;
  setModelFilter: Dispatch<SetStateAction<ERouteChangeRequestFilter>>;
}
export default function PreviewERouteChangeRequest(props: PreviewERouteChangeRequestProps) {
  const [translate] = useTranslation();
  const { previewModel, previewVisible, onClose, previewLoading, loading, modelFilter, setModelFilter } = props;
  const pagination: PaginationProps = React.useMemo(() => {
    const { skip, take } = modelFilter;

    const length = previewModel.eRouteChangeRequestContents?.length;
    return {
      current: skip / take + 1,
      pageSize: take,
      total: length,
    };

  }, [modelFilter, previewModel.eRouteChangeRequestContents]);

  const handleTableChange = React.useCallback((newPagination: PaginationConfig) => {
    const { pageSize: take } = newPagination;
    const skip: number =
      (newPagination.current - 1) * newPagination.pageSize;
    if (skip !== modelFilter.skip || take !== modelFilter.take) {
      setModelFilter({
        ...modelFilter,
        skip,
        take,
      });
      return;
    }

  }, [modelFilter, setModelFilter]);
  const renderDate = React.useCallback(
    () => {
      if (previewModel.endDate) {
        return <span>{formatDate(previewModel.startDate)} - {formatDate(previewModel.endDate)}</span>;
      }
      else {
        return <span>{formatDate(previewModel.startDate)}</span>;
      }

    }, [previewModel.endDate, previewModel.startDate],
  );
  const columns: ColumnProps<ERouteChangeRequest>[] = React.useMemo(
    () => {
      return [
        {
          title: '',
          children: [
            {
              title: translate(generalLanguageKeys.columns.index),
              key: nameof(generalLanguageKeys.index),
              width: generalColumnWidths.index,
              render: renderMasterIndex<ERouteChangeRequest>(pagination),
            },
            {
              title: translate('eRouteChangeRequestContents.store.code'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].code),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].store),
              width: 100,
              ellipsis: true,
              render(store: Store) {
                return store?.code;
              },
            },
            {
              title: translate('eRouteChangeRequestContents.store.name'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].name),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.name;
              },
            },
            {
              title: translate('eRouteChangeRequestContents.store.address'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].address),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.address;
              },
            },
            {
              title: translate('eRouteChangeRequestContents.orderNumber'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].orderNumber),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].orderNumber),
              width: 100,
            },
          ],
        },
        {
          title: translate('eRouteChangeRequestContents.frequency'),
          children: [
            {
              title: translate('eRouteChangeRequestContents.monday'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].monday),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].monday),
              width: 50,
              render(...[monday]) {
                return (
                  <Checkbox
                    defaultChecked={monday}
                    disabled
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.tuesday'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].tuesday),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].tuesday),
              width: 50,
              render(...[tuesday]) {
                return (
                  <Checkbox
                    defaultChecked={tuesday}
                    disabled
                  />
                );
              },
            },

            {
              title: translate('eRouteChangeRequestContents.wednesday'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].wednesday),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].wednesday),
              width: 50,
              render(...[wednesday]) {
                return (
                  <Checkbox
                    defaultChecked={wednesday}
                    disabled
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.thursday'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].thursday),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].thursday),
              width: 50,
              render(...[thursday]) {
                return (
                  <Checkbox
                    defaultChecked={thursday}
                    disabled
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.friday'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].friday),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].friday),
              width: 50,
              render(...[friday]) {
                return (
                  <Checkbox
                    defaultChecked={friday}
                    disabled
                  />
                );
              },
            },

            {
              title: translate('eRouteChangeRequestContents.saturday'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].saturday),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].saturday),
              width: 50,
              render(...[saturday]) {
                return (
                  <Checkbox
                    defaultChecked={saturday}
                    disabled
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.sunday'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].sunday),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].sunday),
              width: 50,
              render(...[sunday]) {
                return (
                  <Checkbox
                    defaultChecked={sunday}
                    disabled
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.week1'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].week1),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].week1),
              width: 50,
              render(...[week1]) {
                return (
                  <Checkbox
                    defaultChecked={week1}
                    disabled
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.week2'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].week2),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].week2),
              width: 50,
              render(...[week2]) {
                return (
                  <Checkbox
                    defaultChecked={week2}
                    disabled
                  />
                );
              },
            },

            {
              title: translate('eRouteChangeRequestContents.week3'),
              key: nameof(previewModel.week3),
              dataIndex: nameof(previewModel.week3),
              width: 50,
              render(...[week3]) {
                return (
                  <Checkbox
                    defaultChecked={week3}
                    disabled
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.week4'),
              key: nameof(previewModel.eRouteChangeRequestContents[0].week4),
              dataIndex: nameof(previewModel.eRouteChangeRequestContents[0].week4),
              width: 50,
              render(...[week4]) {
                return (
                  <Checkbox
                    defaultChecked={week4}
                    disabled
                  />
                );
              },
            },
          ],
        },
      ];
    },
    [pagination, previewModel.eRouteChangeRequestContents, previewModel.week3, translate],
  );

  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel?.eRoute?.name}
      statusId={previewModel?.eRoute?.statusId}
      code={previewModel?.eRoute?.code}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('eRouteChangeRequests.code')}>
            {previewModel?.eRoute?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('eRouteChangeRequests.name')}>
            {previewModel?.eRoute?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('eRouteChangeRequests.saleEmployee')}>
            {previewModel?.eRoute?.saleEmployee?.displayName}
          </Descriptions.Item>
          <Descriptions.Item label={translate('eRouteChangeRequests.eRouteType')}>
            {previewModel?.eRoute?.eRouteType?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('eRouteChangeRequests.date')}>
            {renderDate()}
          </Descriptions.Item>
          <Descriptions.Item label={translate('eRouteChangeRequests.creator')}>
            {previewModel?.creator?.displayName}
          </Descriptions.Item>
        </Descriptions>
        <div className="title-preivew pt-3">{translate('eRouteChangeRequests.title.store')}</div>
        <Descriptions.Item>
          <Table
            dataSource={previewModel.eRouteChangeRequestContents}
            columns={columns}
            size="small"
            tableLayout="fixed"
            loading={loading}
            rowKey={nameof(previewModel.id)}
            pagination={pagination}
            onChange={handleTableChange}
            title={() => {
              return (
                <div className="d-flex justify-content-end mr-2">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total: pagination?.total,
                  })}
                </div>
              );
            }}
          />
        </Descriptions.Item>
      </Spin>
    </MasterPreview>
  );
}
