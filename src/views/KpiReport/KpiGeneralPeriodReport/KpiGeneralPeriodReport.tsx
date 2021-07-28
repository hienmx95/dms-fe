import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_KPI_GENERAL_PERIOD_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiGeneralPeriodReportDataTable } from 'models/kpi/KpiGeneralPeriodReportDataTable';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiPeriodReport } from 'models/kpi/KpiPeriodReport';
import { KpiPeriodReportFilter } from 'models/kpi/KpiPeriodReportFilter';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { SaleEmployee } from 'models/kpi/SaleEmployee';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
// import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../KpiGeneralReport.scss';
import { kpiGeneralReportService } from '../KpiGeneralReportService';
import { kpiGeneralPeriodReportRepository } from './KpiGeneralPeriodReportRepository';
const { Item: FormItem } = Form;
function KpiGeneralPeriodReport() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-general-period-report',
    API_KPI_GENERAL_PERIOD_REPORT_ROUTE,
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
    KpiPeriodReport,
    KpiPeriodReportFilter
  >(
    KpiPeriodReportFilter,
    kpiGeneralPeriodReportRepository.list,
    kpiGeneralPeriodReportRepository.count,
    'kpiPeriodId',
    'kpiYearId',
  );

  const [dataSource] = kpiGeneralReportService.useMasterDataSource<
    KpiPeriodReport,
    KpiGeneralPeriodReportDataTable
  >(list, transformMethod);

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
    kpiGeneralPeriodReportRepository.list,
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
    kpiGeneralPeriodReportRepository.export,
    filter,
  );

  const handleStatistic = kpiGeneralReportService.useSearchKpi(
    handleSearch,
    filter.kpiPeriodId.equal,
    filter.kpiYearId.equal,
    translate('kpiGeneralPeriodReports.lackKPiPeriod'),
    translate('kpiGeneralPeriodReports.lackKPiYear'),
  );

  const columns: ColumnProps<
    KpiGeneralPeriodReportDataTable
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render(...[, record]) {
          if (record.title) {
            return renderCell(record.title, record, 0, 30);
          }
          return (
            <div className="text-center table-row">{record.indexInTable}</div>
          );
        },
      },

      {
        title: translate('kpiGeneralPeriodReports.username'),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        width: 150,
        ellipsis: true,
        render(...[username, record]) {
          if (record.title) {
            return renderCell(username, record, 1);
          }
          return <div className="text-left table-row">{username}</div>;
        },
      },
      {
        title: translate('kpiGeneralPeriodReports.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
        width: 150,
        render(...[displayName, record]) {
          if (record.title) {
            return renderCell(displayName, record, 2);
          }
          return <div className="text-left table-row">{displayName}</div>;
        },
      },
      {
        title: translate('kpiGeneralPeriodReports.totalIndirectSalesAmount'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.totalPLanned'),
            key: nameof(dataSource[0].totalIndirectSalesAmountPlanned),
            dataIndex: nameof(dataSource[0].totalIndirectSalesAmountPlanned),
            ellipsis: true,
            width: 90,
            render(...[totalIndirectSalesAmountPlanned, record]) {
              if (record.title) {
                return renderCell(totalIndirectSalesAmountPlanned, record, 3);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(totalIndirectSalesAmountPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.total'),
            key: nameof(dataSource[0].totalIndirectSalesAmount),
            dataIndex: nameof(dataSource[0].totalIndirectSalesAmount),
            ellipsis: true,
            width: 90,
            render(...[totalIndirectSalesAmount, record]) {
              if (record.title) {
                return renderCell(totalIndirectSalesAmount, record, 4);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(totalIndirectSalesAmount)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.totalRatio'),
            key: nameof(dataSource[0].totalIndirectSalesAmountRatio),
            dataIndex: nameof(dataSource[0].totalIndirectSalesAmountRatio),
            ellipsis: true,
            width: 90,
            render(...[totalIndirectSalesAmountRatio, record]) {
              if (record.title) {
                return renderCell(totalIndirectSalesAmountRatio, record, 5);
              }
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
        title: translate('kpiGeneralPeriodReports.revenueC2TD'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.totalPlanned'),
            key: nameof(dataSource[0].revenueC2TDPlanned),
            dataIndex: nameof(dataSource[0].revenueC2TDPlanned),
            ellipsis: true,
            width: 90,
            render(...[revenueC2TDPlanned, record]) {
              if (record.title) {
                return renderCell(revenueC2TDPlanned, record, 6);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2TDPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.total'),
            key: nameof(dataSource[0].revenueC2TD),
            dataIndex: nameof(dataSource[0].revenueC2TD),
            ellipsis: true,
            width: 90,
            render(...[revenueC2TD, record]) {
              if (record.title) {
                return renderCell(revenueC2TD, record, 7);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2TD)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.totalRatio'),
            key: nameof(dataSource[0].revenueC2TDRatio),
            dataIndex: nameof(dataSource[0].revenueC2TDRatio),
            ellipsis: true,
            width: 90,
            render(...[revenueC2TDRatio, record]) {
              if (record.title) {
                return renderCell(revenueC2TDRatio, record, 8);
              }
              return (
                <div className="text-right table-row">{revenueC2TDRatio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralPeriodReports.revenueC2SL'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.totalPlanned'),
            key: nameof(dataSource[0].revenueC2SLPlanned),
            dataIndex: nameof(dataSource[0].revenueC2SLPlanned),
            ellipsis: true,
            width: 90,
            render(...[revenueC2SLPlanned, record]) {
              if (record.title) {
                return renderCell(revenueC2SLPlanned, record, 9);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2SLPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.total'),
            key: nameof(dataSource[0].revenueC2SL),
            dataIndex: nameof(dataSource[0].revenueC2SL),
            ellipsis: true,
            width: 90,
            render(...[revenueC2SL, record]) {
              if (record.title) {
                return renderCell(revenueC2SL, record, 10);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2SL)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.totalRatio'),
            key: nameof(dataSource[0].revenueC2SLRatio),
            dataIndex: nameof(dataSource[0].revenueC2SLRatio),
            ellipsis: true,
            width: 90,
            render(...[revenueC2SLRatio, record]) {
              if (record.title) {
                return renderCell(revenueC2SLRatio, record, 11);
              }
              return (
                <div className="text-right table-row">{revenueC2SLRatio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralPeriodReports.revenueC2'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.skuPlanned'),
            key: nameof(dataSource[0].revenueC2Planned),
            dataIndex: nameof(dataSource[0].revenueC2Planned),
            ellipsis: true,
            width: 90,
            render(...[revenueC2Planned, record]) {
              if (record.title) {
                return renderCell(revenueC2Planned, record, 12);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2Planned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.sku'),
            key: nameof(dataSource[0].revenueC2),
            dataIndex: nameof(dataSource[0].revenueC2),
            ellipsis: true,
            width: 90,
            render(...[revenueC2, record]) {
              if (record.title) {
                return renderCell(revenueC2, record, 13);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(revenueC2)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.skuRatio'),
            key: nameof(dataSource[0].revenueC2Ratio),
            dataIndex: nameof(dataSource[0].revenueC2Ratio),
            ellipsis: true,
            width: 90,
            render(...[revenueC2Ratio, record]) {
              if (record.title) {
                return renderCell(revenueC2Ratio, record, 14);
              }
              return (
                <div className="text-right table-row">{revenueC2Ratio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralPeriodReports.newStoreCreateds'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.newStoreCreatedPlanned'),
            key: nameof(dataSource[0].newStoreCreatedPlanned),
            dataIndex: nameof(dataSource[0].newStoreCreatedPlanned),
            ellipsis: true,
            width: 90,
            render(...[newStoreCreatedPlanned, record]) {
              if (record.title) {
                return renderCell(newStoreCreatedPlanned, record, 18);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(newStoreCreatedPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.newStoreCreated'),
            key: nameof(dataSource[0].newStoreCreated),
            dataIndex: nameof(dataSource[0].newStoreCreated),
            ellipsis: true,
            width: 90,
            render(...[newStoreCreated, record]) {
              if (record.title) {
                return renderCell(newStoreCreated, record, 19);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(newStoreCreated)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.newStoreCreatedRatio'),
            key: nameof(dataSource[0].newStoreCreatedRatio),
            dataIndex: nameof(dataSource[0].newStoreCreatedRatio),
            ellipsis: true,
            width: 90,
            render(...[newStoreCreatedRatio, record]) {
              if (record.title) {
                return renderCell(newStoreCreatedRatio, record, 20);
              }
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
        title: translate('kpiGeneralPeriodReports.newStoreC2Created'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.storesVisitedPLanned'),
            key: nameof(dataSource[0].newStoreC2CreatedPlanned),
            dataIndex: nameof(dataSource[0].newStoreC2CreatedPlanned),
            ellipsis: true,
            width: 90,
            render(...[newStoreC2CreatedPlanned, record]) {
              if (record.title) {
                return renderCell(newStoreC2CreatedPlanned, record, 15);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(newStoreC2CreatedPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.storesVisited'),
            key: nameof(dataSource[0].newStoreC2Created),
            dataIndex: nameof(dataSource[0].newStoreC2Created),
            ellipsis: true,
            width: 90,
            render(...[newStoreC2Created, record]) {
              if (record.title) {
                return renderCell(newStoreC2Created, record, 16);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(newStoreC2Created)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.storesVisitedRatio'),
            key: nameof(dataSource[0].newStoreC2CreatedRatio),
            dataIndex: nameof(dataSource[0].newStoreC2CreatedRatio),
            ellipsis: true,
            width: 90,
            render(...[newStoreC2CreatedRatio, record]) {
              if (record.title) {
                return renderCell(newStoreC2CreatedRatio, record, 17);
              }
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
        title: translate('kpiGeneralPeriodReports.storesVisiteds'),
        children: [
          {
            title: translate(
              'kpiGeneralPeriodReports.numberOfStoreVisitsPlanned',
            ),
            key: nameof(dataSource[0].storesVisitedPLanned),
            dataIndex: nameof(dataSource[0].storesVisitedPLanned),
            ellipsis: true,
            width: 90,
            render(...[storesVisitedPLanned, record]) {
              if (record.title) {
                return renderCell(storesVisitedPLanned, record, 21);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(storesVisitedPLanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.numberOfStoreVisit'),
            key: nameof(dataSource[0].storesVisited),
            dataIndex: nameof(dataSource[0].storesVisited),
            ellipsis: true,
            width: 90,
            render(...[storesVisited, record]) {
              if (record.title) {
                return renderCell(storesVisited, record, 22);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(storesVisited)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralPeriodReports.numberOfStoreVisitsRatio',
            ),
            key: nameof(dataSource[0].storesVisitedRatio),
            dataIndex: nameof(dataSource[0].storesVisitedRatio),
            ellipsis: true,
            width: 90,
            render(...[storesVisitedRatio, record]) {
              if (record.title) {
                return renderCell(storesVisitedRatio, record, 23);
              }
              return (
                <div className="text-right table-row">{storesVisitedRatio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralPeriodReports.numberOfStoreVisits'),
        children: [
          {
            title: translate(
              'kpiGeneralPeriodReports.numberOfStoreVisitsPlanned',
            ),
            key: nameof(dataSource[0].numberOfStoreVisitsPlanned),
            dataIndex: nameof(dataSource[0].numberOfStoreVisitsPlanned),
            ellipsis: true,
            width: 90,
            render(...[numberOfStoreVisitsPlanned, record]) {
              if (record.title) {
                return renderCell(numberOfStoreVisitsPlanned, record, 21);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(numberOfStoreVisitsPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.numberOfStoreVisit'),
            key: nameof(dataSource[0].numberOfStoreVisits),
            dataIndex: nameof(dataSource[0].numberOfStoreVisits),
            ellipsis: true,
            width: 90,
            render(...[numberOfStoreVisits, record]) {
              if (record.title) {
                return renderCell(numberOfStoreVisits, record, 22);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(numberOfStoreVisits)}
                </div>
              );
            },
          },
          {
            title: translate(
              'kpiGeneralPeriodReports.numberOfStoreVisitsRatio',
            ),
            key: nameof(dataSource[0].numberOfStoreVisitsRatio),
            dataIndex: nameof(dataSource[0].numberOfStoreVisitsRatio),
            ellipsis: true,
            width: 90,
            render(...[numberOfStoreVisitsRatio, record]) {
              if (record.title) {
                return renderCell(numberOfStoreVisitsRatio, record, 23);
              }
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
        title: translate('kpiGeneralPeriodReports.totalProblem'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.totalPLanned'),
            key: nameof(dataSource[0].totalProblemPlanned),
            dataIndex: nameof(dataSource[0].totalProblemPlanned),
            ellipsis: true,
            width: 90,
            render(...[totalProblemPlanned, record]) {
              if (record.title) {
                return renderCell(totalProblemPlanned, record, 24);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(totalProblemPlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.total'),
            key: nameof(dataSource[0].totalProblem),
            dataIndex: nameof(dataSource[0].totalProblem),
            ellipsis: true,
            width: 90,
            render(...[totalProblem, record]) {
              if (record.title) {
                return renderCell(totalProblem, record, 25);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(totalProblem)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.totalRatio'),
            key: nameof(dataSource[0].totalProblemRatio),
            dataIndex: nameof(dataSource[0].totalProblemRatio),
            ellipsis: true,
            width: 90,
            render(...[totalProblemRatio, record]) {
              if (record.title) {
                return renderCell(totalProblemRatio, record, 26);
              }
              return (
                <div className="text-right table-row">{totalProblemRatio}</div>
              );
            },
          },
        ],
      },
      {
        title: translate('kpiGeneralPeriodReports.totalImage'),
        children: [
          {
            title: translate('kpiGeneralPeriodReports.totalPlanned'),
            key: nameof(dataSource[0].totalImagePlanned),
            dataIndex: nameof(dataSource[0].totalImagePlanned),
            ellipsis: true,
            width: 90,
            render(...[totalImagePlanned, record]) {
              if (record.title) {
                return renderCell(totalImagePlanned, record, 27);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(totalImagePlanned)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.total'),
            key: nameof(dataSource[0].totalImage),
            dataIndex: nameof(dataSource[0].totalImage),
            ellipsis: true,
            width: 90,
            render(...[totalImage, record]) {
              if (record.title) {
                return renderCell(totalImage, record, 28);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(totalImage)}
                </div>
              );
            },
          },
          {
            title: translate('kpiGeneralPeriodReports.totalRatio'),
            key: nameof(dataSource[0].totalImageRatio),
            dataIndex: nameof(dataSource[0].totalImageRatio),
            ellipsis: true,
            width: 90,
            render(...[totalImageRatio, record]) {
              if (record.title) {
                return renderCell(totalImageRatio, record, 29);
              }
              return (
                <div className="text-right table-row">{totalImageRatio}</div>
              );
            },
          },
        ],
      },
    ];
  }, [dataSource, translate]);
  return (
    <div className="page master-page kpi-report-master">
      <Card
        title={translate('kpiGeneralPeriodReports.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGeneralPeriodReports.organization')}
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
                        kpiGeneralPeriodReportRepository.filterListOrganization
                      }
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
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
                    label={translate('kpiGeneralPeriodReports.displayName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={
                        kpiGeneralPeriodReportRepository.filterListAppUser
                      }
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiGeneralPeriodReports.placeholder.appUser',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListKpiPeriod') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGeneralPeriodReports.kpiPeriod')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiPeriodId}
                      filterType={nameof(filter.kpiPeriodId.equal)}
                      value={filter.kpiPeriodId.equal}
                      onChange={handleFilterScroll(nameof(filter.kpiPeriodId))}
                      getList={
                        kpiGeneralPeriodReportRepository.filterListKpiPeriod
                      }
                      modelFilter={kpiPeriodFilter}
                      setModelFilter={setKpiPeriodFilter}
                      searchField={nameof(kpiPeriodFilter.name)}
                      searchType={nameof(kpiPeriodFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiGeneralPeriodReports.placeholder.kpiPeriod',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListKpiYear') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGeneralPeriodReports.kpiYear')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiYearId}
                      filterType={nameof(filter.kpiYearId.equal)}
                      value={filter.kpiYearId.equal}
                      onChange={handleFilterScroll(nameof(filter.kpiYearId))}
                      getList={
                        kpiGeneralPeriodReportRepository.filterListKpiYear
                      }
                      modelFilter={kpiYearFilter}
                      setModelFilter={setKpiYearFilter}
                      searchField={nameof(kpiYearFilter.name)}
                      searchType={nameof(kpiYearFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiGeneralPeriodReports.placeholder.kpiYear',
                      )}
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
        {typeof filter.kpiPeriodId.equal !== 'undefined' &&
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
                        key={nameof(dataSource[0].key)}
                        rowKey={nameof(dataSource[0].key)}
                        dataSource={dataSource}
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
const transformMethod = (item: KpiPeriodReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new KpiGeneralPeriodReportDataTable(),
    title: item.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  item.saleEmployees?.forEach((epmloyee: SaleEmployee) => {
    const {
      username,
      displayName,
      totalIndirectSalesAmountPlanned,
      totalIndirectSalesAmount,
      totalIndirectSalesAmountRatio,
      revenueC2TDPlanned,
      revenueC2TD,
      revenueC2TDRatio,
      revenueC2SLPlanned,
      revenueC2SL,
      revenueC2SLRatio,
      revenueC2Planned,
      revenueC2,
      revenueC2Ratio,
      newStoreC2CreatedPlanned,
      newStoreC2Created,
      newStoreC2CreatedRatio,
      totalProblemPlanned,
      totalProblem,
      totalProblemRatio,
      totalImagePlanned,
      totalImage,
      totalImageRatio,
      storesVisitedPLanned,
      storesVisited,
      storesVisitedRatio,
      newStoreCreatedPlanned,
      newStoreCreated,
      newStoreCreatedRatio,
      numberOfStoreVisitsPlanned,
      numberOfStoreVisits,
      numberOfStoreVisitsRatio,
    } = epmloyee;
    datalist.push({
      ...new KpiGeneralPeriodReportDataTable(),
      key: uuidv4(),
      username,
      displayName,
      totalIndirectSalesAmountPlanned,
      totalIndirectSalesAmount,
      totalIndirectSalesAmountRatio,
      revenueC2TDPlanned,
      revenueC2TD,
      revenueC2TDRatio,
      revenueC2SLPlanned,
      revenueC2SL,
      revenueC2SLRatio,
      revenueC2Planned,
      revenueC2,
      revenueC2Ratio,
      newStoreC2CreatedPlanned,
      newStoreC2Created,
      newStoreC2CreatedRatio,
      totalProblemPlanned,
      totalProblem,
      totalProblemRatio,
      totalImagePlanned,
      totalImage,
      totalImageRatio,
      storesVisitedPLanned,
      storesVisited,
      storesVisitedRatio,
      newStoreCreatedPlanned,
      newStoreCreated,
      newStoreCreatedRatio,
      numberOfStoreVisitsPlanned,
      numberOfStoreVisits,
      numberOfStoreVisitsRatio,
    });
  });
  return datalist;
};
const renderCell = (
  value: any,
  record: KpiGeneralPeriodReportDataTable,
  colIndex: number,
  colNumber?: number,
) => {
  // check if record has title or not
  if (record.title) {
    let colSpan = 0;
    // if colIndex = 0; set colSpan = number of column
    if (colIndex === 0) {
      colSpan = colNumber ? colNumber : 1;
    }
    return {
      children: <div className="table-title-row table-row">{value}</div>,
      props: {
        rowSpan: 1,
        colSpan,
      },
    };
  }
  return {
    children: <div className="table-row">{value}</div>,
    props: {
      rowSpan: record.rowSpan ? record.rowSpan : 0,
      colSpan: 1,
    },
  };
};
export default KpiGeneralPeriodReport;
