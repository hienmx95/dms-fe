import { Col, Modal, notification, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import { AxiosError } from 'axios';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedIdMultiFilter from 'components/AdvancedIdMultiFilter/AdvancedIdMultiFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { DEFAULT_TAKE, INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Items } from 'models/report/Items';
import { SalesOrderByStoreAndItemsReport } from 'models/report/SalesOrderByStoreAndItemsReport';
import { SalesOrderByStoreAndItemsReportDataTable } from 'models/report/SalesOrderByStoreAndItemsReportDataTable';
import { SalesOrderByStoreAndItemsReportFilter } from 'models/report/SalesOrderByStoreAndItemsReportFilter';
import { Store } from 'models/report/Store';
import { StoreFilter } from 'models/report/StoreFilter';
import { StoreGroupingFilter } from 'models/report/StoreGroupingFilter';
import { StoreTypeFilter } from 'models/report/StoreTypeFilter';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Report.scss';
import { reportService } from '../ReportService';
import { salesOrderByStoreAndItemsRepository } from './SalesOrderByStoreAndItemsRepository';
const { Item: FormItem } = Form;
function SalesOrderByStoreAndItemsReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'indirect-sales-order-by-store-and-items-report',
    API_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
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
    ,
    ,
    dateFilter,
    setDateFilter,
  ] = reportService.useReportMaster<
    SalesOrderByStoreAndItemsReport,
    SalesOrderByStoreAndItemsReportFilter
  >(
    SalesOrderByStoreAndItemsReportFilter,
    salesOrderByStoreAndItemsRepository.list,
    salesOrderByStoreAndItemsRepository.count,
    'orderDate',
  );
  const [
    hasMore,
    setHasMore,
    handleInfiniteOnLoad,
    handleSearch,
    handleFilterScroll,
    isCount,
    setIsCount,
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
    salesOrderByStoreAndItemsRepository.list,
    total,
    setLoadList,
  );
  const [totalCount] = reportService.getTitleNumber<
    SalesOrderByStoreAndItemsReportDataTable,
    SalesOrderByStoreAndItemsReportFilter
  >(filter, salesOrderByStoreAndItemsRepository.total, isCount, setIsCount);

  const [dataSource] = reportService.useMasterDataSource<
    SalesOrderByStoreAndItemsReport,
    SalesOrderByStoreAndItemsReportDataTable
  >(list, transformMethod);

  const [dataList] = reportService.addTotalCount<
    SalesOrderByStoreAndItemsReportDataTable
  >(dataSource, totalCount);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );
  const [storeTypeFilter, setStoreTypeFilter] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );
  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());
  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StoreStatusFilter
  >(new StoreStatusFilter());
  const [resetStore, setResetStore] = React.useState<boolean>(false);
  const [resetItem, setResetItem] = React.useState<boolean>(false);
  // const [dateFilter, setDateFilter] = React.useState<DateFilter>(new DateFilter());

  const [itemFilter, setItemFilter] = React.useState<ItemFilter>(
    new ItemFilter(),
  );

  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  const [defaultListItem, setDefaultListItem] = React.useState<Item[]>([]);
  const [loadItem, setLoadItem] = React.useState<boolean>(true);
  const [dates, setDates] = React.useState<boolean>(true);
  const [handleExport] = crudService.useExport(
    salesOrderByStoreAndItemsRepository.export,
    filter,
  );

  React.useEffect(() => {
    if (loadItem) {
      salesOrderByStoreAndItemsRepository
        .filterListItem(itemFilter)
        .then(res => {
          setDefaultListItem(res);
          setLoadItem(false);
        })
        .catch((error: AxiosError) => {
          notification.error(error);
        });
    }
    if (filter.orderDate.lessEqual && dates) {
      setDateFilter({ ...filter.orderDate });
      const days = filter.orderDate.lessEqual.diff(
        filter.orderDate.greaterEqual,
        'days',
      );
      setDates(false);

      if (days > 31) {
        Modal.confirm({
          title: translate('general.filter.date'),
          content: translate('general.filter.dateContent'),
          cancelText: translate('general.actions.cancel'),
          okText: translate('general.actions.ok'),
          onOk() {
            handleExport();
          },
        });
      }
    }
  }, [
    filter,
    itemFilter,
    loadItem,
    setDateFilter,
    translate,
    dates,
    handleExport,
  ]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'orderDate') {
          filter.orderDate.lessEqual = f.lessEqual;
          filter.orderDate.greaterEqual = undefined;
          filter.orderDate.greaterEqual = f.greaterEqual;
          if (f.lessEqual && f.greaterEqual) {
            const days = f.lessEqual.diff(f.greaterEqual, 'days');
            if (days > 31) {
              Modal.confirm({
                title: translate('general.filter.date'),
                content: translate('general.filter.dateContent'),
                cancelText: translate('general.actions.cancel'),
                okText: translate('general.actions.ok'),
                onOk() {
                  // setLoading(true);
                  setFilter({ ...filter });
                  handleExport();
                },
              });
            } else {
              setFilter({ ...filter });
              handleSearch();
            }
          } else {
            setFilter({ ...filter });
            handleSearch();
          }
        }
        setDateFilter({ ...f });
      };
    },
    [filter, handleSearch, setFilter, handleExport, translate, setDateFilter],
  );

  const handleChange = React.useCallback(
    event => {
      filter.itemId.in = event?.in;
      setFilter({ ...filter });
      handleSearch();
    },
    [setFilter, filter, handleSearch],
  );

  /* this filter for controlling dependent advancedIdFilter */

  const handleControlFilter = React.useCallback(
    (field: string) => {
      return f => {
        setFilter({ ...filter, [field]: f, skip: 0, take: DEFAULT_TAKE });
        setStoreFilter({ ...storeFilter, [field]: f });
        setHasMore(true);
        setLoadList(true);
      };
    },
    [filter, setFilter, setHasMore, setLoadList, storeFilter],
  );

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetStore(true);
    setResetItem(true);
  }, [handleResetScroll, handleReset]);

  const columns: ColumnProps<
    SalesOrderByStoreAndItemsReportDataTable
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index + 10,
        render(...[, record, rowIndex]) {
          let value = record.title ? record.title : record.indexInTable;
          if (rowIndex === 0) {
            value = translate('general.total');
          }
          return renderCell(value, record, 0, 15, rowIndex, 9, record.rowSpan);
        },
      },

      {
        title: translate('salesOrderByStoreAndItemsReports.storeCode'),
        key: nameof(dataList[0].storeCode),
        dataIndex: nameof(dataList[0].storeCode),
        width: 150,
        ellipsis: true,
        render(...[storeCode, record, rowIndex]) {
          return renderCell(
            storeCode,
            record,
            1,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
      },
      {
        title: translate('salesOrderByStoreAndItemsReports.storeCodeDraft'),
        key: nameof(dataList[0].storeCodeDraft),
        dataIndex: nameof(dataList[0].storeCodeDraft),
        width: 150,
        ellipsis: true,
        render(...[storeCodeDraft, record, rowIndex]) {
          return renderCell(
            storeCodeDraft,
            record,
            2,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
      },
      {
        title: translate('salesOrderByStoreAndItemsReports.storeName'),
        key: nameof(dataList[0].storeName),
        dataIndex: nameof(dataList[0].storeName),
        ellipsis: true,
        width: 150,
        render(...[storeName, record, rowIndex]) {
          return renderCell(
            storeName,
            record,
            3,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
      },
      {
        title: translate('salesOrderByStoreAndItemsReports.address'),
        key: nameof(dataList[0].address),
        dataIndex: nameof(dataList[0].address),
        ellipsis: true,
        width: 150,
        render(...[address, record, rowIndex]) {
          return renderCell(address, record, 4, 0, rowIndex, 0, record.rowSpan);
        },
      },
      {
        title: translate('salesOrderByStoreAndItemsReports.storeStatus'),
        key: nameof(dataList[0].storeStatusName),
        dataIndex: nameof(dataList[0].storeStatusName),
        ellipsis: true,
        width: 150,
        render(...[storeStatusName, record, rowIndex]) {
          return renderCell(
            storeStatusName,
            record,
            5,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
      },
      {
        title: translate('salesOrderByStoreAndItemsReports.item'),
        children: [
          {
            title: translate('salesOrderByStoreAndItemsReports.itemCode'),
            key: nameof(dataList[0].itemCode),
            dataIndex: nameof(dataList[0].itemCode),
            ellipsis: true,
            width: 150,
            render(...[itemCode, record, rowIndex]) {
              return renderCell(itemCode, record, 6, 0, rowIndex, 0, 1);
            },
          },
          {
            title: translate('salesOrderByStoreAndItemsReports.itemName'),
            key: nameof(dataList[0].itemName),
            dataIndex: nameof(dataList[0].itemName),
            ellipsis: true,
            width: 150,
            render(...[itemName, record, rowIndex]) {
              return renderCell(itemName, record, 7, 0, rowIndex, 0, 1);
            },
          },
          {
            title: translate(
              'salesOrderByStoreAndItemsReports.unitOfMeasureName',
            ),
            key: nameof(dataList[0].unitOfMeasureName),
            dataIndex: nameof(dataList[0].unitOfMeasureName),
            ellipsis: true,
            width: 150,
            render(...[unitOfMeasureName, record, rowIndex]) {
              return renderCell(
                unitOfMeasureName,
                record,
                8,
                0,
                rowIndex,
                0,
                1,
              );
            },
          },
          {
            title: translate('salesOrderByStoreAndItemsReports.saleStock'),
            key: nameof(dataList[0].saleStock),
            dataIndex: nameof(dataList[0].saleStock),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[saleStock, record, rowIndex]) {
              let value = saleStock;
              if (rowIndex === 0) {
                value = record.totalSalesStock;
              }
              return renderCell(value, record, 9, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate('salesOrderByStoreAndItemsReports.promotionStock'),
            key: nameof(dataList[0].promotionStock),
            dataIndex: nameof(dataList[0].promotionStock),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[promotionStock, record, rowIndex]) {
              let value = promotionStock;
              if (rowIndex === 0) {
                value = record.totalPromotionStock;
              }
              return renderCell(value, record, 10, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate(
              'salesOrderByStoreAndItemsReports.salePriceAverage',
            ),
            key: nameof(dataList[0].salePriceAverage),
            dataIndex: nameof(dataList[0].salePriceAverage),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[salePriceAverage, record, rowIndex]) {
              return renderCell(
                salePriceAverage,
                record,
                11,
                0,
                rowIndex,
                1,
                1,
              );
            },
          },
          {
            title: translate('salesOrderByStoreAndItemsReports.discount'),
            key: nameof(dataList[0].discount),
            dataIndex: nameof(dataList[0].discount),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[discount, record, rowIndex]) {
              let value = discount;
              if (rowIndex === 0) {
                value = record.totalDiscount;
              }
              return renderCell(value, record, 12, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate('salesOrderByStoreAndItemsReports.revenue'),
            key: nameof(dataList[0].revenue),
            dataIndex: nameof(dataList[0].revenue),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[revenue, record, rowIndex]) {
              let value = revenue;
              if (rowIndex === 0) {
                value = record.totalRevenue;
              }
              return renderCell(value, record, 13, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate(
              'salesOrderByStoreAndItemsReports.indirecSalesOrderCounter',
            ),
            key: nameof(dataList[0].salesOrderCounter),
            dataIndex: nameof(dataList[0].salesOrderCounter),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[salesOrderCounter, record, rowIndex]) {
              return renderCell(
                salesOrderCounter,
                record,
                14,
                0,
                rowIndex,
                1,
                1,
              );
            },
          },
        ],
      },
    ];
  }, [dataList, translate]);

  const hanleDefaultSearch = React.useCallback(() => {
    if (dateFilter.lessEqual && dateFilter.greaterEqual) {
      const days = dateFilter.lessEqual.diff(dateFilter.greaterEqual, 'days');

      if (days > 31) {
        Modal.confirm({
          title: translate('general.filter.date'),
          content: translate('general.filter.dateContent'),
          cancelText: translate('general.actions.cancel'),
          okText: translate('general.actions.ok'),
          onOk() {
            handleExport();
          },
        });
      }
    }
    handleSearch();
  }, [handleSearch, dateFilter, translate, handleExport]);

  return (
    <div className="page master-page kpi-report-master">
      <Card
        title={translate('salesOrderByStoreAndItemsReports.master.title')}
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
                    label={translate(
                      'salesOrderByStoreAndItemsReports.organization',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleIndepentFilter(
                        nameof(filter.organizationId),
                        nameof(filter.storeId),
                        storeFilter,
                        setStoreFilter,
                        () => {
                          setResetStore(true);
                        },
                      )}
                      getList={
                        salesOrderByStoreAndItemsRepository.filterListOrganization
                      }
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate(
                      'salesOrderByStoreAndItemsReports.storeGrouping',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeGroupingId}
                      filterType={nameof(filter.storeGroupingId.equal)}
                      value={filter.storeGroupingId.equal}
                      onChange={handleControlFilter(
                        nameof(filter.storeGroupingId),
                      )}
                      getList={
                        salesOrderByStoreAndItemsRepository.filterListStoreGrouping
                      }
                      modelFilter={storeGroupingFilter}
                      setModelFilter={setStoreGroupingFilter}
                      searchField={nameof(storeGroupingFilter.name)}
                      searchType={nameof(storeGroupingFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'salesOrderByStoreAndItemsReports.placeholder.storeGrouping',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate(
                      'salesOrderByStoreAndItemsReports.storeType',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleControlFilter(nameof(filter.storeTypeId))}
                      getList={
                        salesOrderByStoreAndItemsRepository.filterListStoreType
                      }
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      searchField={nameof(storeTypeFilter.name)}
                      searchType={nameof(storeTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'salesOrderByStoreAndItemsReports.placeholder.storeType',
                      )}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate(
                      'salesOrderByStoreAndItemsReports.storeName',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeId))}
                      getList={
                        salesOrderByStoreAndItemsRepository.filterListStore
                      }
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      isReset={resetStore}
                      setIsReset={setResetStore}
                      placeholder={translate(
                        'salesOrderByStoreAndItemsReports.placeholder.storeName',
                      )}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListProductGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate(
                      'salesOrderByEmployeeAndItemsReports.productGrouping',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.productGroupingId}
                      filterType={nameof(filter.productGroupingId.equal)}
                      value={filter.productGroupingId.equal}
                      onChange={handleIndepentFilter(
                        nameof(filter.productGroupingId),
                        nameof(filter.itemId),
                        itemFilter,
                        setItemFilter,
                        () => {
                          setResetItem(true);
                        },
                      )}
                      getList={
                        salesOrderByStoreAndItemsRepository.filterListProductGrouping
                      }
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListItem') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate(
                      'directSalesOrderByEmployeeAndItemsReports.item',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdMultiFilter
                      filter={filter.itemId}
                      filterType={nameof(filter.itemId.in)}
                      onChange={handleChange}
                      getList={
                        salesOrderByStoreAndItemsRepository.filterListItem
                      }
                      modelFilter={itemFilter}
                      setModelFilter={setItemFilter}
                      searchField={nameof(itemFilter.name)}
                      value={filter.itemId.in}
                      list={defaultListItem}
                      placeholder={translate('general.placeholder.title')}
                      isReset={resetItem}
                      setIsReset={setResetItem}
                      dependentField={nameof(filter.productGroupingId)}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('salesOrderByStoreAndItemsReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.orderDate))}
                    placeholder={[
                      translate(
                        'salesOrderByStoreAndItemsReports.placeholder.startDate',
                      ),
                      translate(
                        'salesOrderByStoreAndItemsReports.placeholder.endDate',
                      ),
                    ]}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate(
                      'salesOrderByStoreAndItemsReports.storeStatus',
                    )}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        salesOrderByStoreAndItemsRepository.filterListStoreStatus
                      }
                      modelFilter={storeStatusFilter}
                      setModelFilter={setStoreStatusFilter}
                      searchField={nameof(storeStatusFilter.name)}
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
                  onClick={hanleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.statistical)}
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
        {/* {typeof filter.kpiPeriodId.equal !== 'undefined' &&
          typeof filter.kpiYearId.equal !== 'undefined' && ( */}
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
            style={{
              height: INF_CONTAINER_HEIGHT,
              overflow: 'auto',
              marginBottom: '0px',
            }}
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
                    key={nameof(dataList[0].key)}
                    rowKey={nameof(dataList[0].key)}
                    dataSource={dataList}
                    columns={columns}
                    loading={loading}
                    bordered={true}
                    pagination={false}
                    className="table-merge"
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
        {/* )} */}
      </Card>
    </div>
  );
}

const transformMethod = (itemm: SalesOrderByStoreAndItemsReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */

  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new SalesOrderByStoreAndItemsReportDataTable(),
    title: itemm.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  let storeId: number;
  let storeCode: string;
  let storeCodeDraft: string;
  let storeName: string;
  let storeStatusName: string;
  itemm.stores?.forEach((store: Store) => {
    const { id, code, name, address, storeStatus, codeDraft } = store;
    storeId = id;
    storeCode = code;
    storeName = name;
    storeCodeDraft = codeDraft;
    storeStatusName = storeStatus.name;
    let itemId: number;
    let itemCode: string;
    let itemName: string;
    store.items?.forEach((item: Items, index: number) => {
      let rowSpan = 0;
      if (index === 0) {
        rowSpan = store.items ? store.items.length : 0;
      }
      const {
        id,
        code,
        name,
        unitOfMeasureName,
        saleStock,
        promotionStock,
        salePriceAverage,
        discount,
        revenue,
        salesOrderCounter,
      } = item;
      itemId = id;
      itemCode = code;
      itemName = name;
      datalist.push({
        ...new SalesOrderByStoreAndItemsReportDataTable(),
        key: uuidv4(),
        storeId,
        storeCode,
        storeCodeDraft,
        storeName,
        address,
        storeStatusName,
        itemId,
        itemCode,
        itemName,
        unitOfMeasureName,
        saleStock,
        promotionStock,
        salePriceAverage,
        discount,
        revenue,
        salesOrderCounter,
        rowSpan,
      });
    });
  });
  return datalist;
};

const renderCell = (
  value: any,
  record: SalesOrderByStoreAndItemsReportDataTable,
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
      children: <div className="table-title-row table-row">{value}</div>,
      props: {
        rowSpan: 1,
        colSpan,
      },
    };
  }
  // base on type of value, we align text right, left or center
  if (rowIndex === 0) {
    let alignText = 'text-left';
    // if typeof value === number, format it
    if (typeof value === 'number') {
      alignText = 'text-right';
      value = formatNumber(value);
    }
    return {
      children: <span className={`${alignText} table-row`}>{value}</span>,
      props: {
        rowSpan: 1,
        colSpan: firstColNumber,
      },
    };
  }
  let alignText = 'text-left';
  // if typeof value === number, format it
  if (typeof value === 'number') {
    alignText = 'text-right';
    value = formatNumber(value);
  }
  if (colIndex === 0) {
    alignText = 'text-center';
  }
  return {
    children: <span className={`${alignText} table-row`}>{value}</span>,
    props: {
      rowSpan: rowNumber ? rowNumber : 0,
      colSpan: 1,
    },
  };
};
export default SalesOrderByStoreAndItemsReportView;
