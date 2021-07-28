import { notification, Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_INDIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import {
  INDIRECT_SALES_ORDER_DETAIL_ROUTE,
  INDIRECT_SALES_ORDER_ROUTE,
} from 'config/route-consts';
import { DateFilter } from 'core/filters';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { EditPriceStatusFilter } from 'models/EditPriceStatusFilter';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { StatusFilter } from 'models/StatusFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { indirectSalesOrderRepository } from 'views/IndirectSalesOrderView/IndirectSalesOrderRepository';
import HistoryModal from 'views/IndirectSalesOrderViewOwner/IndirectSalesOrderOwnerMaster/HistoryModal/HistoryModal';
import IndirectSalesOrderPreview from 'views/IndirectSalesOrderViewOwner/IndirectSalesOrderOwnerMaster/IndirectSalesOrderPreview';
import './IndirectSalesOrderMaster.scss';

const { Item: FormItem } = Form;

function IndirectSalesOrderMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();

  const { validAction } = crudService.useAction(
    'indirect-sales-order',
    API_INDIRECT_SALES_ORDER_ROUTE,
  );
  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    ,
    total,
    previewLoading,
    ,
    ,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
  ] = crudService.useMaster<IndirectSalesOrder, IndirectSalesOrderFilter>(
    IndirectSalesOrder,
    IndirectSalesOrderFilter,
    indirectSalesOrderRepository.count,
    indirectSalesOrderRepository.list,
    indirectSalesOrderRepository.getDetail,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const [handleGoCreate] = routerService.useMasterNavigation(
    INDIRECT_SALES_ORDER_DETAIL_ROUTE,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [buyerStoreFilter, setBuyerStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [sellerStoreFilter, setSellerStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [editPriceStatusFilter, setEditPriceStatusFilter] = React.useState<
    EditPriceStatusFilter
  >(new EditPriceStatusFilter());

  const [
    requestStateStatusFilter,
    setRequestStateStatusFilter,
  ] = React.useState<RequestStateStatusFilter>(new RequestStateStatusFilter());

  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);

  const [previewModel, setPreviewModel] = React.useState<IndirectSalesOrder>(
    new IndirectSalesOrder(),
  );

  const [historyVisible, setHitoryVisible] = React.useState<boolean>(false);
  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StatusFilter
  >(new StatusFilter());

  const [handleExport, isError, setIsError] = crudService.useExport(
    indirectSalesOrderRepository.export,
    filter,
  );

  const [
    handleExportDetail,
    isErrorDetail,
    setIsErrorDetail,
  ] = crudService.useExport(indirectSalesOrderRepository.exportDetail, filter);

  React.useEffect(() => {
    if (isError) {
      notification.error({
        message: translate('indirectSalesOrders.errorExport'),
      });
      setIsError(false);
    }

    if (isErrorDetail) {
      notification.error({
        message: translate('indirectSalesOrders.errorExport'),
      });
      setIsErrorDetail(false);
    }
  }, [isError, translate, setIsError, setIsErrorDetail, isErrorDetail]);

  const handleFilterOrganization = React.useCallback(
    event => {
      const organizationId = event.equal;
      if (appUserFilter.organizationId.equal !== organizationId) {
        filter.organizationId.equal = organizationId;
        filter.appUserId.equal = undefined;
        setFilter({ ...filter });
        handleSearch();
      }
      appUserFilter.organizationId.equal = organizationId;
    },
    [appUserFilter.organizationId.equal, filter, handleSearch, setFilter],
  );

  const handleOpenPreview = React.useCallback(
    (id: number) => {
      history.push(path.join(INDIRECT_SALES_ORDER_ROUTE + search + '#' + id));
      indirectSalesOrderRepository
        .getDetail(id)
        .then((indirectSalesOrder: IndirectSalesOrder) => {
          setPreviewModel(indirectSalesOrder);
          setPreviewVisible(true);
        });
    },
    [history, setPreviewModel, setPreviewVisible, search],
  );

  crudService.usePopupQuery(handleOpenPreview);

  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(path.join(INDIRECT_SALES_ORDER_ROUTE + temp[0]));
  }, [history, search]);

  const handleViewHistory = React.useCallback(
    (id: number) => {
      history.push(path.join(INDIRECT_SALES_ORDER_ROUTE));
      indirectSalesOrderRepository
        .getDetail(id)
        .then((indirectSalesOrder: IndirectSalesOrder) => {
          setPreviewModel(indirectSalesOrder);
          setHitoryVisible(true);
        });
    },
    [history],
  );

  const handleCloseHistoryModal = React.useCallback(() => {
    setHitoryVisible(false);
    history.push(path.join(INDIRECT_SALES_ORDER_ROUTE));
  }, [history]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'orderDate') {
          filter.orderDate.lessEqual = f.lessEqual;
          filter.orderDate.greaterEqual = undefined;
          filter.orderDate.greaterEqual = f.greaterEqual;
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
          key: nameof(list[0].requestState),
          dataIndex: nameof(list[0].requestState),
          align: 'center',
          render(...[requestState]) {
            return (
              <>
                {requestState && requestState?.id === 1 && (
                  <div className="new-state ml-4">{requestState?.name}</div>
                )}
                {requestState && requestState?.id === 2 && (
                  <div className="pending-state ml-4">{requestState?.name}</div>
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
          title: translate('indirectSalesOrders.isEditedPrice'),
          key: nameof(list[0].editedPriceStatusId),
          dataIndex: nameof(list[0].editedPriceStatusId),
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
                {indirectSalesOrder?.requestStateId !== 1 && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.history)}
                  >
                    <button
                      className="btn btn-link"
                      onClick={() => handleViewHistory(id)}
                    >
                      <i className="tio-history" aria-hidden="true" />
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
      handleOpenPreview,
      handleViewHistory,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );

  return (
    <div className="page master-page">
      <Card
        title={translate('indirectSalesOrders.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.startWith)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.code',
                    )}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('indirectSalesOrders.buyerStore')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.buyerStoreId}
                      filterType={nameof(filter.buyerStoreId.equal)}
                      value={filter.buyerStoreId.equal}
                      onChange={handleFilter(nameof(filter.buyerStoreId))}
                      getList={indirectSalesOrderRepository.filterListStore}
                      modelFilter={buyerStoreFilter}
                      setModelFilter={setBuyerStoreFilter}
                      searchField={nameof(buyerStoreFilter.name)}
                      searchType={nameof(buyerStoreFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('indirectSalesOrders.sellerStore')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.sellerStoreId}
                      filterType={nameof(filter.sellerStoreId.equal)}
                      value={filter.sellerStoreId.equal}
                      onChange={handleFilter(nameof(filter.sellerStoreId))}
                      getList={indirectSalesOrderRepository.filterListStore}
                      modelFilter={sellerStoreFilter}
                      setModelFilter={setSellerStoreFilter}
                      searchField={nameof(sellerStoreFilter.name)}
                      searchType={nameof(sellerStoreFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListEditPriceStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('indirectSalesOrders.isEditedPrice')}
                  >
                    <AdvancedIdFilter
                      filter={filter.editedPriceStatusId}
                      filterType={nameof(filter.editedPriceStatusId.equal)}
                      value={filter.editedPriceStatusId.equal}
                      onChange={handleFilter(
                        nameof(filter.editedPriceStatusId),
                      )}
                      getList={
                        indirectSalesOrderRepository.filterListEditPriceStatus
                      }
                      modelFilter={editPriceStatusFilter}
                      setModelFilter={setEditPriceStatusFilter}
                      searchField={nameof(editPriceStatusFilter.name)}
                      searchType={nameof(editPriceStatusFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('eRoutes.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilterOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={
                        indirectSalesOrderRepository.filterListOrganization
                      }
                      searchField={nameof(organizationFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('indirectSalesOrders.saleEmployee')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      getList={indirectSalesOrderRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.orderDate')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.orderDate))}
                    placeholder={[
                      translate('eRoutes.placeholder.startDate'),
                      translate('eRoutes.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.total')}
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
            </Row>
            <Row>
              {validAction('filterListRequestState') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('indirectSalesOrders.requestState')}
                  >
                    <AdvancedIdFilter
                      filter={filter.requestStateId}
                      filterType={nameof(filter.requestStateId.equal)}
                      value={filter.requestStateId.equal}
                      onChange={handleFilter(nameof(filter.requestStateId))}
                      getList={
                        indirectSalesOrderRepository.filterListRequestState
                      }
                      modelFilter={requestStateStatusFilter}
                      setModelFilter={setRequestStateStatusFilter}
                      searchField={nameof(requestStateStatusFilter.name)}
                      searchType={nameof(requestStateStatusFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('indirectSalesOrders.storeStatus')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilter(nameof(filter.storeStatusId))}
                      getList={
                        indirectSalesOrderRepository.filterListStoreStatus
                      }
                      modelFilter={storeStatusFilter}
                      setModelFilter={setStoreStatusFilter}
                      searchField={nameof(storeStatusFilter.name)}
                      searchType={nameof(storeStatusFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('filterListAppUser') && (
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
                  {validAction('exportDetail') && (
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={handleExportDetail}
                    >
                      <i className="tio-file_outlined mr-2" />
                      {translate('indirectSalesOrders.actions.export')}
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

        <IndirectSalesOrderPreview
          indirectSalesOrder={previewModel}
          indirectSalesOrderContent={previewModel?.indirectSalesOrContents}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
        />
        <HistoryModal
          title={translate('indirectSalesOrders.history.title')}
          list={previewModel?.requestWorkflowStepMappings}
          isOpen={historyVisible}
          handleClose={handleCloseHistoryModal}
        />
      </Card>
    </div>
  );
}

export default IndirectSalesOrderMaster;
