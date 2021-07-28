import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_KPI_PRODUCTS_GROUPING_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { AppUserFilter } from 'models/AppUserFilter';
import { flattenData } from 'core/helpers/array';
import { groupRowByField } from 'helpers/ant-design/table';
import { KpiProductGroupingsReport } from 'models/kpi/KpiProductGroupingsReport';
import { KpiProductGroupingsReportDataTable } from 'models/kpi/KpiProductGroupingsReportDataTable';
import { KpiProductGroupingsReportFilter } from 'models/kpi/KpiProductGroupingsReportFilter';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StatusFilter } from 'models/StatusFilter';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../KpiGeneralReport.scss';
import { kpiGeneralReportService } from '../KpiGeneralReportService';
import { kpiItemsReportRepository } from './KpiProductGroupingsReportRepository';
const { Item: FormItem } = Form;
function KpiItemsReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-product-grouping-report',
    API_KPI_PRODUCTS_GROUPING_REPORT_ROUTE,
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
    KpiProductGroupingsReport,
    KpiProductGroupingsReportFilter
  >(
    KpiProductGroupingsReportFilter,
    kpiItemsReportRepository.list,
    kpiItemsReportRepository.count,
    'kpiPeriodId',
    'kpiYearId',
    'kpiProductGroupingTypeId',
  );

  const [dataSource] = kpiGeneralReportService.useMasterDataSource<
    KpiProductGroupingsReport,
    KpiProductGroupingsReportDataTable
  >(list, transformMethod); // using dataTest to test UI, exact is using list

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
    kpiItemsReportRepository.list,
    total,
    setLoadList,
    loading,
  );

  const handleStatistic = kpiGeneralReportService.useSearchKpi(
    handleSearch,
    filter.kpiPeriodId.equal,
    filter.kpiYearId.equal,
    translate('kpiItemsReports.lackKPiPeriod'),
    translate('kpiItemsReports.lackKPiYear'),
    filter.kpiProductGroupingTypeId.equal,
    translate('kpiProductGroupingsReports.errors.kpiProductGroupingType'),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });
  // const [itemFilter, setItemFilter] = React.useState<ItemFilter>({
  //   ...new ItemFilter(),
  // });
  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  const [kpiPeriodFilter, setKpiPeriodFilter] = React.useState<KpiPeriodFilter>(
    new KpiPeriodFilter(),
  );
  const [kpiYearFilter, setKpiYearFilter] = React.useState<KpiYearFilter>(
    new KpiYearFilter(),
  );

  const [typeFilter, setTypeFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );
  const [handleExport] = crudService.useExport(
    kpiItemsReportRepository.export,
    filter,
  );

  const columns: ColumnProps<
    KpiProductGroupingsReportDataTable
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index + 10,
        render(...[, record, rowIndex]) {
          // if (record.title) {
          //   return renderCell(record.title, record, 0, 27);
          // }
          // return (

          //   <div className="text-center table-row">{record.indexInTable}</div>
          // );
          const value = record.title ? record.title : record.indexInTable;
          return renderCell(value, record, 0, 11, rowIndex, 0, record.rowSpan);
        },
      },

      {
        title: translate('kpiProductGroupingsReports.userName'),
        key: nameof(dataSource[0].userName),
        dataIndex: nameof(dataSource[0].userName),
        ellipsis: true,
        // render(...[itemCode, record]) {
        //   if (record.title) {
        //     return renderCell(itemCode, record, 1);
        //   }
        //   return <div className="text-left table-row">{itemCode}</div>;
        // },
        render(...[username, record, rowIndex]) {
          return renderCell(
            username,
            record,
            1,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
        width: 120,
      },

      {
        title: translate('kpiProductGroupingsReports.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
        // render(...[itemCode, record]) {
        //   if (record.title) {
        //     return renderCell(itemCode, record, 1);
        //   }
        //   return <div className="text-left table-row">{itemCode}</div>;
        // },
        render(...[displayName, record, rowIndex]) {
          return renderCell(
            displayName,
            record,
            2,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
        width: 120,
      },
      {
        title: translate('kpiProductGroupingsReports.productGroupingCode'),
        key: nameof(dataSource[0].productGroupingCode),
        dataIndex: nameof(dataSource[0].productGroupingCode),
        ellipsis: true,
        render(...[itemName, record]) {
          if (record.title) {
            return renderCell(itemName, record, 2);
          }
          return <div className="text-left table-row">{itemName}</div>;
        },
        width: 150,
      },
      {
        title: translate('kpiProductGroupingsReports.productGroupingName'),
        key: nameof(dataSource[0].productGroupingName),
        dataIndex: nameof(dataSource[0].productGroupingName),
        ellipsis: true,
        render(...[itemName, record]) {
          if (record.title) {
            return renderCell(itemName, record, 2);
          }
          return <div className="text-left table-row">{itemName}</div>;
        },
        width: 150,
      },

      {
        title: translate('kpiProductGroupingsReports.indirectRevenues'),
        children: [
          {
            title: translate('kpiItemsReports.indirectRevenuePlanned'),
            key: nameof(dataSource[0].indirectRevenuePlanned),
            dataIndex: nameof(dataSource[0].indirectRevenuePlanned),
            ellipsis: true,
            render(...[indirectRevenuePlanned, record]) {
              if (record.title) {
                return renderCell(indirectRevenuePlanned, record, 6);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(indirectRevenuePlanned)}
                </div>
              );
            },
            width: 100,
          },
          {
            title: translate('kpiItemsReports.indirectRevenue'),
            key: nameof(dataSource[0].indirectRevenue),
            dataIndex: nameof(dataSource[0].indirectRevenue),
            ellipsis: true,
            render(...[indirectRevenue, record]) {
              if (record.title) {
                return renderCell(indirectRevenue, record, 7);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(indirectRevenue)}
                </div>
              );
            },
            width: 100,
          },
          {
            title: translate('kpiItemsReports.indirectRevenueRatio'),
            key: nameof(dataSource[0].indirectRevenueRatio),
            dataIndex: nameof(dataSource[0].indirectRevenueRatio),
            ellipsis: true,
            render(...[indirectRevenueRatio, record]) {
              if (record.title) {
                return renderCell(indirectRevenueRatio, record, 8);
              }
              return (
                <div className="text-right table-row">
                  {indirectRevenueRatio}
                </div>
              );
            },
            width: 100,
          },
        ],
      },

      {
        title: translate('kpiProductGroupingsReports.indirectStores'),
        children: [
          {
            title: translate('kpiItemsReports.indirectStorePlanned'),
            key: nameof(dataSource[0].indirectStorePlanned),
            dataIndex: nameof(dataSource[0].indirectStorePlanned),
            ellipsis: true,
            render(...[indirectStorePlanned, record]) {
              if (record.title) {
                return renderCell(indirectStorePlanned, record, 12);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(indirectStorePlanned)}
                </div>
              );
            },
            width: 100,
          },
          {
            title: translate('kpiItemsReports.indirectStore'),
            key: nameof(dataSource[0].indirectStore),
            dataIndex: nameof(dataSource[0].indirectStore),
            ellipsis: true,
            render(...[indirectStore, record]) {
              if (record.title) {
                return renderCell(indirectStore, record, 13);
              }
              return (
                <div className="text-right table-row">
                  {formatNumber(indirectStore)}
                </div>
              );
            },
            width: 100,
          },
          {
            title: translate('kpiItemsReports.indirectStoreRatio'),
            key: nameof(dataSource[0].indirectStoreRatio),
            dataIndex: nameof(dataSource[0].indirectStoreRatio),
            ellipsis: true,
            render(...[indirectStoreRatio, record]) {
              if (record.title) {
                return renderCell(indirectStoreRatio, record, 14);
              }
              return (
                <div className="text-right table-row">{indirectStoreRatio}</div>
              );
            },
            width: 100,
          },
        ],
      },
    ];
  }, [dataSource, translate]);
  return (
    <div className="page master-page kpi-report-master">
      <Card
        title={translate('kpiProductGroupingsReports.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {validAction('filterListKpiProductGroupingType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.kpiItemType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiProductGroupingTypeId}
                      filterType={nameof(filter.kpiProductGroupingTypeId.equal)}
                      value={filter.kpiProductGroupingTypeId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.kpiProductGroupingTypeId),
                      )}
                      getList={
                        kpiItemsReportRepository.filterListKpiProductGroupingType
                      }
                      modelFilter={typeFilter}
                      setModelFilter={setTypeFilter}
                      searchField={nameof(typeFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItemsReports.organization')}
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
                      getList={kpiItemsReportRepository.filterListOrganization}
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
                    label={translate('kpiItemsReports.displayName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={kpiItemsReportRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiItemsReports.placeholder.displayName',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListProductGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0 product-grouping"
                    label={translate('items.productGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.productGroupingId}
                      filterType={nameof(filter.productGroupingId.equal)}
                      value={filter.productGroupingId.equal}
                      onChange={handleFilterScroll('productGroupingId')}
                      getList={
                        kpiItemsReportRepository.filterListProductGrouping
                      }
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListKpiPeriod') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItemsReports.kpiPeriod')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiPeriodId}
                      filterType={nameof(filter.kpiPeriodId.equal)}
                      value={filter.kpiPeriodId.equal}
                      onChange={handleFilterScroll(nameof(filter.kpiPeriodId))}
                      getList={kpiItemsReportRepository.filterListKpiPeriod}
                      modelFilter={kpiPeriodFilter}
                      setModelFilter={setKpiPeriodFilter}
                      searchField={nameof(kpiPeriodFilter.name)}
                      searchType={nameof(kpiPeriodFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiItemsReports.placeholder.kpiPeriod',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListKpiYear') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItemsReports.kpiYear')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiYearId}
                      filterType={nameof(filter.kpiYearId.equal)}
                      value={filter.kpiYearId.equal}
                      onChange={handleFilterScroll(nameof(filter.kpiYearId))}
                      getList={kpiItemsReportRepository.filterListKpiYear}
                      modelFilter={kpiYearFilter}
                      setModelFilter={setKpiYearFilter}
                      searchField={nameof(kpiYearFilter.name)}
                      searchType={nameof(kpiYearFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'kpiItemsReports.placeholder.kpiYear',
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
          typeof filter.kpiYearId.equal !== 'undefined' &&
          typeof filter.kpiProductGroupingTypeId.equal !== 'undefined' && (
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
const transformMethod = (item: KpiProductGroupingsReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new KpiProductGroupingsReportDataTable(),
    title: item.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  const flattenBySaleEmployee = flattenData(item.saleEmployees, 'contents').map(
    item =>
      ({
        ...item,
        rowSpan: 0,
        key: uuidv4(),
      } as KpiProductGroupingsReportDataTable),
  ); // flatten by saleEmployee

  if (flattenBySaleEmployee.length > 0) {
    return [
      ...datalist,
      ...groupRowByField(
        flattenBySaleEmployee, // dataSource
        nameof(item.saleEmployees[0].userName), // groupBy field
        item.saleEmployees[0].userName, // displayName
      ), // group dataSource by displayName
    ];
  }

  // const { username, displayName } = item;
  // item.saleEmployees?.forEach((itemContents: ItemContents) => {
  //   const {
  //     itemId,
  //     itemCode,
  //     itemName,
  //     saleEmployeeId,
  //     organizationName,
  //     organizationId,
  //     indirectQuantityPlanned,
  //     indirectQuantity,
  //     indirectQuantityRatio,
  //     indirectRevenuePlanned,
  //     indirectRevenue,
  //     indirectRevenueRatio,
  //     indirectAmountPlanned,
  //     indirectAmount,
  //     indirectAmountRatio,
  //     indirectStorePlanned,
  //     indirectStore,
  //     indirectStoreRatio,
  //     directQuantityPlanned,
  //     directQuantity,
  //     directQuantityRatio,
  //     directRevenuePlanned,
  //     directRevenue,
  //     directRevenueRatio,
  //     directAmountPlanned,
  //     directAmount,
  //     directAmountRatio,
  //     directStorePlanned,
  //     directStore,
  //     directStoreRatio,
  //   } = itemContents;
  //   datalist.push({
  //     ...new KpiProductGroupingsReportDataTable(),
  //     key: uuidv4(),
  //     username,
  //     displayName,
  //     itemContents,
  //     itemId,
  //     itemCode,
  //     itemName,
  //     saleEmployeeId,
  //     organizationName,
  //     organizationId,
  //     indirectQuantityPlanned,
  //     indirectQuantity,
  //     indirectQuantityRatio,
  //     indirectRevenuePlanned,
  //     indirectRevenue,
  //     indirectRevenueRatio,
  //     indirectAmountPlanned,
  //     indirectAmount,
  //     indirectAmountRatio,
  //     indirectStorePlanned,
  //     indirectStore,
  //     indirectStoreRatio,
  //     directQuantityPlanned,
  //     directQuantity,
  //     directQuantityRatio,
  //     directRevenuePlanned,
  //     directRevenue,
  //     directRevenueRatio,
  //     directAmountPlanned,
  //     directAmount,
  //     directAmountRatio,
  //     directStorePlanned,
  //     directStore,
  //     directStoreRatio,
  //   });
  // });
  return datalist;
};
// const renderCell = (
//   value: any,
//   record: KpiProductGroupingsReportDataTable,
//   colIndex: number,
//   colNumber?: number,
// ) => {
//   // check if record has title or not
//   if (record.title) {
//     let colSpan = 0;
//     // if colIndex = 0; set colSpan = number of column
//     if (colIndex === 0) {
//       colSpan = colNumber ? colNumber : 1;
//     }
//     return {
//       children: <div className="table-title-row table-row">{value}</div>,
//       props: {
//         rowSpan: 1,
//         colSpan,
//       },
//     };
//   }
//   return {
//     children: <div className="table-row">{value}</div>,
//     props: {
//       rowSpan: record.rowSpan ? record.rowSpan : 0,
//       colSpan: 1,
//     },
//   };
// };

const renderCell = (
  value: any,
  record: KpiProductGroupingsReportDataTable,
  colIndex: number,
  colNumber?: number,
  rowIndex?: number,
  firstColNumber?: number,
  rowNumber?: number,
) => {
  // check if record has title or not
  if (record.title) {
    let colSpan = 0;
    // if colIndex = 0; set colSpan = number of column
    if (colIndex === 0) {
      colSpan = colNumber ? colNumber : 1;
    }

    return {
      children: <div className="table-title-row">{value}</div>,
      props: {
        rowSpan: 1,
        colSpan,
      },
    };
  }
  // base on type of value, we align text right, left or center
  if (rowIndex === 0) {
    let alignText = ' ';
    // if typeof value === number, format it
    if (typeof value === 'number') {
      alignText = 'text-right';
      value = formatNumber(value);
    }
    return {
      children: <div className={`${alignText}`}>{value}</div>,
      props: {
        rowSpan: 1,
        colSpan: firstColNumber,
      },
    };
  }
  let alignText = 'text-left ';
  // if typeof value === number, format it
  if (typeof value === 'number') {
    alignText = 'text-right';
    value = formatNumber(value);
  }
  if (colIndex === 0) {
    alignText = 'text-center';
  }
  return {
    children: <div className={`${alignText} table-row`}>{value}</div>,
    props: {
      rowSpan: rowNumber ? rowNumber : 0,
      colSpan: 1,
    },
  };
};
export default KpiItemsReportView;
