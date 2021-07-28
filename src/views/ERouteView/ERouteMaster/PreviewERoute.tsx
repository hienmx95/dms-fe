import { Checkbox, Descriptions, Spin, Table } from 'antd';
import { PaginationProps, PaginationConfig } from 'antd/lib/pagination';
import { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formatDate } from 'core/helpers/date-time';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { ERoute } from 'models/ERoute';
import { Store } from 'models/Store';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import './ERouteMaster.scss';
import { ERouteFilter } from 'models/ERouteFilter';
import { useGlobal } from 'reactn';
import { AppUser } from 'models/AppUser';
import ChatBox from 'components/ChatBox/ChatBox';
import { PostFilter } from 'models/PostFilter';
import { eRouteRepository } from '../ERouteRepository';

export interface PreviewERouteProps {
  previewModel: ERoute;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;

  loading: boolean;
  modelFilter: ERouteFilter;
  setModelFilter: Dispatch<SetStateAction<ERouteFilter>>;

}
export default function PreviewERoute(props: PreviewERouteProps) {
  const [translate] = useTranslation();
  const { previewModel, previewVisible, onClose, previewLoading, loading, modelFilter, setModelFilter } = props;
  const [user] = useGlobal<AppUser>('user');
  const pagination: PaginationProps = React.useMemo(() => {
    const { skip, take } = modelFilter;

    const length = previewModel.eRouteContents?.length;
    return {
      current: skip / take + 1,
      pageSize: take,
      total: length,
    };

  }, [previewModel.eRouteContents, modelFilter]);

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
  const columns: ColumnProps<ERoute>[] = React.useMemo(
    () => {
      return [
        {
          title: '',
          children: [
            {
              title: translate(generalLanguageKeys.columns.index),
              key: nameof(generalLanguageKeys.index),
              width: generalColumnWidths.index,
              render: renderMasterIndex<ERoute>(pagination),
            },
            {
              title: translate('eRouteContents.store.codeDraft'),
              key: nameof(previewModel.eRouteContents[0].code),
              dataIndex: nameof(previewModel.eRouteContents[0].store),
              width: 100,
              ellipsis: true,
              render(store: Store) {
                return store?.code;
              },
            },
            {
              title: translate('eRouteContents.store.name'),
              key: nameof(previewModel.eRouteContents[0].name),
              dataIndex: nameof(previewModel.eRouteContents[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.name;
              },
            },
            {
              title: translate('eRouteContents.store.address'),
              key: nameof(previewModel.eRouteContents[0].address),
              dataIndex: nameof(previewModel.eRouteContents[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.address;
              },
            },
            // {
            //   title: translate('eRouteContents.orderNumber'),
            //   key: nameof(previewModel.eRouteContents[0].orderNumber),
            //   dataIndex: nameof(previewModel.eRouteContents[0].orderNumber),
            //   width: 100,
            // },
          ],
        },
        {
          title: translate('eRouteContents.frequency'),
          children: [
            {
              title: translate('eRouteContents.monday'),
              key: nameof(previewModel.eRouteContents[0].monday),
              dataIndex: nameof(previewModel.eRouteContents[0].monday),
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
              title: translate('eRouteContents.tuesday'),
              key: nameof(previewModel.eRouteContents[0].tuesday),
              dataIndex: nameof(previewModel.eRouteContents[0].tuesday),
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
              title: translate('eRouteContents.wednesday'),
              key: nameof(previewModel.eRouteContents[0].wednesday),
              dataIndex: nameof(previewModel.eRouteContents[0].wednesday),
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
              title: translate('eRouteContents.thursday'),
              key: nameof(previewModel.eRouteContents[0].thursday),
              dataIndex: nameof(previewModel.eRouteContents[0].thursday),
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
              title: translate('eRouteContents.friday'),
              key: nameof(previewModel.eRouteContents[0].friday),
              dataIndex: nameof(previewModel.eRouteContents[0].friday),
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
              title: translate('eRouteContents.saturday'),
              key: nameof(previewModel.eRouteContents[0].saturday),
              dataIndex: nameof(previewModel.eRouteContents[0].saturday),
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
              title: translate('eRouteContents.sunday'),
              key: nameof(previewModel.eRouteContents[0].sunday),
              dataIndex: nameof(previewModel.eRouteContents[0].sunday),
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
              title: translate('eRouteContents.week1'),
              key: nameof(previewModel.eRouteContents[0].week1),
              dataIndex: nameof(previewModel.eRouteContents[0].week1),
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
              title: translate('eRouteContents.week2'),
              key: nameof(previewModel.eRouteContents[0].week2),
              dataIndex: nameof(previewModel.eRouteContents[0].week2),
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
              title: translate('eRouteContents.week3'),
              key: nameof(previewModel.eRouteContents[0].week3),
              dataIndex: nameof(previewModel.eRouteContents[0].week3),
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
              title: translate('eRouteContents.week4'),
              key: nameof(previewModel.eRouteContents[0].week4),
              dataIndex: nameof(previewModel.eRouteContents[0].week4),
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
    // tslint:disable-next-line:max-line-length
    [pagination, previewModel.eRouteContents, translate],
  );
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
      statusId={previewModel.statusId}
      code={previewModel.code}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('eRoutes.code')}>
            {previewModel?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('eRoutes.name')}>
            {previewModel?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('eRoutes.saleEmployee')}>
            {previewModel?.saleEmployee?.displayName}
          </Descriptions.Item>
          <Descriptions.Item label={translate('eRoutes.eRouteType')}>
            {previewModel?.eRouteType?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('eRoutes.date')}>
            {renderDate()}
          </Descriptions.Item>
          <Descriptions.Item label={translate('eRoutes.creator')}>
            {previewModel?.creator?.displayName}
          </Descriptions.Item>
        </Descriptions>
        <div className="title-preivew pt-3">{translate('eRoutes.title.store')}</div>
        <Descriptions.Item>
          <Table
            dataSource={previewModel.eRouteContents}
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
        <div className="sale-order-chat-box mt-3">
          <ChatBox
            userInfo={user as AppUser || AppUser}
            discussionId={previewModel.rowId}
            getMessages={eRouteRepository.listPost}
            classFilter={PostFilter}
            postMessage={eRouteRepository.createPost}
            countMessages={eRouteRepository.countPost}
            deleteMessage={eRouteRepository.deletePost}
            attachFile={eRouteRepository.saveFile}
            suggestList={eRouteRepository.singleListAppUser}
          />
        </div>
      </Spin>
    </MasterPreview>
  );
}
