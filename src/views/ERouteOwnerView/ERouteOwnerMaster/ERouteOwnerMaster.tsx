import { Tabs } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_E_ROUTE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { E_ROUTE_OWNER_DETAIL_ROUTE, E_ROUTE_OWNER_ROUTE } from 'config/route-consts';
import { DateFilter } from 'core/filters/DateFilter';
import { crudService, routerService } from 'core/services';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERoute } from 'models/ERoute';
import { ERouteFilter } from 'models/ERouteFilter';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { StoreFilter } from 'models/StoreFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteOwnerRepository } from '../ERouteOwnerRepository';
import './ERouteOwnerMaster.scss';
import ErouteOwnerMasterTab from './ErouteOwnerMasterNew/ErouteOwnerMasterTab';
import ERouteOwnerPreview from './ERouteOwnerPreview';
import { eRouteOwnerService } from './ERouteOwnerService';
import queryString from 'query-string';
import HistoryModal from './HistoryModal/HistoryModal';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';


const { Item: FormItem } = Form;
const { TabPane } = Tabs;

function ERouteOwnerMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();


  const { validAction } = crudService.useAction('e-route', API_E_ROUTE_ROUTE);
  const [tabIndex, setTabIndex] = React.useState<number>(2);
  const [firstTime, setFirstTime] = React.useState<boolean>(true);

  const [
    filter,
    setFilter,
    loading,
    setLoading,
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
    setLoadList,
    ,
    ,
    listNew,
    ,
    listPending,
    ,
    listCompleted,
    ,
    totalNew,
    totalPending,
    totalCompleted,
  ] = eRouteOwnerService.useMaster<ERoute, ERouteFilter>(
    ERoute,
    ERouteFilter,
    eRouteOwnerRepository.get,
    eRouteOwnerRepository.countNew,
    eRouteOwnerRepository.listNew,
    eRouteOwnerRepository.countPending,
    eRouteOwnerRepository.listPending,
    eRouteOwnerRepository.countCompleted,
    eRouteOwnerRepository.listCompleted,
    tabIndex,
    firstTime,
    setFirstTime,
  );

  const [, handleGoDetail] = routerService.useMasterNavigation(
    E_ROUTE_OWNER_DETAIL_ROUTE,
  );

  const [
    pagination2,
    sorter2,
    ,
    newHandleTableChange2,
  ] = tableService.useMasterTable(filter, setFilter, totalNew, handleSearch);
  const [
    pagination3,
    sorter3,
    ,
    newHandleTableChange3,
  ] = tableService.useMasterTable(
    filter,
    setFilter,
    totalPending,
    handleSearch,
  );
  const [
    pagination4,
    sorter4,
    ,
    newHandleTableChange4,
  ] = tableService.useMasterTable(
    filter,
    setFilter,
    totalCompleted,
    handleSearch,
  );

  /**
   * rowSelection, hasSelectedAll
   */
  // const [rowSelection, hasSelected] = tableService.useRowSelection<ERoute>(
  //   [],
  //   undefined,
  //   resetSelect,
  //   setResetSelect,
  // );

  const [eRouteTypeList] = crudService.useEnumList<Status>(
    eRouteOwnerRepository.filterListErouteType,
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
  const [tabActive, setTabActive] = React.useState<string>('new');
  const [historyVisible, setHitoryVisible] = React.useState<boolean>(false);
  const [requestStateStatusFilter, setRequestStateStatusFilter] = React.useState<
    RequestStateStatusFilter
  >(new RequestStateStatusFilter());

  React.useEffect(() => {
    const tab = (queryString.parse(search) as any)?.tab;
    if (tab) {
      const tabTmp = tab.split('/');
      setTabActive(tabTmp[0]);
      if (tabTmp[0] === 'new') {
        setTabIndex(2);
      } else if (tabTmp[0] === 'progressing') {
        setTabIndex(3);
      } else if (tabTmp[0] === 'processed') {
        setTabIndex(4);
      }
    }
    setFirstTime(true);
  }, [search]);


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

      history.push(path.join(E_ROUTE_OWNER_ROUTE + search + '#' + id));
      eRouteOwnerRepository.get(id).then((eRoute: ERoute) => {
        setPreviewModel(eRoute);
        setPreviewVisible(true);
      });
    },

    [history, search],
  );
  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(E_ROUTE_OWNER_ROUTE + temp[0]);
  }, [history, search]);

  crudService.usePopupQuery(handleOpenPreview);


  const onChangeTabIndex = React.useCallback(
    key => {
      if (key === 'new') {
        setTabIndex(2);
        filter.orderBy = 'createdAt';
        filter.orderType = 'DESC';
      } else if (key === 'progressing') {
        setTabIndex(3);
        filter.orderBy = 'updatedAt';
        filter.orderType = 'DESC';
      } else {
        setTabIndex(4);
        filter.orderBy = 'updatedAt';
        filter.orderType = 'DESC';
      }
      setFilter({
        ...filter,
        tab: key,
        skip: 0,
      });
      setLoadList(true);
    },
    [filter, setFilter, setLoadList],
  );


  const handleViewHistory = React.useCallback(
    (id: number) => {
      history.push(path.join(E_ROUTE_OWNER_ROUTE + search));
      eRouteOwnerRepository
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
    history.push(path.join(E_ROUTE_OWNER_ROUTE + search));
  }, [history, search]);


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
                      getList={eRouteOwnerRepository.filterListOrganization}
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
                      getList={eRouteOwnerRepository.filterListAppUser}
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
                      getList={eRouteOwnerRepository.filterListStore}
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
                      getList={eRouteOwnerRepository.filterListErouteType}
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
                      getList={eRouteOwnerRepository.filterListStatus}
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
                        eRouteOwnerRepository.singleListRequestState
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
        <Tabs activeKey={tabActive} className="tab" onChange={onChangeTabIndex}>
          <TabPane
            key="new"
            // eslint-disable-next-line no-useless-concat
            tab={
              translate('eRoutes.master.tabs.new') +
              ' ( ' +
              `${totalNew}` +
              ' )'
            }
          >
            <ErouteOwnerMasterTab
              filter={filter}
              setFilter={setFilter}
              pagination={pagination2}
              list={listNew}
              sorter={sorter2}
              handleOpenPreview={handleOpenPreview}
              previewModel={previewModel}
              total={totalNew}
              handleGoDetail={handleGoDetail}
              loading={loading}
              handleSearch={handleSearch}
              handleViewHistory={handleViewHistory}
              tab={1}
              setLoadList={setLoadList}
              handleTableChange={newHandleTableChange2}
              setLoading={setLoading}
            />
          </TabPane>
          <TabPane
            key="progressing"
            // eslint-disable-next-line no-useless-concat
            tab={
              translate('eRoutes.master.tabs.progressing') +
              ' ( ' +
              `${totalPending}` +
              ' )'
            }
          >
            <ErouteOwnerMasterTab
              filter={filter}
              setFilter={setFilter}
              pagination={pagination3}
              list={listPending}
              sorter={sorter3}
              handleOpenPreview={handleOpenPreview}
              previewModel={previewModel}
              total={totalPending}
              handleGoDetail={handleGoDetail}
              loading={loading}
              handleSearch={handleSearch}
              handleViewHistory={handleViewHistory}
              tab={2}
              setLoadList={setLoadList}
              handleTableChange={newHandleTableChange3}
            />
          </TabPane>
          <TabPane
            key="processed"
            // eslint-disable-next-line no-useless-concat
            tab={
              translate('eRoutes.master.tabs.processed') +
              ' ( ' +
              `${totalCompleted}` +
              ' )'
            }
          >
            <ErouteOwnerMasterTab
              filter={filter}
              setFilter={setFilter}
              pagination={pagination4}
              list={listCompleted}
              sorter={sorter4}
              handleOpenPreview={handleOpenPreview}
              previewModel={previewModel}
              total={totalCompleted}
              handleGoDetail={handleGoDetail}
              loading={loading}
              handleSearch={handleSearch}
              handleViewHistory={handleViewHistory}
              tab={3}
              setLoadList={setLoadList}
              handleTableChange={newHandleTableChange4}
            />
          </TabPane>
        </Tabs>
        <ERouteOwnerPreview
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

export default ERouteOwnerMaster;
