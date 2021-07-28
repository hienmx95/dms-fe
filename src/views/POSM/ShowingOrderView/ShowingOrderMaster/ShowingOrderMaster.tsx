import { notification, Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import { AxiosError } from 'axios';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedIdMultiFilter from 'components/AdvancedIdMultiFilter/AdvancedIdMultiFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_SHOWING_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { SHOWING_ORDER_DETAIL_ROUTE } from 'config/route-consts';
import { DateFilter } from 'core/filters';
import { formatDateTime } from 'core/helpers/date-time';
import { formatNumber } from 'core/helpers/number';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUserFilter } from 'models/AppUserFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { ShowingOrder } from 'models/posm/ShowingOrder';
import { ShowingOrderFilter } from 'models/posm/ShowingOrderFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { showingOrderRepository } from '../ShowingOrderRepository';
import './ShowingOrderMaster.scss';
import ShowingOrderPreview from './ShowingOrderPreview';

const { Item: FormItem } = Form;

function ShowingOrderMaster() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'showing-order',
    API_SHOWING_ORDER_ROUTE,
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
    ,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<ShowingOrder, ShowingOrderFilter>(
    ShowingOrder,
    ShowingOrderFilter,
    showingOrderRepository.count,
    showingOrderRepository.list,
    showingOrderRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    SHOWING_ORDER_DETAIL_ROUTE,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  /**
   * rowSelection, hasSelectedAll
   */
  const [rowSelection, hasSelected] = tableService.useRowSelection<
    ShowingOrder
  >([], undefined, resetSelect, setResetSelect);

  const [handleExport] = crudService.useExport(
    showingOrderRepository.export,
    filter,
  );

  const [handleDelete] = tableService.useDeleteHandler<ShowingOrder>(
    showingOrderRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    showingOrderRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [itemFilter, setItemFilter] = React.useState<ShowingItemFilter>(
    new ShowingItemFilter(),
  );

  // const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
  //   new StatusFilter(),
  // );

  const [defaultListItem, setDefaultListItem] = React.useState<ShowingItem[]>(
    [],
  );
  const [loadItem, setLoadItem] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (loadItem) {
      showingOrderRepository
        .filterListShowingItem(itemFilter)
        .then(res => {
          setDefaultListItem(res);
          setLoadItem(false);
        })
        .catch((error: AxiosError) => {
          notification.error(error);
        });
    }

    setDateFilter({ ...filter.date });
  }, [filter, itemFilter, loadItem, setDateFilter, translate]);

  const columns: ColumnProps<ShowingOrder>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<ShowingOrder>(pagination),
        },

        {
          title: translate('showingOrders.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          width: 80,
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<ShowingOrder>(
            nameof(list[0].code),
            sorter,
          ),

          render(...[, showingOrder]) {
            return (
              <div
                className="display-code"
                onClick={handleOpenPreview(showingOrder.id)}
              >
                {showingOrder.code}
              </div>
            );
          },
        },

        {
          title: translate('showingOrders.storeCode'),
          key: nameof(list[0].storeCode),
          dataIndex: nameof(list[0].store),
          width: 80,
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<ShowingOrder>(
            nameof(list[0].store),
            sorter,
          ),
          render(store: Store) {
            return store?.code;
          },
        },

        {
          title: translate('showingOrders.storeName'),
          key: nameof(list[0].storeName),
          dataIndex: nameof(list[0].store),
          sorter: true,
          ellipsis: true,

          sortOrder: getOrderTypeForTable<ShowingOrder>(
            nameof(list[0].store),
            sorter,
          ),
          render(store: Store) {
            return store?.name;
          },
        },
        {
          title: translate('showingOrders.storeAddress'),
          key: nameof(list[0].storeAddress),
          dataIndex: nameof(list[0].store),
          sorter: true,
          ellipsis: true,

          sortOrder: getOrderTypeForTable<ShowingOrder>(
            nameof(list[0].store),
            sorter,
          ),
          render(store: Store) {
            return store?.address;
          },
        },
        {
          title: translate('showingOrders.total'),
          key: nameof(list[0].total),
          dataIndex: nameof(list[0].total),
          sorter: true,
          ellipsis: true,
          width: 120,
          sortOrder: getOrderTypeForTable<ShowingOrder>(
            nameof(list[0].total),
            sorter,
          ),
          align: 'right',
          render(...[total]) {
            return (
              <div style={{ textAlign: 'right' }}>{formatNumber(total)}</div>
            );
          },
        },
        {
          title: translate('showingOrders.date'),
          key: nameof(list[0].date),
          dataIndex: nameof(list[0].date),
          ellipsis: true,
          sorter: true,
          width: 120,
          sortOrder: getOrderTypeForTable<ShowingOrder>(
            nameof(list[0].date),
            sorter,
          ),
          render(...[date]) {
            return formatDateTime(date);
          },
        },
        // {
        //   title: translate('showingOrders.status'),
        //   key: nameof(list[0].status),
        //   dataIndex: nameof(list[0].status),
        //   sorter: true,
        //   sortOrder: getOrderTypeForTable<ShowingOrder>(
        //     nameof(list[0].status),
        //     sorter,
        //   ),
        //   align: 'center',
        //   render(status: Status) {
        //     return (
        //       <div className={status.id === 1 ? 'active' : ''}>
        //         <i className="fa fa-check-circle d-flex justify-content-center"></i>
        //       </div>
        //     );
        //   },
        // },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, showingOrder: ShowingOrder) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}
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

                {!showingOrder.used && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(showingOrder)}
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
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'date') {
          filter.date.lessEqual = f.lessEqual;
          filter.date.greaterEqual = undefined;
          filter.date.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
      };
    },
    [filter, handleSearch, setFilter],
  );

  const handleResetFilter = React.useCallback(() => {
    handleReset();
    setDateFilter(new DateFilter());
  }, [handleReset]);

  const handleChange = React.useCallback(
    event => {
      filter.showingItemId.in = event?.in;
      setFilter({ ...filter });
      handleSearch();
    },
    [setFilter, filter, handleSearch],
  );

  return (
    <div className="page master-page">
      <Card title={translate('showingOrders.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                {' '}
                {validAction('filterListOrganization') && (
                  <FormItem
                    className="mb-1"
                    label={translate('showingOrders.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={showingOrderRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                )}
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('showingOrders.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(previewModel.code))}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('showingOrders.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                {validAction('filterListStore') && (
                  <FormItem
                    className="mb-0"
                    label={translate('showingOrders.store')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilter(nameof(filter.storeId))}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      getList={showingOrderRepository.filterListStore}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      placeholder={translate('showingOrders.placeholder.store')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                )}
              </Col>
              <Col className="pl-1" span={6}>
                {validAction('filterListShowingItem') && (
                  <FormItem
                    className="mb-0"
                    label={translate(
                      'salesOrderByEmployeeAndItemsReports.item',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdMultiFilter
                      filter={filter.showingItemId}
                      filterType={nameof(filter.showingItemId.in)}
                      onChange={handleChange}
                      getList={showingOrderRepository.filterListShowingItem}
                      modelFilter={itemFilter}
                      setModelFilter={setItemFilter}
                      searchField={nameof(itemFilter.search)}
                      value={filter.showingItemId.in}
                      list={defaultListItem}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                {validAction('filterListAppUser') && (
                  <FormItem
                    className="mb-1"
                    label={translate('showingOrders.appUser')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      getList={showingOrderRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                )}
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrders.date')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.date))}
                    placeholder={[
                      translate('showingOrders.placeholder.startDate'),
                      translate('showingOrders.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('showingOrders.total')}
                  labelAlign="left"
                >
                  <div className="d-flex">
                    <AdvancedNumberFilter
                      filterType={nameof(filter.total.range)}
                      filter={filter.total}
                      onChange={handleFilter(nameof(filter.total))}
                      className="w-100"
                    />
                  </div>
                </FormItem>
              </Col>
              {/* <Col className="pl-1" span={6}>
                {validAction('filterListStatus') && (
                  <FormItem
                    className="mb-0"
                    label={translate('appUsers.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={showingOrderRepository.singleListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      searchType={nameof(statusFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                )}
              </Col> */}
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleResetFilter}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          onChange={handleTableChange}
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
                  {validAction('bulkDelete') && (
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={!hasSelected}
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
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
        {/* <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
        /> */}
        <ShowingOrderPreview
          previewModel={previewModel}
          previewLoading={previewLoading}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          list={previewModel?.showingOrderContents}
        />
      </Card>
    </div>
  );
}

export default ShowingOrderMaster;
