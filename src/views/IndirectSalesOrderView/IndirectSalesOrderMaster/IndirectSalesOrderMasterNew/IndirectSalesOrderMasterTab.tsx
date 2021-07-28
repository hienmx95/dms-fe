import { Tooltip } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import Table, { ColumnProps, SorterResult } from 'antd/lib/table';
import { API_INDIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INDIRECT_SALES_ORDER_DETAIL_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import { getOrderTypeForTable, renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { AppUser } from 'models/AppUser';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { Store } from 'models/Store';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';


export interface IndirectSalesOrderMasterTabProps {
  filter?: UnitOfMeasureFilter;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  pagination?: PaginationProps;
  list?: IndirectSalesOrder[];
  sorter?: SorterResult<IndirectSalesOrder>;
  handleOpenPreview?: (id: number | string) => void;
  handleGoDetail?: (id: number | string) => void;
  handleDelete?: (indirectSalesOrder: IndirectSalesOrder) => void;
  loading?: boolean;
  handleGoCreate?: () => void;
  previewModel?: IndirectSalesOrder;
  total?: number;
  handleTableChange?: (newPagination: PaginationProps,
    filters: Record<string, any>,
    newSorter: SorterResult<IndirectSalesOrder>) => void;

  handleSearch?: () => void;

  handleViewHistory?: (id: number | string) => void;

  tab?: boolean;
}

function IndirectSalesOrderMasterTab(
  props: IndirectSalesOrderMasterTabProps,
) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'indirect-sales-order',
    API_INDIRECT_SALES_ORDER_ROUTE,
  );
  const {
    filter,
    setFilter,
    list,
    handleOpenPreview,
    handleDelete,
    loading,
    previewModel,
    total,
    handleSearch,
    handleViewHistory,
    tab,
  } = props;


  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );


  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    INDIRECT_SALES_ORDER_DETAIL_ROUTE,
  );


  const columns: ColumnProps<IndirectSalesOrder>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<IndirectSalesOrder>(pagination),
        },
        {
          title: translate('indirectSalesOrders.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].code),
            sorter,
          ),
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.buyerStore'),
          key: nameof(list[0].buyerStore),
          dataIndex: nameof(list[0].buyerStore),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].buyerStore),
            sorter,
          ),
          render(buyerStore: Store) {
            return buyerStore?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.sellerStore'),
          key: nameof(list[0].sellerStore),
          dataIndex: nameof(list[0].sellerStore),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].sellerStore),
            sorter,
          ),
          render(sellerStore: Store) {
            return sellerStore?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.saleEmployee'),
          key: nameof(list[0].saleEmployee),
          dataIndex: nameof(list[0].saleEmployee),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
            nameof(list[0].saleEmployee),
            sorter,
          ),
          render(saleEmployee: AppUser) {
            return saleEmployee?.displayName;
          },
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.orderDate'),
          key: nameof(list[0].orderDate),
          dataIndex: nameof(list[0].orderDate),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
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
          title: translate('indirectSalesOrders.total'),
          key: nameof(list[0].total),
          dataIndex: nameof(list[0].total),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
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
          title: translate('indirectSalesOrders.requestState'),
          key: nameof(list[0].requestStateId),
          dataIndex: nameof(list[0].requestStateId),
          align: 'center',
          render(...[requestStateId]) {
            return (
              <>
                {requestStateId && requestStateId === 1 && (
                  <div className="new-state ml-4">
                    {translate(generalLanguageKeys.state.new)}
                  </div>
                )}
                {requestStateId && requestStateId === 2 && (
                  <div className="pending-state ml-4">
                    {translate(generalLanguageKeys.state.pending)}
                  </div>
                )}
                {requestStateId && requestStateId === 3 && (
                  <div className="approved-state ml-4">
                    {translate(generalLanguageKeys.state.approved)}
                  </div>
                )}
                {requestStateId && requestStateId === 4 && (
                  <div className="rejected-state ml-4">
                    {translate(generalLanguageKeys.state.rejected)}
                  </div>
                )}
              </>
            );
          },
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.isEditedPrice'),
          key: nameof(list[0].editedPriceStatusId),
          dataIndex: nameof(list[0].editedPriceStatusId),
          sorter: true,
          sortOrder: getOrderTypeForTable<IndirectSalesOrder>(
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
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, indirectSalesOrder: IndirectSalesOrder) {
            return (
              <div className="d-flex justify-content-center button-action-table">
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
                {
                  !tab && <Tooltip title={translate(generalLanguageKeys.actions.history)}>
                    <button
                      className="btn btn-link"
                      onClick={() => handleViewHistory(id)}
                    >
                      <i className="tio-history" aria-hidden="true" />
                    </button>
                  </Tooltip>
                }

                {validAction('update') && (
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
                {
                  !indirectSalesOrder.used && validAction('delete') &&

                  <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleDelete(indirectSalesOrder)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                }
              </div>
            );
          },
        },

      ];
    },
    // tslint:disable-next-line:max-line-length
    [handleDelete, handleGoDetail, handleOpenPreview, handleViewHistory, list, pagination, sorter, translate, validAction, tab],
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
export default IndirectSalesOrderMasterTab;
