import { Card, Col, Form, Row, Tabs, Tooltip } from 'antd';
import classNames from 'classnames';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import {
  optionsBarLablesY,
  optionsHorizontalBar,
  optionsLineFull,
} from 'config/consts';
import { GlobalState } from 'core/config';
import { formatCurrencyUnit, formatNumber } from 'core/helpers/number';
import { AppUserFilter } from 'models/AppUserFilter';
import { DashboardDirectorFilter } from 'models/DashboardDirectorFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { StatusFilter } from 'models/StatusFilter';
import React, { useMemo } from 'react';
import { Bar, HorizontalBar, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'reactn';
import nameof from 'ts-nameof.macro';
import dashboardDirectorRepository from './DashboardManagerRepository';
import { dashboardManagerService } from './DashboardManagerService';
import './DashboardManagerView.scss';
import StoreCheckingMap from './StoreCheckingMap';
import StoreCoverageMap from './StoreCoverageMap';

const { TabPane } = Tabs;

const { Item: FormItem } = Form;

function DashboardManagerView() {
  const [translate] = useTranslation();

  const [toggle] = useGlobal<GlobalState>('toggleSideBar');
  const toggleSideBar = toggle as boolean;

  /*Top revenue product*/
  const [filterHaveTime, setFilterHaveTime] = React.useState<
    DashboardDirectorFilter
  >(new DashboardDirectorFilter());

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [filter, setFilter] = React.useState<DashboardDirectorFilter>(
    new DashboardDirectorFilter(),
  );

  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [loadMap, setLoadMap] = React.useState<boolean>(true);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  // const [listDefaultTime, setListDefaultTime] = React.useState<Status[]>([]);

  // const [timeList] = crudService.useEnumList<Status>(
  //   dashboardDirectorRepository.filterListTime,
  // );

  React.useEffect(() => {
    if (typeof filterHaveTime.time.equal === 'undefined') {
      setFilterHaveTime(preFilter => ({
        ...preFilter,
        time: { equal: 1 },
      }));
      setStatusFilter(statusFilter => ({
        ...statusFilter,
        id: { equal: 1 },
      }));
    }
  }, [filterHaveTime.time.equal]);

  /* Top 5*/
  const [
    lablesRevenueByEmployee,
    dataRevenueByEmployee,
    setLoadingRevenueByEmployee,
  ] = dashboardManagerService.useTop5RevenueByEmployee(
    filterHaveTime,
    dashboardDirectorRepository.top5RevenueByEmployee,
  );

  const [
    lablesRevenueByProduct,
    dataRevenueByProduct,
    setLoadingRevenueByProduct,
  ] = dashboardManagerService.useTopRevenueByProduct(
    filterHaveTime,
    dashboardDirectorRepository.top5RevenueByProduct,
  );
  /* statisticToday*/
  const [
    statisticToday,
    statisticYesterday,
    setLoadingStatistic,
  ] = dashboardManagerService.useStatistical(
    dashboardDirectorRepository.statisticToday,
    dashboardDirectorRepository.statisticYesterday,
    filter,
  );

  /*Revenue Fluctuation*/

  const [
    lablesRevenueFluctuation,
    dataRevenueFluctuation,
    setLoadingRevenueFluctuation,
  ] = dashboardManagerService.useRevenueFluctuation(
    filterHaveTime,
    dashboardDirectorRepository.revenueFluctuation,
  );

  /*SaledItemFluctuation*/

  // const [
  //   statusSaledItemFluctuationFilter,
  //   setStatusSaledItemFluctuationFilter,
  // ] = React.useState<StatusFilter>(new StatusFilter());

  // const [
  //   lablesSaledItemFluctuation,
  //   dataSaledItemFluctuation,
  //   setLoadingSaledItemFluctuation,
  // ] = dashboardManagerService.useSaledItemFluctuation(
  //   filterSaledItemFluctuation,
  //   dashboardDirectorRepository.saledItemFluctuation,
  // );

  /*IndirectSalesOrderFluctuation*/

  const [
    lablesIndirectSalesOrderFluctuation,
    dataIndirectSalesOrderFluctuation,
    setLoadingIndirectSalesOrderFluctuation,
  ] = dashboardManagerService.useIndirectSalesOrderFluctuation(
    filterHaveTime,
    dashboardDirectorRepository.indirectSalesOrderFluctuation,
  );

  const [
    indirectSalesOrderCounter,
    revenueTotal,
    storeHasCheckedCounter,
    storeCheckingCouter,
    countStore,
    setLoadData,
  ] = dashboardManagerService.useDataTotal(
    dashboardDirectorRepository.indirectSalesOrderCounter,
    dashboardDirectorRepository.revenueTotal,
    dashboardDirectorRepository.storeHasCheckedCounter,
    dashboardDirectorRepository.storeCheckingCouter,
    dashboardDirectorRepository.countStore,
    filter,
    filterHaveTime,
  );

  const dataTop5RevenueByProduct = useMemo(() => {
    return {
      labels: lablesRevenueByProduct,
      datasets: [
        {
          fill: false,
          label: translate('dashboardManager.revenue'),
          backgroundColor: '#a32f4a',
          borderColor: '#a32f4a',
          borderWidth: 1,
          hoverBackgroundColor: '#a32f4a',
          hoverBorderColor: '#a32f4a',
          barPercentage: 0.5,
          barThickness: 10,
          data: JSON.parse(dataRevenueByProduct),
        },
      ],
    };
  }, [dataRevenueByProduct, lablesRevenueByProduct, translate]);

  const dataTop5RevenueByEmployee = useMemo(
    () => ({
      labels: lablesRevenueByEmployee,
      datasets: [
        {
          fill: false,
          label: translate('dashboardManager.revenue'),
          backgroundColor: '#FFB200',
          borderColor: '#FFB200',
          borderWidth: 1,
          hoverBackgroundColor: '#FFB200',
          hoverBorderColor: '#FFB200',
          barPercentage: 0.5,
          barThickness: 10,
          data: JSON.parse(dataRevenueByEmployee),
        },
      ],
    }),
    [dataRevenueByEmployee, lablesRevenueByEmployee, translate],
  );

  const dataRevenueFluctuationBar = useMemo(
    () => ({
      labels: lablesRevenueFluctuation,
      datasets: [
        {
          fill: false,
          label: translate('dashboardManager.revenueFluctuation'),
          backgroundColor: '#a32f4a',
          borderColor: '#a32f4a',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          data: JSON.parse(dataRevenueFluctuation),
          maxBarThickness: 12,
        },
      ],
    }),
    [dataRevenueFluctuation, lablesRevenueFluctuation, translate],
  );

  // const dataSaledItemFluctuationLine = useMemo(
  //   () => ({
  //     labels: lablesSaledItemFluctuation,
  //     datasets: [
  //       {
  //         label: translate('dashboardManager.saledItem'),
  //         fill: false,
  //         // lineTension: 0,
  //         backgroundColor: '#a32f4a',
  //         borderColor: '#a32f4a',
  //         borderCapStyle: 'butt',
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         borderJoinStyle: 'miter',
  //         pointBorderColor: '#a32f4a',
  //         pointBackgroundColor: '#a32f4a',
  //         pointBorderWidth: 1,
  //         pointHoverRadius: 5,
  //         pointHoverBackgroundColor: '#a32f4a',
  //         pointHoverBorderColor: '#a32f4a',
  //         pointHoverBorderWidth: 2,
  //         pointRadius: 1,
  //         pointHitRadius: 10,
  //         data: JSON.parse(dataSaledItemFluctuation),
  //       },
  //     ],
  //   }),
  //   [dataSaledItemFluctuation, lablesSaledItemFluctuation, translate],
  // );

  const dataindirectSalesOrderFluctuationLine = useMemo(
    () => ({
      labels: lablesIndirectSalesOrderFluctuation,
      datasets: [
        {
          label: translate('dashboardManager.indirectSalesOrder'),
          fill: false,
          // lineTension: 0, // set line curve
          backgroundColor: '#a32f4a',
          borderColor: '#a32f4a',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#a32f4a',
          pointBackgroundColor: '#a32f4a',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#a32f4a',
          pointHoverBorderColor: '#a32f4a',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: JSON.parse(dataIndirectSalesOrderFluctuation),
        },
      ],
    }),
    [
      lablesIndirectSalesOrderFluctuation,
      dataIndirectSalesOrderFluctuation,
      translate,
    ],
  );

  const handleChangeFilter = React.useCallback(
    field => {
      return value => {
        if (field === 'organizationId') {
          filter.appUserId.equal = undefined;
          filterHaveTime.appUserId.equal = undefined;
          appUserFilter.organizationId.equal = value?.equal;
          setAppUserFilter({ ...appUserFilter });
          setIsReset(true);
        }
        filter[field].equal = value?.equal;
        filterHaveTime[field].equal = value?.equal;
        setFilter({ ...filter });
        setFilterHaveTime({ ...filterHaveTime });

        // setLoadingSaledItemFluctuation(true);
        setLoadingRevenueFluctuation(true);
        setLoadingRevenueByEmployee(true);
        setLoadingRevenueByProduct(true);
        setLoadData(true);
        setLoadingStatistic(true);
        setLoadingIndirectSalesOrderFluctuation(true);
        setLoadMap(true);
      };
    },
    [
      filter,
      filterHaveTime,
      setLoadingRevenueFluctuation,
      setLoadingRevenueByEmployee,
      setLoadingRevenueByProduct,
      setLoadData,
      setLoadingStatistic,
      setLoadingIndirectSalesOrderFluctuation,
      appUserFilter,
    ],
  );

  const handleChangeFilterTime = React.useCallback(
    value => {
      filterHaveTime.time.equal = value?.equal;
      setFilterHaveTime({ ...filterHaveTime });
      setLoadingRevenueByEmployee(true);
      setLoadingRevenueByProduct(true);
      setLoadingStatistic(true);
      setLoadingRevenueFluctuation(true);
      setLoadingIndirectSalesOrderFluctuation(true);
      setLoadData(true);
    },
    [
      filterHaveTime,
      setLoadData,
      setLoadingIndirectSalesOrderFluctuation,
      setLoadingRevenueByEmployee,
      setLoadingRevenueByProduct,
      setLoadingRevenueFluctuation,
      setLoadingStatistic,
    ],
  );

  return (
    <div className="dashboard-director">
      <Row>
        <Card className="mb-3">
          <Col className="pl-1" span={6}>
            <FormItem
              className="mb-1"
              label={translate('appUsers.organization')}
              labelAlign="left"
            >
              <AdvancedTreeFilter
                filter={filter.organizationId}
                filterType={nameof(filter.organizationId.equal)}
                value={filter.organizationId.equal}
                onChange={handleChangeFilter(nameof(filter.organizationId))}
                getList={dashboardDirectorRepository.filterListOrganization}
                modelFilter={organizationFilter}
                setModelFilter={setOrganizationFilter}
                placeholder={translate('general.placeholder.title')}
                mode="single"
              />
            </FormItem>
          </Col>

          {/* {validAction('filterListProvince') && ( */}
          <Col className="pl-1" span={6}>
            <FormItem
              className="mb-0"
              label={translate('storeScoutings.province')}
              labelAlign="left"
            >
              <AdvancedIdFilter
                filter={filter.provinceId}
                filterType={nameof(filter.provinceId.equal)}
                value={filter.provinceId.equal}
                onChange={handleChangeFilter(nameof(filter.provinceId))}
                modelFilter={provinceFilter}
                setModelFilter={setProvinceFilter}
                getList={dashboardDirectorRepository.filterListProvince}
                searchField={nameof(provinceFilter.name)}
                searchType={nameof(provinceFilter.name.contain)}
                placeholder={translate('general.placeholder.title')}
              />
            </FormItem>
          </Col>
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
                onChange={handleChangeFilter(nameof(filter.appUserId))}
                getList={dashboardDirectorRepository.filterListAppUser}
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

          <Col lg={6} className="pl-1">
            <FormItem
              className="mb-1"
              label={translate('directSalesOrders.time')}
              labelAlign="left"
            >
              <AdvancedIdFilter
                filter={filterHaveTime.time}
                filterType={nameof(filterHaveTime.time.equal)}
                value={filterHaveTime.time.equal}
                onChange={handleChangeFilterTime}
                modelFilter={statusFilter}
                setModelFilter={setStatusFilter}
                getList={dashboardDirectorRepository.filterListTime}
                searchType={nameof(statusFilter.name.contain)}
                searchField={nameof(statusFilter.name)}
                placeholder={translate('general.placeholder.title')}
                allowClear={false}
              />
            </FormItem>
          </Col>
          {/* )} */}
        </Card>
      </Row>
      <Row>
        <Col lg={5} className="dashboard-right">
          <Card>
            <div className="dashboard-icon d-flex align-items-center">
              <div className="dashboard-store">
                <i className="tio-shop" />
              </div>
              <div className="report">
                <div className="store-report">
                  <Tooltip title={formatNumber(countStore)}>
                    {formatCurrencyUnit(countStore)}
                  </Tooltip>
                </div>
                <div className="text-statistical">
                  {translate('dashboardManager.store')}
                </div>
              </div>
            </div>
          </Card>
          <div className="today mt-3">
            <Card className="statistical card-height">
              <div className="text-title ml-3 mt-3">
                {translate('dashboardManager.title.statisticalDay')}
              </div>
              <Tabs defaultActiveKey="1">
                <TabPane key="1" tab={translate('dashboardManager.today')}>
                  <div className="revenue row mt-4 mb-4 d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-revenue"></div>
                      <div className="ml-2 revenue-text">
                        {translate('dashboardManager.revenue')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(statisticToday?.revenue)}
                      </div>
                    </div>
                  </div>
                  <div className="indirect-sales-orders mt-3 mb-4 row d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-indirect"></div>
                      <div className="ml-2 revenue-text">
                        {translate('dashboardManager.indirect')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(
                          statisticToday?.indirectSalesOrderCounter,
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="item-sales-total mb-4 mt-3 row d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-item-sales"></div>
                      <div className="ml-2 revenue-text">
                        {translate('dashboardManager.storeHasCheckedCounter')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(statisticToday?.storeHasCheckedCounter)}
                      </div>
                    </div>
                  </div>
                  <div className="store-checking-couter mt-3 mb-3 row d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-store-checking"></div>
                      <div className="ml-2 revenue-text">
                        {translate('dashboardManager.visits')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(statisticToday?.storeCheckingCounter)}
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane key="2" tab={translate('dashboardManager.yesterday')}>
                  <div className="revenue row mt-4 mb-4 d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-revenue"></div>
                      <div className="ml-2">
                        {translate('dashboardManager.revenue')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(statisticYesterday?.revenue)}
                      </div>
                    </div>
                  </div>
                  <div className="indirect-sales-orders mb-4 mt-3 row d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-indirect"></div>
                      <div className="ml-2">
                        {translate('dashboardManager.indirect')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(
                          statisticYesterday?.indirectSalesOrderCounter,
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="item-sales-total mb-4 mt-3 row d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-item-sales"></div>
                      <div className="ml-2">
                        {translate('dashboardManager.storeHasCheckedCounter')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(
                          statisticYesterday?.storeHasCheckedCounter,
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="store-checking-couter mt-3 mb-3 row d-flex align-items-center">
                    <div className="col d-flex align-items-center">
                      <div className="icon-store-checking"></div>
                      <div className="ml-2">
                        {translate('dashboardManager.visits')}
                      </div>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <div className="d-flex justify-content-end number">
                        {formatNumber(statisticYesterday?.storeCheckingCounter)}
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Col>
        <Col lg={19}>
          <div className="row">
            <div className="col col-right">
              <Card>
                <div className="dashboard-icon d-flex align-items-center">
                  <div className="dashboard-sell-number">
                    <i className="tio-layers" />
                  </div>
                  <div className="report">
                    {/* <div className="current-month">
                      {translate('dashboardManager.currentMonth')}
                    </div> */}
                    <div className="sell-number-report">
                      <Tooltip title={formatNumber(storeHasCheckedCounter)}>
                        {formatCurrencyUnit(storeHasCheckedCounter)}
                      </Tooltip>
                    </div>
                    <div className="text-statistical">
                      {translate('dashboardManager.storeHasCheckedCounter')}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="col col-right">
              <Card>
                <div className="dashboard-icon d-flex align-items-center">
                  <div className="dashboard-visits">
                    <i className="tio-running" />
                  </div>
                  <div className="report">
                    {/* <div className="current-month">
                      {translate('dashboardManager.currentMonth')}
                    </div> */}
                    <div className="visits-report">
                      <Tooltip title={formatNumber(storeCheckingCouter)}>
                        {formatCurrencyUnit(storeCheckingCouter)}
                      </Tooltip>
                    </div>
                    <div className="text-statistical">
                      {translate('dashboardManager.visits')}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="col col-right">
              <Card>
                <div className="dashboard-icon d-flex align-items-center">
                  <div className="dashboard-revenue">
                    <i className="tio-dollar" />
                  </div>
                  <div className="report">
                    {/* <div className="current-month">
                      {translate('dashboardManager.currentMonth')}
                    </div> */}
                    <div className="revenue-report">
                      <Tooltip title={formatNumber(revenueTotal)}>
                        {formatCurrencyUnit(revenueTotal)}
                      </Tooltip>
                    </div>
                    <div className="text-statistical">
                      {translate('dashboardManager.revenue')}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col col-left">
              <Card>
                <div className="dashboard-icon d-flex align-items-center">
                  <div className="dashboard-indirect">
                    <i className="tio-shopping_cart" />
                  </div>
                  <div className="report">
                    {/* <div className="current-month">
                      {translate('dashboardManager.currentMonth')}
                    </div> */}
                    <div className="indirect-report">
                      <Tooltip title={formatNumber(indirectSalesOrderCounter)}>
                        {formatCurrencyUnit(indirectSalesOrderCounter)}
                      </Tooltip>
                    </div>
                    <div className="text-statistical">
                      {translate('dashboardManager.indirect')}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="row mt-3">
            {/* top 5 revenue by item */}
            <div className="col-6 col-top-right">
              <Card className="card-height">
                <div className="d-flex mt-3">
                  <div className="col text-title ml-3">
                    {translate('dashboardManager.title.topRevenueItem')}
                  </div>
                  {/* <div className="col mr-3 col-left">
                    <div className="single-list-status">
                      <AdvancedIdFilter
                        filter={filterTopRevenueByProduct.time}
                        filterType={nameof(
                          filterTopRevenueByProduct.time.equal,
                        )}
                        value={Number(filterTopRevenueByProduct.time.equal)}
                        onChange={handleFilterTopRevenueItem}
                        modelFilter={statusFilter}
                        setModelFilter={setStatusFilter}
                        getList={dashboardDirectorRepository.filterListTime}
                        searchType={nameof(statusFilter.name.contain)}
                        searchField={nameof(statusFilter.name)}
                        placeholder={translate('general.placeholder.title')}
                        allowClear={false}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="">
                  <HorizontalBar
                    height={window.innerWidth < 1920 ? 250 : 300}
                    data={dataTop5RevenueByProduct}
                    options={optionsHorizontalBar}
                  />
                </div>
              </Card>
            </div>
            <div className="col-6 col-top-left">
              <Card className="card-height">
                <div className="d-flex mt-3">
                  <div className="col text-title ml-3">
                    {translate('dashboardManager.title.topRevenueEmployee')}
                  </div>
                  {/* <div className="col mr-3">
                    <div className="single-list-status">
                      <AdvancedIdFilter
                        filter={filterTopRevenueByEmployee.time}
                        filterType={nameof(
                          filterTopRevenueByEmployee.time.equal,
                        )}
                        value={Number(filterTopRevenueByEmployee.time.equal)}
                        onChange={handleFilterTopRevenueByEmployee}
                        modelFilter={statusTimeStoreFilter}
                        setModelFilter={setStatusTimeStoreFilter}
                        getList={dashboardDirectorRepository.filterListTime}
                        searchType={nameof(statusTimeStoreFilter.name.contain)}
                        searchField={nameof(statusTimeStoreFilter.name)}
                        placeholder={translate('general.placeholder.title')}
                        allowClear={false}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="">
                  <HorizontalBar
                    height={window.innerWidth < 1920 ? 250 : 300}
                    data={dataTop5RevenueByEmployee}
                    options={optionsHorizontalBar}
                  />
                </div>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
      <div className="row">
        <div className="col col-right">
          {useMemo(
            () => (
              <StoreCoverageMap
                getList={dashboardDirectorRepository.storeCoverage}
                getFilterList={
                  dashboardDirectorRepository.filterListOrganization
                }
                filter={filter}
                loadMap={loadMap}
                setLoadMap={setLoadMap}
              />
            ),
            [filter, loadMap],
          )}
        </div>
        <div className="col">
          {useMemo(
            () => (
              <StoreCheckingMap
                getList={dashboardDirectorRepository.saleEmployeeLocation}
                getFilterList={
                  dashboardDirectorRepository.filterListOrganization
                }
                filter={filter}
                loadMap={loadMap}
                setLoadMap={setLoadMap}
              />
            ),
            [filter, loadMap],
          )}
        </div>
      </div>
      <div className="row">
        <div className="col col-right">
          <Card
            className={classNames('card-fluctuation', {
              'line-true': toggleSideBar,
              'line-false': !toggleSideBar,
            })}
          >
            <div className="d-flex mt-3">
              <div className="col text-title ml-3">
                {translate('dashboardManager.title.revenueFluctuation')}
              </div>
              {/* <div className="col mr-3">
                <div className="single-list-status">
                  <AdvancedIdFilter
                    filter={filterRevenueFluctuation.time}
                    filterType={nameof(filterRevenueFluctuation.time.equal)}
                    value={Number(filterRevenueFluctuation.time.equal)}
                    onChange={handleFilterRevenueFluctuation}
                    modelFilter={statusRevenueFluctuationFilter}
                    setModelFilter={setStatusRevenueFluctuationFilter}
                    getList={dashboardDirectorRepository.filterListTime}
                    searchType={nameof(
                      statusRevenueFluctuationFilter.name.contain,
                    )}
                    searchField={nameof(statusRevenueFluctuationFilter.name)}
                    placeholder={translate('general.placeholder.title')}
                    allowClear={false}
                  />
                </div>
              </div> */}
            </div>
            <Bar
              // height={window.innerWidth < 1920 ? 200 : 100}
              height={135}
              data={dataRevenueFluctuationBar}
              options={optionsBarLablesY}
            />
          </Card>
        </div>
        <div className="col col-left">
          <Card
            className={classNames('card-fluctuation', {
              'line-true': toggleSideBar,
              'line-false': !toggleSideBar,
            })}
          >
            <div className="d-flex mt-3">
              <div className="col text-title ml-3">
                {translate(
                  'dashboardManager.title.indirectSalesOrderFluctuation',
                )}
              </div>
              {/* <div className="col mr-3">
                <div className="single-list-status">
                  <AdvancedIdFilter
                    filter={filterIndirectSalesOrderFluctuation.time}
                    filterType={nameof(
                      filterIndirectSalesOrderFluctuation.time.equal,
                    )}
                    value={Number(
                      filterIndirectSalesOrderFluctuation.time.equal,
                    )}
                    onChange={handleFilterIndirectSalesOrderFluctuation}
                    modelFilter={statusIndirectSalesOrderFluctuationFilter}
                    setModelFilter={
                      setStatusIndirectSalesOrderFluctuationFilter
                    }
                    getList={dashboardDirectorRepository.filterListTime}
                    searchType={nameof(
                      statusIndirectSalesOrderFluctuationFilter.name.contain,
                    )}
                    searchField={nameof(
                      statusIndirectSalesOrderFluctuationFilter.name,
                    )}
                    placeholder={translate('general.placeholder.title')}
                    allowClear={false}
                  />
                </div>
              </div> */}
            </div>
            <div className="pt-3">
              <Line
                height={350}
                width={750}
                data={dataindirectSalesOrderFluctuationLine}
                options={optionsLineFull}
              />
            </div>
          </Card>
        </div>
        {/* <div className="col">
          <Card
            className={classNames('card-fluctuation', {
              'line-true': toggleSideBar,
              'line-false': !toggleSideBar,
            })}
          >
            <div className="d-flex mt-3">
              <div className="col text-title ml-3">
                {translate('dashboardManager.title.saledItemFluctuation')}
              </div>
              <div className="col mr-3">
                <div className="single-list-status">
                  <AdvancedIdFilter
                    filter={filterSaledItemFluctuation.time}
                    filterType={nameof(filterSaledItemFluctuation.time.equal)}
                    value={Number(filterSaledItemFluctuation.time.equal)}
                    onChange={handleFilterSaledItemFluctuation}
                    modelFilter={statusSaledItemFluctuationFilter}
                    setModelFilter={setStatusSaledItemFluctuationFilter}
                    getList={dashboardDirectorRepository.filterListTime2}
                    searchType={nameof(
                      statusSaledItemFluctuationFilter.name.contain,
                    )}
                    searchField={nameof(statusSaledItemFluctuationFilter.name)}
                    placeholder={translate('general.placeholder.title')}
                    allowClear={false}
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 p">
              <Line
                height={350}
                data={dataSaledItemFluctuationLine}
                options={optionsLineFull}
              />
            </div>
          </Card>
        </div> */}
        {/* <div className="col">
          <Card className="card-dashboard card-fluctuation">
            <div className="table-title mb-3 mt-3">
              {translate('dashboard.title.newOrders')}
            </div>
            <div className="table-dashboard">
              <Table
                key={nameof(listIndirectSalesOrder[0].id)}
                tableLayout="fixed"
                bordered={false}
                columns={columns}
                dataSource={listIndirectSalesOrder}
                pagination={false}
                rowKey={nameof(listIndirectSalesOrder[0].id)}
              />
            </div>
          </Card>
        </div> */}
      </div>
      <div className="row mt-3"></div>
    </div>
  );
}
export default DashboardManagerView;
