import { Tabs } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_DIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import {
  DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE,
  DIRECT_SALES_ORDER_OWNER_ROUTE,
} from 'config/route-consts';
import { DateFilter } from 'core/filters';
import { crudService, routerService } from 'core/services';
import { AppUserFilter } from 'models/AppUserFilter';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderFilter } from 'models/Direct/DirectSalesOrderFilter';
import { EditPriceStatusFilter } from 'models/EditPriceStatusFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { StatusFilter } from 'models/StatusFilter';
import { StoreFilter } from 'models/StoreFilter';
import path from 'path';
import queryString from 'query-string';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { directSalesOrderOwnerRepository } from '../DirectSalesOrderOwnerRepository';
import { directSalesOrderOwnerService } from '../DirectSalesOrderOwnerService';
import './DirectSalesOrderOwnerMaster.scss';
import DirectSalesOrderOwnerMasterTab from './DirectSalesOrderOwnerMasterTab/DirectSalesOrderOwnerMasterTab';
import DirectSalesOrderPreview from './DirectSalesOrderPreview';
import HistoryModal from './HistoryModal/HistoryModal';

const { Item: FormItem } = Form;

const { TabPane } = Tabs;
function DirectSalesOrderOwnerMaster() {
  const [translate] = useTranslation();
  const history = useHistory();

  const { validAction } = crudService.useAction(
    'direct-sales-order',
    API_DIRECT_SALES_ORDER_ROUTE,
  );


  const [tabIndex, setTabIndex] = React.useState<number>(2);
  const [firstTime, setFirstTime] = React.useState<boolean>(true);
  const [tabActive, setTabActive] = React.useState<string>('new');

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
  ] = directSalesOrderOwnerService.useMasterDirect<DirectSalesOrder, DirectSalesOrderFilter>(
    DirectSalesOrder,
    DirectSalesOrderFilter,
    directSalesOrderOwnerRepository.get,
    directSalesOrderOwnerRepository.countNew,
    directSalesOrderOwnerRepository.listNew,
    directSalesOrderOwnerRepository.countPending,
    directSalesOrderOwnerRepository.listPending,
    directSalesOrderOwnerRepository.countCompleted,
    directSalesOrderOwnerRepository.listCompleted,
    tabIndex,
    firstTime,
    setFirstTime,
  );

  const [, handleGoDetail] = routerService.useMasterNavigation(
    DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE,
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

  const [editPriceStatusFilter, setEditPriceStatusFilter] = React.useState<
    EditPriceStatusFilter
  >(new EditPriceStatusFilter());

  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [previewModel, setPreviewModel] = React.useState<DirectSalesOrder>(
    new DirectSalesOrder(),
  );
  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StatusFilter
  >(new StatusFilter());

  const [historyVisible, setHitoryVisible] = React.useState<boolean>(false);
  const [
    requestStateStatusFilter,
    setRequestStateStatusFilter,
  ] = React.useState<RequestStateStatusFilter>(new RequestStateStatusFilter());

  const { search } = useLocation();
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

  const handleFilterOrganization = React.useCallback(
    event => {
      const organizationId = event.equal;
      if (appUserFilter.organizationId.equal !== organizationId) {
        filter.organizationId.equal = organizationId;
        filter.appUserId.equal = undefined;
        setFilter(filter);
        handleSearch();
      }
      appUserFilter.organizationId.equal = organizationId;
    },
    [appUserFilter.organizationId.equal, filter, handleSearch, setFilter],
  );

  const handleOpenPreview = React.useCallback(
    (id: number) => {
      history.push(path.join(DIRECT_SALES_ORDER_OWNER_ROUTE + search + '#' + id));
      directSalesOrderOwnerRepository
        .getDetail(id)
        .then((directSalesOrder: DirectSalesOrder) => {
          setPreviewModel(directSalesOrder);
          setPreviewVisible(true);
        });
    },
    [history, setPreviewModel, search],
  );

  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(path.join(DIRECT_SALES_ORDER_OWNER_ROUTE + temp[0]));
  }, [history, setPreviewVisible, search]);

  crudService.usePopupQuery(handleOpenPreview);

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
      history.push(path.join(DIRECT_SALES_ORDER_OWNER_ROUTE + search));
      directSalesOrderOwnerRepository
        .getDetail(id)
        .then((indirectSalesOrder: DirectSalesOrder) => {
          setPreviewModel(indirectSalesOrder);
          setHitoryVisible(true);
        });
    },
    [history, search],
  );

  const handleCloseHistoryModal = React.useCallback(() => {
    setHitoryVisible(false);
    history.push(path.join(DIRECT_SALES_ORDER_OWNER_ROUTE + search));
  }, [history, search]);


  return (
    <div className="page master-page">
      <Card
        title={translate('directSalesOrders.masterOwner.title')}
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
                  label={translate('directSalesOrders.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.startWith)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate(
                      'directSalesOrders.placeholder.code',
                    )}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('directSalesOrders.buyerStore')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.buyerStoreId}
                      filterType={nameof(filter.buyerStoreId.equal)}
                      value={filter.buyerStoreId.equal}
                      onChange={handleFilter(nameof(filter.buyerStoreId))}
                      getList={directSalesOrderOwnerRepository.filterListStore}
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
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('directSalesOrders.saleEmployee')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      getList={directSalesOrderOwnerRepository.filterListAppUser}
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
              {validAction('filterListEditPriceStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('directSalesOrders.isEditedPrice')}
                  >
                    <AdvancedIdFilter
                      filter={filter.editedPriceStatusId}
                      filterType={nameof(filter.editedPriceStatusId.equal)}
                      value={filter.editedPriceStatusId.equal}
                      onChange={handleFilter(
                        nameof(filter.editedPriceStatusId),
                      )}
                      getList={
                        directSalesOrderOwnerRepository.filterListEditPriceStatus
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
                        directSalesOrderOwnerRepository.filterListOrganization
                      }
                      searchField={nameof(organizationFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('directSalesOrders.orderDate')}
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
                  label={translate('directSalesOrders.total')}
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
                        directSalesOrderOwnerRepository.filterListRequestState
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
                      onChange={handleFilter(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        directSalesOrderOwnerRepository.filterListStoreStatus
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
        <Tabs activeKey={tabActive} className="tab" onChange={onChangeTabIndex}>
          <TabPane
            key="new"
            // eslint-disable-next-line no-useless-concat
            tab={
              translate('indirectSalesOrders.master.tabs.new') +
              ' ( ' +
              `${totalNew}` +
              ' )'
            }
          >
            <DirectSalesOrderOwnerMasterTab
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
              translate('indirectSalesOrders.master.tabs.progressing') +
              ' ( ' +
              `${totalPending}` +
              ' )'
            }
          >
            <DirectSalesOrderOwnerMasterTab
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
              translate('indirectSalesOrders.master.tabs.processed') +
              ' ( ' +
              `${totalCompleted}` +
              ' )'
            }
          >
            <DirectSalesOrderOwnerMasterTab
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
        {
          previewVisible &&
          <DirectSalesOrderPreview
            directSalesOrder={previewModel}
            directSalesOrderContent={previewModel?.directSalesOrderContents}
            previewVisible={previewVisible}
            onClose={handleClosePreview}
            previewLoading={previewLoading}
            loading={loading}
          />
        }

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

export default DirectSalesOrderOwnerMaster;
