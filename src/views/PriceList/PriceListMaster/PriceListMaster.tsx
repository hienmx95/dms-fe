import { Col, Form, Row, Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_PRICELIST_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { SALEPRICE_DETAIL_ROUTE, SALEPRICE_ROUTE } from 'config/route-consts';
import { formatDateTime } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import {
  PriceList,
  PriceListType,
  PriceListTypeFilter,
  SalesOrderType,
  SalesOrderTypeFilter,
} from 'models/priceList/PriceList';
import { PriceListFilter } from 'models/priceList/PriceListFilter';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Moment } from 'moment';
import path from 'path';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import HistoryModal from 'views/PriceListOwner/PriceListOwnerMaster/HistoryModal/HistoryModal';
import PreviewPriceList from 'views/PriceListOwner/PriceListOwnerMaster/PriceListPreview';
import '../PriceList.scss';
import { priceListRepository } from '../PriceListRepository';
import { priceListService } from '../PriceListService';

const { Item: FormItem } = Form;

export default function PriceListOwnerMaster() {
  const [translate] = useTranslation();
  const history = useHistory();

  const { validAction } = crudService.useAction(
    'price-list',
    API_PRICELIST_ROUTE,
  );

  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    setLoading,
    total, // previewLoading, // previewVisible,
    ,
    ,
    previewModel, // handleClosePreview,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset, // handleDefaultSearch, // setLoadList
    handleDefaultSearch,
    ,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<PriceList, PriceListFilter>(
    PriceList,
    PriceListFilter,
    priceListRepository.count,
    priceListRepository.list,
    priceListRepository.getDetail,
  );

  const {
    model,
    setModel,
    previewLoading,
    previewVisible,
    handleOpenPreview,
    handleClosePreview,
  } = priceListService.usePreview();

  const {
    statusFilter,
    setStatusFilter,
    organizationFilter,
    setOrganizationFilter,
    priceListTypeFilter,
    setPriceListTypeFilter,
    saleOrderTypeFilter,
    setSaleOrderTypeFilter,
  } = usePriceListFilter();

  const [requestStateStatusFilter, setRequestStateStatusFilter] = React.useState<
    RequestStateStatusFilter
  >(new RequestStateStatusFilter());

  const [previewHistoryModel, setPreviewHistoryModel] = React.useState<PriceList>(
    new PriceList(),
  );

  const [historyVisible, setHitoryVisible] = React.useState<boolean>(false);

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [handleGoCreate] = routerService.useMasterNavigation(
    SALEPRICE_DETAIL_ROUTE,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<PriceList>(
    [],
    undefined,
    resetSelect,
    setResetSelect,
  );


  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    priceListRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const handleViewHistory = React.useCallback(
    (id: number) => {
      history.push(path.join(SALEPRICE_ROUTE));
      priceListRepository
        .getDetail(id)
        .then((priceList: PriceList) => {
          setPreviewHistoryModel(priceList);
          setHitoryVisible(true);
        });
    },
    [history],
  );

  const handleCloseHistoryModal = React.useCallback(() => {
    setHitoryVisible(false);
    history.push(path.join(SALEPRICE_ROUTE));
  }, [history]);


  const columns: ColumnProps<PriceList>[] = useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<PriceList>(pagination),
      },
      {
        title: translate('priceLists.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<PriceList>(
          nameof(list[0].code),
          sorter,
        ),
        // render(...[code]) {
        //   return <div className="display-code">{code}</div>;
        // },
      },
      {
        title: translate('priceLists.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<PriceList>(
          nameof(list[0].name),
          sorter,
        ),
        // render(...[name]) {
        //   return <div className="text-left">{name}</div>;
        // },
      },
      {
        title: translate('priceLists.organization'),
        key: nameof(list[0].organizationId),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        ellipsis: true,
        align: 'left',
        sortOrder: getOrderTypeForTable<PriceList>(
          nameof(list[0].organization),
          sorter,
        ),
        render(organization: Organization) {
          return organization.name;
        },
      },
      {
        title: translate('priceLists.priceListType'),
        key: nameof(list[0].priceListTypeId),
        dataIndex: nameof(list[0].priceListType),
        sorter: true,
        ellipsis: true,
        align: 'left',
        sortOrder: getOrderTypeForTable<PriceList>(
          nameof(list[0].priceListType),
          sorter,
        ),
        render(priceListType: PriceListType) {
          return priceListType.name;
        },
      },
      {
        title: translate('priceLists.salesOrderType'),
        key: nameof(list[0].salesOrderTypeId),
        dataIndex: nameof(list[0].salesOrderType),
        sorter: true,
        ellipsis: true,
        align: 'left',
        sortOrder: getOrderTypeForTable<PriceList>(
          nameof(list[0].salesOrderType),
          sorter,
        ),
        render(salesOrderType: SalesOrderType) {
          return salesOrderType.name;
        },
      },
      {
        title: translate('priceLists.updatedAt'),
        key: nameof(list[0].updatedAt),
        dataIndex: nameof(list[0].updatedAt),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<PriceList>(
          nameof(list[0].updatedAt),
          sorter,
        ),
        render(updatedAt: Moment) {
          return formatDateTime(updatedAt);
        },
      },
      {
        title: translate('priceLists.status'),
        key: nameof(list[0].statusId),
        dataIndex: nameof(list[0].status),
        align: 'center',
        sorter: true,
        sortOrder: getOrderTypeForTable<PriceList>(
          nameof(list[0].status),
          sorter,
        ),
        render(status: Status) {
          return (
            <div className={status.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },
      {
        title: translate('priceLists.requestState'),
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
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, priceList: PriceList) {
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
              {priceList?.requestStateId !== 1 && (
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
              )}
            </div>
          );
        },
      },
    ];
  }, [translate, pagination, list, sorter, validAction, handleOpenPreview, handleViewHistory]);

  return (
    <>
      <div className="page master-page">
        <Card
          title={translate('priceLists.master.title')}
          className="header-title"
        >
          {/* filter */}
          <CollapsibleCard
            className="head-borderless mb-3"
            title={translate(generalLanguageKeys.actions.search)}
          >
            <Form>
              <Row>
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('priceLists.code')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      className="w-100"
                      filter={filter.code}
                      filterType={nameof(filter.code.contain)}
                      onChange={handleFilter(nameof(filter.code))}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('priceLists.placeholder.code')}
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('priceLists.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={priceListRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      searchType={nameof(statusFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('priceLists.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={priceListRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('priceLists.priceListType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.priceListTypeId}
                      filterType={nameof(filter.priceListTypeId.equal)}
                      value={filter.priceListTypeId.equal}
                      onChange={handleFilter(nameof(filter.priceListTypeId))}
                      getList={priceListRepository.filterListPriceListType}
                      modelFilter={priceListTypeFilter}
                      setModelFilter={setPriceListTypeFilter}
                      searchField={nameof(priceListTypeFilter.name)}
                      searchType={nameof(priceListTypeFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('priceLists.name')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      className="w-100"
                      filter={filter.name}
                      filterType={nameof(filter.name.contain)}
                      onChange={handleFilter(nameof(filter.name))}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('priceLists.placeholder.name')}
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('priceLists.salesOrderType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.salesOrderTypeId}
                      filterType={nameof(filter.salesOrderTypeId.equal)}
                      value={filter.salesOrderTypeId.equal}
                      onChange={handleFilter(nameof(filter.salesOrderTypeId))}
                      getList={priceListRepository.filterListSalesOrderType}
                      modelFilter={saleOrderTypeFilter}
                      setModelFilter={setSaleOrderTypeFilter}
                      searchField={nameof(saleOrderTypeFilter.name)}
                      searchType={nameof(saleOrderTypeFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('priceLists.requestState')}
                  >
                    <AdvancedIdFilter
                      filter={filter.requestStateId}
                      filterType={nameof(filter.requestStateId.equal)}
                      value={filter.requestStateId.equal}
                      onChange={handleFilter(
                        nameof(filter.requestStateId),
                      )}
                      getList={
                        priceListRepository.filterListRequestState
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
                    onClick={handleReset}
                  >
                    <i className="tio-clear_circle_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.reset)}
                  </button>
                </>
              )}
            </div>
          </CollapsibleCard>
          {/* table */}
          <Table
            dataSource={list}
            columns={columns}
            size="small"
            tableLayout="fixed"
            loading={loading}
            rowKey={nameof(previewModel.id)}
            pagination={pagination}
            rowSelection={rowSelection}
            onChange={handleTableChange}
            title={() => (
              <>
                <div className="d-flex justify-content-between">
                  <div className="flex-shrink-1 d-flex align-items-center">
                    {/* create button */}
                    {/* {validAction('create') && ( */}
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                    {/* )} */}
                    {/* bulk delete button */}
                    {/* {validAction('bulkDelete') && ( */}
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={!hasSelected}
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                    {/* )} */}
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
          <PreviewPriceList
            model={model}
            setModel={setModel}
            previewVisible={previewVisible}
            onClose={handleClosePreview}
            previewLoading={previewLoading}
            loading={loading}
          />

          <HistoryModal
            title={translate('priceLists.history.title')}
            list={previewHistoryModel?.requestWorkflowStepMappings}
            isOpen={historyVisible}
            handleClose={handleCloseHistoryModal}
          />
        </Card>
      </div>
    </>
  );
}

function usePriceListFilter() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    new StatusFilter(),
  );
  const [organizationFilter, setOrganizationFilter] = useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [priceListTypeFilter, setPriceListTypeFilter] = useState<
    PriceListTypeFilter
  >(new PriceListTypeFilter());
  const [saleOrderTypeFilter, setSaleOrderTypeFilter] = useState<
    SalesOrderTypeFilter
  >(new SalesOrderTypeFilter());

  return {
    statusFilter,
    setStatusFilter,
    organizationFilter,
    setOrganizationFilter,
    priceListTypeFilter,
    setPriceListTypeFilter,
    saleOrderTypeFilter,
    setSaleOrderTypeFilter,
  };
}
