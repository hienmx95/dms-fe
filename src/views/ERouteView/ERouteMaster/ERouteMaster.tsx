import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_E_ROUTE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { E_ROUTE_DETAIL_ROUTE, E_ROUTE_ROUTE } from 'config/route-consts';
import { DateFilter } from 'core/filters/DateFilter';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERoute } from 'models/ERoute';
import { ERouteFilter } from 'models/ERouteFilter';
import { ERouteType } from 'models/ERouteType';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { StoreFilter } from 'models/StoreFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import HistoryModal from 'views/ERouteOwnerView/ERouteOwnerMaster/HistoryModal/HistoryModal';
import { eRouteRepository } from '../ERouteRepository';
import './ERouteMaster.scss';
import PreviewERoute from './PreviewERoute';


const { Item: FormItem } = Form;

function ERouteMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();


  const { validAction } = crudService.useAction('e-route', API_E_ROUTE_ROUTE);

  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    setLoading,
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
    ,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<ERoute, ERouteFilter>(
    ERoute,
    ERouteFilter,
    eRouteRepository.count,
    eRouteRepository.list,
    eRouteRepository.get,
  );

  const [handleGoCreate] = routerService.useMasterNavigation(
    E_ROUTE_DETAIL_ROUTE,
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
  const [rowSelection, hasSelected] = tableService.useRowSelection<ERoute>(
    [],
    undefined,
    resetSelect,
    setResetSelect,
  );

  const [eRouteTypeList] = crudService.useEnumList<Status>(
    eRouteRepository.filterListErouteType,
  );

  const [eRouteTypeFilter, setERouteTypeFilter] = React.useState<
    ERouteTypeFilter
  >(new ERouteTypeFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    StoreFilter
  >(new StoreFilter());

  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [previewModel, setPreviewModel] = React.useState<ERoute>(new ERoute());
  const [historyVisible, setHitoryVisible] = React.useState<boolean>(false);

  const [requestStateStatusFilter, setRequestStateStatusFilter] = React.useState<
    RequestStateStatusFilter
  >(new RequestStateStatusFilter());

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    eRouteRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const handleResetFilter = React.useCallback(() => {
    handleReset();
    setDateFilter(new DateFilter());
  }, [handleReset]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'startDate') {
          filter.startDate.lessEqual = f.lessEqual;
          filter.startDate.greaterEqual = undefined;
          filter.endDate.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
      };
    },
    [filter, handleSearch, setFilter],
  );

  const handleFilterOrganization = React.useCallback(
    event => {
      const organizationId = event.equal;
      if (
        appUserFilter.organizationId.equal !== organizationId ||
        storeFilter.organizationId.equal !== organizationId
      ) {
        filter.organizationId.equal = organizationId;
        filter.appUserId.equal = undefined;
        filter.storeId.equal = undefined;
        setFilter(filter);
        handleSearch();
      }
      appUserFilter.organizationId.equal = organizationId;
      storeFilter.organizationId.equal = organizationId;
    },
    [
      appUserFilter.organizationId.equal,
      filter,
      handleSearch,
      setFilter,
      storeFilter.organizationId.equal,
    ],
  );

  const handleOpenPreview = React.useCallback(
    (id: number) => {

      history.push(path.join(E_ROUTE_ROUTE + search + '#' + id));
      eRouteRepository.get(id).then((eRoute: ERoute) => {
        setPreviewModel(eRoute);
        setPreviewVisible(true);
      });
    },

    [history, search],
  );
  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(E_ROUTE_ROUTE + temp[0]);
  }, [history, search]);

  crudService.usePopupQuery(handleOpenPreview);

  const handleViewHistory = React.useCallback(
    (id: number) => {
      history.push(path.join(E_ROUTE_ROUTE + search));
      eRouteRepository
        .getDetail(id)
        .then((eRoute: ERoute) => {
          setPreviewModel(eRoute);
          setHitoryVisible(true);
        });
    },
    [history, search],
  );

  const handleCloseHistoryModal = React.useCallback(() => {
    setHitoryVisible(false);
    history.push(path.join(E_ROUTE_ROUTE + search));
  }, [history, search]);


  const columns: ColumnProps<ERoute>[] = React.useMemo(() => {
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
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, eroute: ERoute) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {/* {
                (eRoute?.requestStateId  === 1) && (
                  <Tooltip title={translate('eRoutes.approve')}>
                    <button className="btn btn-sm btn-link"
                    // onClick={handleApprove}
                    >
                    <i className="fa fa-exchange"></i>
                    </button>
                  </Tooltip>
                )
              } */}
              {/* {
                (eRoute?.requestStateId  === 4) && (
                  <Tooltip title={translate('eRoutes.changeState')}>
                    <button
                      className="btn btn-sm btn-link"
                    // onClick={handleApprove}
                    >
                      <i className="fa fa-exchange"></i>
                    </button>
                  </Tooltip>
                )
              } */}
              {/* {
                  eRoute.requestStateId === 1 && (
                    <Tooltip title={translate('eRoutes.changeEroute')}>
                      <button className="btn btn-sm btn-link"
                        onClick={handleGoERouteChangeRequest(id)}
                      >
                        <i className="tio-swap_horizontal" />
                      </button>
                    </Tooltip>

                  )
                } */}
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
              {eroute?.requestStateId !== 1 && (
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
  }, [
    handleOpenPreview,
    list,
    pagination,
    sorter,
    translate,
    validAction,
    handleViewHistory,
  ]);
  return (
    <div className="page master-page">
      <Card title={translate('eRoutes.master.title')} className="header-title">
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('eRoutes.placeholder.code')}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('eRoutes.placeholder.name')}
                  />
                </FormItem>
              </Col>
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
                      getList={eRouteRepository.filterListOrganization}
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
                    className="mb-0"
                    label={translate('eRoutes.saleEmployee')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      getList={eRouteRepository.filterListAppUser}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'eRoutes.placeholder.saleEmployee',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('eRoutes.store')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilter(nameof(filter.storeId))}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      getList={eRouteRepository.filterListStore}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      placeholder={translate('eRoutes.placeholder.store')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.startDate))}
                    placeholder={[
                      translate('eRoutes.placeholder.startDate'),
                      translate('eRoutes.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {validAction('filterListErouteType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('eRoutes.eRouteType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.eRouteTypeId}
                      filterType={nameof(filter.eRouteTypeId.equal)}
                      value={filter.eRouteTypeId.equal}
                      onChange={handleFilter(nameof(filter.eRouteTypeId))}
                      getList={eRouteRepository.filterListErouteType}
                      modelFilter={eRouteTypeFilter}
                      setModelFilter={setERouteTypeFilter}
                      searchField={nameof(eRouteTypeFilter.name)}
                      searchType={nameof(eRouteTypeFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      list={eRouteTypeList}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('eRoutes.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={eRouteRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('singleListRequestState') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('indirectSalesOrders.requestState')}
                  >
                    <AdvancedIdFilter
                      filter={filter.requestStateId}
                      filterType={nameof(filter.requestStateId.equal)}
                      value={filter.requestStateId.equal}
                      onChange={handleFilter(
                        nameof(filter.requestStateId),
                      )}
                      getList={
                        eRouteRepository.singleListRequestState
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
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleSearch}
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
          rowSelection={rowSelection}
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
        <PreviewERoute
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
          modelFilter={filter}
          setModelFilter={setFilter}
        />
        <HistoryModal
          title={translate('eRoutes.history.title')}
          list={previewModel?.requestWorkflowStepMappings}
          isOpen={historyVisible}
          handleClose={handleCloseHistoryModal}
        />
      </Card>
    </div>
  );
}

export default ERouteMaster;
