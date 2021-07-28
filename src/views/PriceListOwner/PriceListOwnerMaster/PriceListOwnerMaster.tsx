import { Col, Form, Row, Tabs } from 'antd';
import Card from 'antd/lib/card';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { PRICELIST_OWNER_DETAIL_ROUTE, PRICELIST_OWNER_ROUTE } from 'config/route-consts';
import { routerService } from 'core/services';
import { OrganizationFilter } from 'models/OrganizationFilter';
import {
  PriceList,

  PriceListTypeFilter,
  SalesOrderTypeFilter,
} from 'models/priceList/PriceList';
import { PriceListFilter } from 'models/priceList/PriceListFilter';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { StatusFilter } from 'models/StatusFilter';
import path from 'path';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import '../PriceListOwner.scss';
import { priceListOwnerRepository } from '../PriceListOwnerRepository';
import { priceListOwnerService } from '../PriceListOwnerService';
import HistoryModal from './HistoryModal/HistoryModal';
import PriceListTab from './PriceListTab/PriceListTab';


const { Item: FormItem } = Form;
const { TabPane } = Tabs;
export default function PriceListOwnerMaster() {
  const [translate] = useTranslation();
  const history = useHistory();

  const [tabIndex, setTabIndex] = React.useState<number>(2);
  const [firstTime, setFirstTime] = React.useState<boolean>(true);
  const [tabActive, setTabActive] = React.useState<string>('new');
  const [
    filter,
    setFilter,
    loading,
    setLoading,
    ,
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
  ] = priceListOwnerService.useMasterIndirect<
    PriceList,
    PriceListFilter
  >(
    PriceList,
    PriceListFilter,
    priceListOwnerRepository.get,
    priceListOwnerRepository.countNew,
    priceListOwnerRepository.listNew,
    priceListOwnerRepository.countPending,
    priceListOwnerRepository.listPending,
    priceListOwnerRepository.countCompleted,
    priceListOwnerRepository.listCompleted,
    tabIndex,
    firstTime,
    setFirstTime,
  );

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

  const [previewHistoryModel, setPreviewHistoryModel] = React.useState<PriceList>(
    new PriceList(),
  );

  const [historyVisible, setHitoryVisible] = React.useState<boolean>(false);

  const [
    requestStateStatusFilter,
    setRequestStateStatusFilter,
  ] = React.useState<RequestStateStatusFilter>(new RequestStateStatusFilter());
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
  const [, handleGoDetail] = routerService.useMasterNavigation(
    PRICELIST_OWNER_DETAIL_ROUTE,
  );

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



  const handleViewHistory = React.useCallback(
    (id: number) => {
      history.push(path.join(PRICELIST_OWNER_ROUTE));
      priceListOwnerRepository
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
    history.push(path.join(PRICELIST_OWNER_ROUTE));
  }, [history]);

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
                      getList={priceListOwnerRepository.filterListStatus}
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
                      getList={priceListOwnerRepository.filterListOrganization}
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
                      getList={priceListOwnerRepository.filterListPriceListType}
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
                      getList={priceListOwnerRepository.filterListSalesOrderType}
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
                      onChange={handleFilter(nameof(filter.requestStateId))}
                      getList={
                        priceListOwnerRepository.filterListRequestState
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
              {/* {validAction('list') && ( */}
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
              {/* )} */}
            </div>
          </CollapsibleCard>
          {/* table */}
          <Tabs activeKey={tabActive} className="tab" onChange={onChangeTabIndex}>
            <TabPane
              key="new"
              // eslint-disable-next-line no-useless-concat
              tab={
                translate('priceLists.master.tabs.new') +
                ' ( ' +
                `${totalNew}` +
                ' )'
              }
            >
              <PriceListTab
                filter={filter}
                setFilter={setFilter}
                pagination={pagination2}
                list={listNew}
                sorter={sorter2}
                // handleOpenPreview={handleOpenPreview}
                // previewModel={model}
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
                translate('priceLists.master.tabs.progressing') +
                ' ( ' +
                `${totalPending}` +
                ' )'
              }
            >
              <PriceListTab
                filter={filter}
                setFilter={setFilter}
                pagination={pagination3}
                list={listPending}
                sorter={sorter3}
                // handleOpenPreview={handleOpenPreview}
                // previewModel={model}
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
                translate('priceLists.master.tabs.processed') +
                ' ( ' +
                `${totalCompleted}` +
                ' )'
              }
            >
              <PriceListTab
                filter={filter}
                setFilter={setFilter}
                pagination={pagination4}
                list={listCompleted}
                sorter={sorter4}
                // handleOpenPreview={handleOpenPreview}
                // previewModel={model}
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
