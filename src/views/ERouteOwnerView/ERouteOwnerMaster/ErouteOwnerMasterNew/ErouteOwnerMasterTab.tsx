import { Modal, Tooltip } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import Table, { ColumnProps, SorterResult } from 'antd/lib/table';
import { API_E_ROUTE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { E_ROUTE_OWNER_DETAIL_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { ERoute } from 'models/ERoute';
import { ERouteType } from 'models/ERouteType';
import { Status } from 'models/Status';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import path from 'path';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteOwnerRepository } from 'views/ERouteOwnerView/ERouteOwnerRepository';

export interface ERouteMasterTabProps {
  filter?: UnitOfMeasureFilter;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  pagination?: PaginationProps;
  list?: ERoute[];
  sorter?: SorterResult<ERoute>;
  handleOpenPreview?: (id: number | string) => void;
  handleGoDetail?: (id: number | string) => void;
  handleDelete?: (eRoute: ERoute) => void;
  loading?: boolean;
  handleGoCreate?: () => void;
  previewModel?: ERoute;
  total?: number;
  handleTableChange?: (
    newPagination: PaginationProps,
    filters: Record<string, any>,
    newSorter: SorterResult<ERoute>,
  ) => void;

  handleSearch?: () => void;

  handleViewHistory?: (id: number | string) => void;

  tab?: number;

  setLoadList?: Dispatch<SetStateAction<boolean>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  setList?: Dispatch<SetStateAction<ERoute[]>>;
}

function ErouteOwnerMasterTab(props: ERouteMasterTabProps) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'e-route',
    API_E_ROUTE_ROUTE,
  );

  const history = useHistory();

  const {
    list,
    handleOpenPreview,
    loading,
    previewModel,
    total,
    handleViewHistory,
    tab,
    pagination,
    sorter,
    setLoadList,
    handleTableChange,
    setLoading,
    setList,
    handleSearch,
  } = props;

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    E_ROUTE_OWNER_DETAIL_ROUTE,
  );

  const [handleDelete] = tableService.useDeleteHandler<ERoute>(
    eRouteOwnerRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );

  const handleGoDetail2 = React.useCallback(
    id => {
      history.push(path.join(E_ROUTE_OWNER_DETAIL_ROUTE, `${id}`));
    },
    [history],
  );

  const handleChangeRequestState = React.useCallback(
    eRoute => {
      if (tab === 1) {
        Modal.confirm({
          content: translate('eRoutes.noti.send'),

          onOk() {
            eRouteOwnerRepository
              .getDetail(eRoute.id)
              .then(res => {
                eRouteOwnerRepository.send(res).then(() => {
                  setLoadList(true);
                });
              });
          },
        });
      }
      if (tab === 2) {
        handleGoDetail2(eRoute.id);
      }
    },
    [translate, setLoadList, tab, handleGoDetail2],
  );

  const columns: ColumnProps<ERoute>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<ERoute>(pagination),
        },
        {
          title: translate('eRoutes.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<ERoute>(nameof(list[0].code), sorter),
        },
        {
          title: translate('eRoutes.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<ERoute>(nameof(list[0].name), sorter),
        },
        {
          title: translate('eRoutes.saleEmployee'),
          key: nameof(list[0].saleEmployee),
          dataIndex: nameof(list[0].saleEmployee),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<ERoute>(
            nameof(list[0].saleEmployee),
            sorter,
          ),
          render(saleEmployee: AppUser) {
            return saleEmployee?.displayName;
          },
        },
        {
          title: translate('eRoutes.date'),
          key: nameof(list[0].startDate),
          dataIndex: nameof(list[0].startDate),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<ERoute>(
            nameof(list[0].startDate),
            sorter,
          ),
          render(...[, route]) {
            if (route.endDate) {
              const dateTime = `${formatDate(route?.startDate)} - ${formatDate(
                route?.endDate,
              )}`;
              return dateTime;
            } else return formatDate(route.startDate);
          },
        },
        {
          title: translate('eRoutes.eRouteType'),
          key: nameof(list[0].eRouteType),
          dataIndex: nameof(list[0].eRouteType),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<ERoute>(
            nameof(list[0].eRouteType),
            sorter,
          ),
          render(eRouteType: ERouteType) {
            return eRouteType?.name;
          },
        },
        {
          title: translate('eRoutes.requestState'),
          key: nameof(list[0].requestState),
          dataIndex: nameof(list[0].requestState),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<ERoute>(
            nameof(list[0].requestState),
            sorter,
          ),
          render(...[requestState]) {
            return (
              <>
                {requestState && requestState?.id === 1 && (
                  <div className="new-state ml-4">
                    {requestState?.name}
                  </div>
                )}
                {requestState && requestState?.id === 2 && (
                  <div className="pending-state ml-4">
                    {requestState?.name}
                  </div>
                )}
                {requestState && requestState?.id === 3 && (
                  <div className="approved-state ml-4">
                    {requestState?.name}
                  </div>
                )}
                {requestState && requestState?.id === 4 && (
                  <div className="rejected-state ml-4">
                    {requestState?.name}
                  </div>
                )}
              </>
            );
          },
        },
        {
          title: translate('eRoutes.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          align: 'center',
          sortOrder: getOrderTypeForTable<ERoute>(nameof(list[0].status), sorter),
          render(status: Status) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: 160,
          align: 'center',
          render(id: number, eRoute: ERoute) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {tab !== 3 && (
                  <Tooltip title={translate(generalLanguageKeys.actions.send)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() =>
                        handleChangeRequestState(eRoute)
                      }
                    >
                      <i className="tio-swap_horizontal" />
                    </button>
                  </Tooltip>
                )}
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}
                <Tooltip
                  title={translate(generalLanguageKeys.actions.history)}
                >
                  <button
                    className="btn btn-link"
                    onClick={() => handleViewHistory(id)}
                  >
                    <i
                      className="tio-history"
                      aria-hidden="true"
                    />
                  </button>
                </Tooltip>

                {(tab === 1 || tab === 3) && validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
                {/* Chỉ trạng thái Khởi tạo thì được phép xóa đơn hàng */}
                {!eRoute.used && validAction('delete') && tab === 1 && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(eRoute)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                )}
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      handleDelete,
      handleGoDetail,
      handleOpenPreview,
      handleViewHistory,
      list,
      pagination,
      sorter,
      translate,
      validAction,
      tab,
      handleChangeRequestState,
    ],
  );

  return (
    <>
      <Table
        dataSource={list}
        columns={columns}
        size="small"
        tableLayout="fixed"
        loading={loading}
        rowKey={nameof(previewModel.id)}
        pagination={pagination}
        // rowSelection={rowSelection}
        onChange={handleTableChange}
        className="table-none-row-selection"
        title={() => (
          <>
            <div className="d-flex justify-content-between">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('create') && (
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleGoCreate}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate(generalLanguageKeys.actions.create)}
                  </button>
                )}
              </div>
              <div className="flex-shrink-1 d-flex align-items-center">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total,
                })}
              </div>
            </div>
          </>
        )}
      />
    </>
  );
}
export default ErouteOwnerMasterTab;
