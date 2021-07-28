import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_KPI_GENERAL_EMPLOYEE_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiEmployeeReport } from 'models/kpi/KpiEmployeeReport';
import { KpiEmployeeReportFilter } from 'models/kpi/KpiEmployeeReportFilter';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import '../KpiGeneralReport.scss';
import { kpiGeneralReportService } from '../KpiGeneralReportService';
import { kpiGeneralEmployeeReportRepository } from './KpiGeneralEmployeeReportRepository';
const { Item: FormItem } = Form;
function KpiGeneralEmployeeReport() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-general-employee-report',
    API_KPI_GENERAL_EMPLOYEE_REPORT_ROUTE,
  );
  const [
    filter,
    setFilter,
    list,
    setList,
    setLoadList,
    setLoading,
    total,
    loading,
    ,
    isReset,
    setIsReset,
    handleReset,
  ] = kpiGeneralReportService.useKpiReportMaster<
    KpiEmployeeReport,
    KpiEmployeeReportFilter
  >(
    KpiEmployeeReportFilter,
    kpiGeneralEmployeeReportRepository.list,
    kpiGeneralEmployeeReportRepository.count,
    'appUserId',
    'kpiYearId',
  );

  const [
    hasMore,
    ,
    handleInfiniteOnLoad,
    handleSearch,
    handleFilterScroll,
    ,
    ,
    ref,
    displayLoadMore,
    handleIndepentFilter,
    handleResetScroll,
  ] = crudService.useTableScroll(
    list,
    setList,
    filter,
    setFilter,
    setLoading,
    kpiGeneralEmployeeReportRepository.list,
    total,
    setLoadList,
    loading,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

  const [kpiPeriodFilter, setKpiPeriodFilter] = React.useState<KpiPeriodFilter>(
    new KpiPeriodFilter(),
  );
  const [kpiYearFilter, setKpiYearFilter] = React.useState<KpiYearFilter>(
    new KpiYearFilter(),
  );
  const [handleExport] = crudService.useExport(
    kpiGeneralEmployeeReportRepository.export,
    filter,
  );

  const handleStatistic = kpiGeneralReportService.useSearchKpi(
    handleSearch,
    filter.appUserId.equal,
    filter.kpiYearId.equal,
    translate('kpiGeneralEmployeeReports.appUserId'),
    translate('kpiGeneralEmployeeReports.kpiYearId'),
  );

  const columns: ColumnProps<KpiEmployeeReport>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render(...[, , index]) {
          return <div className="text-center table-row">{index + 1}</div>;
        },
      },

      {
        title: translate('kpiGeneralEmployeeReports.kpiPeriod'),
        key: nameof(list[0].kpiPeriodName),
        dataIndex: nameof(list[0].kpiPeriodName),
        ellipsis: true,
        width: 90,
      },
      {
        title: translate('kpiGeneralEmployeeReports.totalIndirectOrder'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalIndirectOrdersPLanned',
            ),
            key: nameof(list[0].totalIndirectSalesAmountPlanned),
            dataIndex: nameof(list[0].totalIndirectSalesAmountPlanned),
            ellipsis: true,
            width: 90,
            render(...[totalIndirectSalesAmountPlanned]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(totalIndirectSalesAmountPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.totalIndirectOrders'),
            key: nameof(list[0].totalIndirectSalesAmount),
            dataIndex: nameof(list[0].totalIndirectSalesAmount),
            ellipsis: true,
            width: 90,
            render(...[totalIndirectSalesAmount]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(totalIndirectSalesAmount)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalIndirectOrdersRatio',
            ),
            key: nameof(list[0].totalIndirectSalesAmountRatio),
            dataIndex: nameof(list[0].totalIndirectSalesAmountRatio),
            ellipsis: true,
            width: 90,
            render(...[totalIndirectSalesAmountRatio]) {
              return (
                <div className="text-right table-row">
                  {totalIndirectSalesAmountRatio}
                </div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.revenueC2TD'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalIndirectQuantityPlanned',
            ),
            key: nameof(list[0].revenueC2TDPlanned),
            dataIndex: nameof(list[0].revenueC2TDPlanned),
            ellipsis: true,
            width: 90,
            render(...[revenueC2TDPlanned]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2TDPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.totalIndirectQuantity'),
            key: nameof(list[0].revenueC2TD),
            dataIndex: nameof(list[0].revenueC2TD),
            ellipsis: true,
            width: 90,
            render(...[revenueC2TD]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2TD)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalIndirectQuantityRatio',
            ),
            key: nameof(list[0].revenueC2TDRatio),
            dataIndex: nameof(list[0].revenueC2TDRatio),
            ellipsis: true,
            width: 90,
            render(...[revenueC2TDRatio]) {
              return (
                <div className="text-right table-row">{revenueC2TDRatio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.revenueC2SL'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalIndirectSalesAmountPlanned',
            ),
            key: nameof(list[0].revenueC2SLPlanned),
            dataIndex: nameof(list[0].revenueC2SLPlanned),
            ellipsis: true,
            width: 90,
            render(...[revenueC2SLPlanned]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2SLPlanned)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalIndirectSalesAmount',
            ),
            key: nameof(list[0].revenueC2SL),
            dataIndex: nameof(list[0].revenueC2SL),
            ellipsis: true,
            width: 90,
            render(...[revenueC2SL]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2SL)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalIndirectSalesAmountRatio',
            ),
            key: nameof(list[0].revenueC2SLRatio),
            dataIndex: nameof(list[0].revenueC2SLRatio),
            ellipsis: true,
            width: 90,
            render(...[revenueC2SLRatio]) {
              return (
                <div className="text-right table-row">{revenueC2SLRatio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.revenueC2'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.skuIndirectOrderPlanned',
            ),
            key: nameof(list[0].revenueC2Planned),
            dataIndex: nameof(list[0].revenueC2Planned),
            ellipsis: true,
            width: 90,
            render(...[revenueC2Planned]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2Planned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.skuIndirectOrder'),
            key: nameof(list[0].revenueC2),
            dataIndex: nameof(list[0].revenueC2),
            ellipsis: true,
            width: 90,
            render(...[revenueC2]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.skuIndirectOrderRatio'),
            key: nameof(list[0].revenueC2Ratio),
            dataIndex: nameof(list[0].revenueC2Ratio),
            ellipsis: true,
            width: 90,
            render(...[revenueC2Ratio]) {
              return (
                <div className="text-right table-row">{revenueC2Ratio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.newStoreCreateds'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.newStoreCreatedPlanned',
            ),
            key: nameof(list[0].newStoreCreatedPlanned),
            dataIndex: nameof(list[0].newStoreCreatedPlanned),
            ellipsis: true,
            width: 90,
            render(...[newStoreCreatedPlanned]) {
              return (
                <div className="text-right table-row">
                  {newStoreCreatedPlanned}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.newStoreCreated'),
            key: nameof(list[0].newStoreCreated),
            dataIndex: nameof(list[0].newStoreCreated),
            ellipsis: true,
            width: 90,
            render(...[newStoreCreated]) {
              return (
                <div className="text-right table-row">{newStoreCreated}</div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.newStoreCreatedRatio'),
            key: nameof(list[0].newStoreCreatedRatio),
            dataIndex: nameof(list[0].newStoreCreatedRatio),
            ellipsis: true,
            width: 90,
            render(...[newStoreCreatedRatio]) {
              return (
                <div className="text-right table-row">
                  {newStoreCreatedRatio}
                </div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.newStoreC2Created'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.newStoreCreatedPlanned',
            ),
            key: nameof(list[0].newStoreC2CreatedPlanned),
            dataIndex: nameof(list[0].newStoreC2CreatedPlanned),
            ellipsis: true,
            width: 90,
            render(...[newStoreC2CreatedPlanned]) {
              return (
                <div className="text-right table-row">
                  {newStoreC2CreatedPlanned}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.newStoreCreated'),
            key: nameof(list[0].newStoreC2Created),
            dataIndex: nameof(list[0].newStoreC2Created),
            ellipsis: true,
            width: 90,
            render(...[newStoreC2Created]) {
              return (
                <div className="text-right table-row">{newStoreC2Created}</div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.newStoreCreatedRatio'),
            key: nameof(list[0].newStoreC2CreatedRatio),
            dataIndex: nameof(list[0].newStoreC2CreatedRatio),
            ellipsis: true,
            width: 90,
            render(...[newStoreC2CreatedRatio]) {
              return (
                <div className="text-right table-row">
                  {newStoreC2CreatedRatio}
                </div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.storesVisiteds'),
        children: [
          {
            title: translate('kpiGeneralEmployeeReports.storesVisitedPLanned'),
            key: nameof(list[0].storesVisitedPLanned),
            dataIndex: nameof(list[0].storesVisitedPLanned),
            ellipsis: true,
            width: 90,
            render(...[storesVisitedPLanned]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(storesVisitedPLanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.storesVisited'),
            key: nameof(list[0].storesVisited),
            dataIndex: nameof(list[0].storesVisited),
            ellipsis: true,
            width: 90,
            render(...[storesVisited]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(storesVisited)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.storesVisitedRatio'),
            key: nameof(list[0].storesVisitedRatio),
            dataIndex: nameof(list[0].storesVisitedRatio),
            ellipsis: true,
            width: 90,
            render(...[storesVisitedRatio]) {
              return (
                <div className="text-right table-row">{storesVisitedRatio}</div>
              );
            },
          },
        ],
      },

      {
        title: translate('kpiGeneralEmployeeReports.numberOfStoreVisits'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.numberOfStoreVisitsPlanned',
            ),
            key: nameof(list[0].numberOfStoreVisitsPlanned),
            dataIndex: nameof(list[0].numberOfStoreVisitsPlanned),
            ellipsis: true,
            width: 90,
            render(...[numberOfStoreVisitsPlanned]) {
              return (
                <div className="text-right table-row">
                  {numberOfStoreVisitsPlanned}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.numberOfStoreVisit'),
            key: nameof(list[0].numberOfStoreVisits),
            dataIndex: nameof(list[0].numberOfStoreVisits),
            ellipsis: true,
            width: 90,
            render(...[numberOfStoreVisits]) {
              return (
                <div className="text-right table-row">
                  {numberOfStoreVisits}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralEmployeeReports.numberOfStoreVisitsRatio',
            ),
            key: nameof(list[0].numberOfStoreVisitsRatio),
            dataIndex: nameof(list[0].numberOfStoreVisitsRatio),
            ellipsis: true,
            width: 90,
            render(...[numberOfStoreVisitsRatio]) {
              return (
                <div className="text-right table-row">
                  {numberOfStoreVisitsRatio}
                </div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.totalProblem'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalDirectOrdersPLanned',
            ),
            key: nameof(list[0].totalProblemPlanned),
            dataIndex: nameof(list[0].totalProblemPlanned),
            ellipsis: true,
            width: 90,
            render(...[totalProblemPlanned]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(totalProblemPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.totalDirectOrders'),
            key: nameof(list[0].totalProblem),
            dataIndex: nameof(list[0].totalProblem),
            ellipsis: true,
            width: 90,
            render(...[totalProblem]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(totalProblem)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalDirectOrdersRatio',
            ),
            key: nameof(list[0].totalProblemRatio),
            dataIndex: nameof(list[0].totalProblemRatio),
            ellipsis: true,
            width: 90,
            render(...[totalProblemRatio]) {
              return (
                <div className="text-right table-row">{totalProblemRatio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralEmployeeReports.totalImage'),
        children: [
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalDirectQuantityPlanned',
            ),
            key: nameof(list[0].totalImagePlanned),
            dataIndex: nameof(list[0].totalImagePlanned),
            ellipsis: true,
            width: 90,
            render(...[totalImagePlanned]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(totalImagePlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralEmployeeReports.totalDirectQuantity'),
            key: nameof(list[0].totalImage),
            dataIndex: nameof(list[0].totalImage),
            ellipsis: true,
            width: 90,
            render(...[totalImage]) {
              return (
                <div className="text-right table-row">
                  {formatNumber(totalImage)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralEmployeeReports.totalDirectQuantityRatio',
            ),
            key: nameof(list[0].totalImageRatio),
            dataIndex: nameof(list[0].totalImageRatio),
            ellipsis: true,
            width: 90,
            render(...[totalImageRatio]) {
              return (
                <div className="text-right table-row">{totalImageRatio}</div>
              );
            },
          },
        ],
      },
    ];
  }, [list, translate]);
  return (
    <div className="page master-page kpi-report-master">
      <Card
        title={translate('kpiGeneralEmployeeReports.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                {validAction('filterListOrganization') && (
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGeneralEmployeeReports.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleIndepentFilter(
                        nameof(filter.organizationId),
                        nameof(filter.appUserId),
                        appUserFilter,
                        setAppUserFilter,
                      )}
                      getList={
                        kpiGeneralEmployeeReportRepository.filterListOrganization
                      }
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                )}
              </Col>

              <Col className="pl-1" span={6}>
                {validAction('filterListAppUser') && (
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGeneralEmployeeReports.displayName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={
                        kpiGeneralEmployeeReportRepository.filterListAppUser
                      }
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiGeneralEmployeeReports.placeholder.displayName',
                      )}
                    />
                  </FormItem>
                )}
              </Col>
              <Col className="pl-1" span={6}>
                {validAction('filterListKpiPeriod') && (
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGeneralEmployeeReports.kpiPeriod')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiPeriodId}
                      filterType={nameof(filter.kpiPeriodId.equal)}
                      value={filter.kpiPeriodId.equal}
                      onChange={handleFilterScroll(nameof(filter.kpiPeriodId))}
                      getList={
                        kpiGeneralEmployeeReportRepository.filterListKpiPeriod
                      }
                      modelFilter={kpiPeriodFilter}
                      setModelFilter={setKpiPeriodFilter}
                      searchField={nameof(kpiPeriodFilter.name)}
                      searchType={nameof(kpiPeriodFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiGeneralEmployeeReports.placeholder.kpiPeriod',
                      )}
                    />
                  </FormItem>
                )}
              </Col>
              <Col className="pl-1" span={6}>
                {validAction('filterListKpiYear') && (
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGeneralEmployeeReports.kpiYear')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiYearId}
                      filterType={nameof(filter.kpiYearId.equal)}
                      value={filter.kpiYearId.equal}
                      onChange={handleFilterScroll(nameof(filter.kpiYearId))}
                      getList={
                        kpiGeneralEmployeeReportRepository.filterListKpiYear
                      }
                      modelFilter={kpiYearFilter}
                      setModelFilter={setKpiYearFilter}
                      searchField={nameof(kpiYearFilter.name)}
                      searchType={nameof(kpiYearFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiGeneralEmployeeReports.placeholder.kpiYear',
                      )}
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleStatistic}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.statistical)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleResetScroll(handleReset)}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        {typeof filter.appUserId.equal !== 'undefined' &&
          typeof filter.kpiYearId.equal !== 'undefined' && (
            <Row style={{ padding: '0 20px' }}>
              <div className="d-flex justify-content-between pt-3 pb-3">
                <div className="flex-shrink-1 d-flex align-items-center">
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
              </div>
              {/* scroll inifite table */}
              <div
                className="infinite-container"
                style={{ height: INF_CONTAINER_HEIGHT, overflow: 'auto' }}
              >
                <InfiniteScroll
                  initialLoad={false}
                  loadMore={handleInfiniteOnLoad}
                  hasMore={!loading && hasMore}
                  threshold={20}
                  useWindow={false}
                >
                  <ScrollContainer
                    className="scroll-container"
                    vertical={true}
                    horizontal={true}
                    hideScrollbars={false}
                  >
                    <div className="d-flex" ref={ref}>
                      <Table
                        key={nameof(list[0].key)}
                        rowKey={nameof(list[0].key)}
                        dataSource={list}
                        columns={columns}
                        loading={loading}
                        bordered={true}
                        pagination={false}
                        className="table-kpi-period"
                        footer={() => (
                          <>
                            {displayLoadMore && (
                              <div className="d-flex justify-content-start">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={handleInfiniteOnLoad}
                                >
                                  Load thêm dữ liệu
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </ScrollContainer>
                </InfiniteScroll>
              </div>
            </Row>
          )}
      </Card>
    </div>
  );
}
export default KpiGeneralEmployeeReport;
