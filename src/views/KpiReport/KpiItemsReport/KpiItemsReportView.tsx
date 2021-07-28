import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_KPI_ITEMS_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { AppUserFilter } from 'models/AppUserFilter';
import { ItemFilter } from 'models/ItemFilter';
import { ItemContents } from 'models/kpi/ItemContents';
import { KpiItemsReport } from 'models/kpi/KpiItemsReport';
import { KpiItemsReportDataTable } from 'models/kpi/KpiItemsReportDataTable';
import { KpiItemsReportFilter } from 'models/kpi/KpiItemsReportFilter';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StatusFilter } from 'models/StatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../KpiGeneralReport.scss';
import { kpiGeneralReportService } from '../KpiGeneralReportService';
import { kpiItemsReportRepository } from './KpiItemsReportRepository';
const { Item: FormItem } = Form;
function KpiItemsReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-item-report',
    API_KPI_ITEMS_REPORT_ROUTE,
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
    KpiItemsReport,
    KpiItemsReportFilter
  >(
    KpiItemsReportFilter,
    kpiItemsReportRepository.list,
    kpiItemsReportRepository.count,
    'kpiPeriodId',
    'kpiYearId',
    'kpiItemTypeId',
  );

  const [dataSource] = kpiGeneralReportService.useMasterDataSource<
    KpiItemsReport,
    KpiItemsReportDataTable
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
    filter.kpiItemTypeId.equal,
    translate('kpiItemsReports.errors.kpiItemType'),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });
  const [itemFilter, setItemFilter] = React.useState<ItemFilter>({
    ...new ItemFilter(),
  });

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

  const columns: ColumnProps<KpiItemsReportDataTable>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render(...[, record]) {
          if (record.title) {
            return renderCell(record.title, record, 0, 27);
          }
          return (
            <div className="text-center table-row">{record.indexInTable}</div>
          );
        },
      },

      {
        title: translate('kpiItemsReports.itemcode'),
        key: nameof(dataSource[0].itemCode),
        dataIndex: nameof(dataSource[0].itemCode),
        ellipsis: true,
        render(...[itemCode, record]) {
          if (record.title) {
            return renderCell(itemCode, record, 1);
          }
          return <div className="text-left table-row">{itemCode}</div>;
        },
        width: 120,
      },
      {
        title: translate('kpiItemsReports.itemName'),
        key: nameof(dataSource[0].itemName),
        dataIndex: nameof(dataSource[0].itemName),
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
        title: translate('kpiItemsReports.indirectRevenues'),
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
        title: translate('kpiItemsReports.indirectStores'),
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
        title={translate('kpiItemsReports.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {validAction('filterListKpiItemType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.kpiItemType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiItemTypeId}
                      filterType={nameof(filter.kpiItemTypeId.equal)}
                      value={filter.kpiItemTypeId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.kpiItemTypeId),
                      )}
                      getList={kpiItemsReportRepository.filterListKpiItemType}
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
              {validAction('filterListItem') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItemsReports.ItemName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.itemId}
                      filterType={nameof(filter.itemId.equal)}
                      value={filter.itemId.equal}
                      onChange={handleFilterScroll(nameof(filter.itemId))}
                      getList={kpiItemsReportRepository.filterListItem}
                      modelFilter={itemFilter}
                      setModelFilter={setItemFilter}
                      searchField={nameof(itemFilter.search)}
                      // searchType={nameof(itemFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
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
          typeof filter.kpiItemTypeId.equal !== 'undefined' && (
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
const transformMethod = (item: KpiItemsReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new KpiItemsReportDataTable(),
    title: `${item.username} - ${item.displayName}`,
    key: uuidv4(),
    rowSpan: 1,
  };
  const { username, displayName } = item;
  item.itemContents?.forEach((itemContents: ItemContents) => {
    const {
      itemId,
      itemCode,
      itemName,
      saleEmployeeId,
      organizationName,
      organizationId,
      indirectQuantityPlanned,
      indirectQuantity,
      indirectQuantityRatio,
      indirectRevenuePlanned,
      indirectRevenue,
      indirectRevenueRatio,
      indirectAmountPlanned,
      indirectAmount,
      indirectAmountRatio,
      indirectStorePlanned,
      indirectStore,
      indirectStoreRatio,
      directQuantityPlanned,
      directQuantity,
      directQuantityRatio,
      directRevenuePlanned,
      directRevenue,
      directRevenueRatio,
      directAmountPlanned,
      directAmount,
      directAmountRatio,
      directStorePlanned,
      directStore,
      directStoreRatio,
    } = itemContents;
    datalist.push({
      ...new KpiItemsReportDataTable(),
      key: uuidv4(),
      username,
      displayName,
      itemContents,
      itemId,
      itemCode,
      itemName,
      saleEmployeeId,
      organizationName,
      organizationId,
      indirectQuantityPlanned,
      indirectQuantity,
      indirectQuantityRatio,
      indirectRevenuePlanned,
      indirectRevenue,
      indirectRevenueRatio,
      indirectAmountPlanned,
      indirectAmount,
      indirectAmountRatio,
      indirectStorePlanned,
      indirectStore,
      indirectStoreRatio,
      directQuantityPlanned,
      directQuantity,
      directQuantityRatio,
      directRevenuePlanned,
      directRevenue,
      directRevenueRatio,
      directAmountPlanned,
      directAmount,
      directAmountRatio,
      directStorePlanned,
      directStore,
      directStoreRatio,
    });
  });
  return datalist;
};
const renderCell = (
  value: any,
  record: KpiItemsReportDataTable,
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
export default KpiItemsReportView;
