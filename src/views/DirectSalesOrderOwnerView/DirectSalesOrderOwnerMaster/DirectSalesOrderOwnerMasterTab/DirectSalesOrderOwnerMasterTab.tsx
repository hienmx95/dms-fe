import { Modal, notification, Tooltip } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import Table, { ColumnProps, SorterResult } from 'antd/lib/table';
import { API_DIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { AppUser } from 'models/AppUser';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { Store } from 'models/Store';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import path from 'path';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { directSalesOrderOwnerRepository } from 'views/DirectSalesOrderOwnerView/DirectSalesOrderOwnerRepository';


export interface DirectSalesOrderOwnerMasterTabProps {
  filter?: UnitOfMeasureFilter;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  pagination?: PaginationProps;
  list?: DirectSalesOrder[];
  sorter?: SorterResult<DirectSalesOrder>;
  handleOpenPreview?: (id: number | string) => void;
  handleGoDetail?: (id: number | string) => void;
  handleDelete?: (directSalesOrder: DirectSalesOrder) => void;
  loading?: boolean;
  handleGoCreate?: () => void;
  previewModel?: DirectSalesOrder;
  total?: number;
  handleTableChange?: (
    newPagination: PaginationProps,
    filters: Record<string, any>,
    newSorter: SorterResult<DirectSalesOrder>,
  ) => void;

  handleSearch?: () => void;

  handleViewHistory?: (id: number | string) => void;

  tab?: number;

  setLoadList?: Dispatch<SetStateAction<boolean>>;
  setList?: Dispatch<SetStateAction<DirectSalesOrder[]>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

function DirectSalesOrderOwnerMasterTab(props: DirectSalesOrderOwnerMasterTabProps) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'direct-sales-order',
    API_DIRECT_SALES_ORDER_ROUTE,
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
    filter,
  } = props;

  const [handleExport, isError, setIsError] = crudService.useExport(
    directSalesOrderOwnerRepository.export,
    filter,
  );

  React.useEffect(() => {
    if (isError) {
      notification.error({
        message: translate('indirectSalesOrders.errorExport'),
      });
      setIsError(false);
    }
  }, [isError, translate, setIsError]);

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE,
  );

  const [handleDelete] = tableService.useDeleteHandler<DirectSalesOrder>(
    directSalesOrderOwnerRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );


  const handleGoDetail2 = React.useCallback(
    id => {
      history.push(path.join(DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE, `${id}`));
    },
    [history],
  );

  const handleChangeRequestState = React.useCallback(
    directSalesOrder => {
      if (tab === 1) {
        Modal.confirm({
          content: translate('directSalesOrders.noti.send'),

          onOk() {
            directSalesOrderOwnerRepository
              .get(directSalesOrder.id)
              .then(res => {
                directSalesOrderOwnerRepository.send(res).then(() => {
                  setLoadList(true);
                });
              });
          },
        });
      }
      if (tab === 2) {
        handleGoDetail2(directSalesOrder.id);
      }
    },
    [translate, setLoadList, tab, handleGoDetail2],
  );

  const columns: ColumnProps<DirectSalesOrder>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<DirectSalesOrder>(pagination),
        },
        {
          title: translate('directSalesOrders.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<DirectSalesOrder>(
            nameof(list[0].code),
            sorter,
          ),
          ellipsis: true,
        },
        {
          title: translate('directSalesOrders.buyerStore'),
          key: nameof(list[0].buyerStore),
          dataIndex: nameof(list[0].buyerStore),
          sorter: true,
          sortOrder: getOrderTypeForTable<DirectSalesOrder>(
            nameof(list[0].buyerStore),
            sorter,
          ),
          render(buyerStore: Store) {
            return buyerStore?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('directSalesOrders.saleEmployee'),
          key: nameof(list[0].saleEmployee),
          dataIndex: nameof(list[0].saleEmployee),
          sorter: true,
          sortOrder: getOrderTypeForTable<DirectSalesOrder>(
            nameof(list[0].saleEmployee),
            sorter,
          ),
          render(saleEmployee: AppUser) {
            return saleEmployee?.displayName;
          },
          ellipsis: true,
        },
        {
          title: translate('directSalesOrders.orderDate'),
          key: nameof(list[0].orderDate),
          dataIndex: nameof(list[0].orderDate),
          sorter: true,
          sortOrder: getOrderTypeForTable<DirectSalesOrder>(
            nameof(list[0].orderDate),
            sorter,
          ),
          render(...[orderDate]) {
            return formatDate(orderDate);
          },
          ellipsis: true,
          align: 'center',
        },
        {
          title: translate('directSalesOrders.total'),
          key: nameof(list[0].total),
          dataIndex: nameof(list[0].total),
          sorter: true,
          sortOrder: getOrderTypeForTable<DirectSalesOrder>(
            nameof(list[0].total),
            sorter,
          ),
          render(...[total]) {
            return formatNumber(total);
          },
          align: 'right',
          // ellipsis: true,
        },
        {
          title: translate('directSalesOrders.requestState'),
          key: nameof(list[0].requestState),
          dataIndex: nameof(list[0].requestState),
          align: 'center',
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
          ellipsis: true,
        },
        {
          title: translate('directSalesOrders.isEditedPrice'),
          key: nameof(list[0].editedPriceStatusId),
          dataIndex: nameof(list[0].editedPriceStatusId),
          sorter: true,
          sortOrder: getOrderTypeForTable<DirectSalesOrder>(
            nameof(list[0].editedPriceStatusId),
            sorter,
          ),
          align: 'center',
          render(...[editedPriceStatusId]) {
            return (
              <div className={editedPriceStatusId === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
          ellipsis: true,
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: 160,
          align: 'center',
          render(id: number, directSalesOrder: DirectSalesOrder) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {tab !== 3 && (
                  <Tooltip title={translate(generalLanguageKeys.actions.send)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() =>
                        handleChangeRequestState(directSalesOrder)
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

                {tab === 1 && validAction('update') && (
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
                {!directSalesOrder.used && validAction('delete') && tab === 1 && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(directSalesOrder)}
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
                {validAction('export') && (
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.export)}
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
export default DirectSalesOrderOwnerMasterTab;
