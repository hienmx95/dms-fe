import { Col, Modal, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_SALES_ORDER_BY_ITEM_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { DEFAULT_TAKE, INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { formatDate } from 'core/helpers/date-time';
import { formatNumber } from 'core/helpers/number';
import { crudService } from 'core/services';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ItemsFilter } from 'models/report/ItemsFilter';
import { ProductGroupingFilter } from 'models/report/ProductGroupingFilter';
import { ProductTypeFilter } from 'models/report/ProductTypeFilter';
import { SalesOrderByItemsReport } from 'models/report/SalesOrderByItemsReport';
import { SalesOrderByItemsReportDataTable } from 'models/report/SalesOrderByItemsReportDataTable';
import { SalesOrderByItemsReportFilter } from 'models/report/SalesOrderByItemsReportFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Report.scss';
import { reportService } from '../ReportService';
import { salesOrderByItemsRepository } from './SalesOrderByItemsRepository';

const { Item: FormItem } = Form;

function SalesOrderByItemsReportReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'indirect-sales-order-by-items-report',
    API_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
  );
  const [
    filter,
    setFilter,
    list,
    setList,
    setLoadlist,
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
    SalesOrderByItemsReport,
    SalesOrderByItemsReportFilter
  >(
    SalesOrderByItemsReportFilter,
    salesOrderByItemsRepository.list,
    salesOrderByItemsRepository.count,
    'date',
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
    ,
    handleResetScroll,
  ] = crudService.useTableScroll(
    list,
    setList,
    filter,
    setFilter,
    setLoading,
    salesOrderByItemsRepository.list,
    total,
    setLoadlist,
  );

  const [totalCount] = reportService.getTitleNumber<
    SalesOrderByItemsReportDataTable,
    SalesOrderByItemsReportFilter
  >(filter, salesOrderByItemsRepository.total, isCount, setIsCount);

  const [dataSource] = reportService.useMasterDataSource<
    SalesOrderByItemsReport,
    SalesOrderByItemsReportDataTable
  >(list, transformMethod);

  const [dataList] = reportService.addTotalCount<
    SalesOrderByItemsReportDataTable
  >(dataSource, totalCount);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  /* dependent filter  */
  const [itemsFilter, setItemsFilter] = React.useState<ItemsFilter>({
    ...new ItemsFilter(),
    productGroupingId: filter.productGroupingId,
    productTypeId: filter.productTypeId,
  });
  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());
  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());
  // const [dateFilter, setDateFilter] = React.useState<DateFilter>(new DateFilter());

  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    salesOrderByItemsRepository.export,
    filter,
  );

  React.useEffect(() => {
    if (filter.date.lessEqual && dates) {
      setDateFilter({ ...filter.date });
      const days = filter.date.lessEqual.diff(filter.date.greaterEqual, 'days');
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
  }, [filter, setDateFilter, translate, handleExport, dates]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'date') {
          filter.date.lessEqual = f.lessEqual;
          filter.date.greaterEqual = undefined;
          filter.date.greaterEqual = f.greaterEqual;
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

  const handleControlFilter = React.useCallback(
    (field: string) => {
      return f => {
        setFilter({ ...filter, [field]: f, skip: 0, take: DEFAULT_TAKE });
        setItemsFilter({ ...itemsFilter, [field]: f });
        setHasMore(true);
        setLoadlist(true);
      };
    },
    [filter, itemsFilter, setFilter, setHasMore, setLoadlist],
  );

  const columns: ColumnProps<
    SalesOrderByItemsReportDataTable
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
          return renderCell(value, record, 0, 10, rowIndex, 4, record.rowSpan);
        },
      },
      {
        title: translate('salesOrderByItems.itemCode'),
        key: nameof(dataList[0].itemCode),
        dataIndex: nameof(dataList[0].itemCode),
        ellipsis: true,
        align: 'left',
        render(...[itemCode, record, rowIndex]) {
          return renderCell(
            itemCode,
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
        title: translate('salesOrderByItems.itemName'),
        key: nameof(dataList[0].itemName),
        dataIndex: nameof(dataList[0].itemName),
        width: 250,
        ellipsis: true,
        align: 'left',
        render(...[itemName, record, rowIndex]) {
          return renderCell(
            itemName,
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
        title: translate('salesOrderByItems.unitOfMeasureName'),
        key: nameof(dataList[0].unitOfMeasureName),
        dataIndex: nameof(dataList[0].unitOfMeasureName),
        ellipsis: true,
        align: 'left',
        render(...[unitOfMeasureName, record, rowIndex]) {
          return renderCell(
            unitOfMeasureName,
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
        title: translate('salesOrderByItems.saleStock'),
        key: nameof(dataList[0].saleStock),
        dataIndex: nameof(dataList[0].saleStock),
        ellipsis: true,
        align: 'right',
        render(...[saleStock, record, rowIndex]) {
          let value = saleStock;
          if (rowIndex === 0) {
            value = record.totalSalesStock;
          }
          return renderCell(value, record, 4, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('salesOrderByItems.promotionStock'),
        key: nameof(dataList[0].promotionStock),
        dataIndex: nameof(dataList[0].promotionStock),
        ellipsis: true,
        align: 'right',
        render(...[promotionStock, record, rowIndex]) {
          let value = promotionStock;
          if (rowIndex === 0) {
            value = record.totalPromotionStock;
          }
          return renderCell(value, record, 5, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('salesOrderByItems.discount'),
        key: nameof(dataList[0].discount),
        dataIndex: nameof(dataList[0].discount),
        ellipsis: true,
        align: 'right',
        render(...[discount, record, rowIndex]) {
          let value = discount;
          if (rowIndex === 0) {
            value = record.totalDiscount;
          }
          return renderCell(value, record, 6, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('salesOrderByItems.revenue'),
        key: nameof(dataList[0].revenue),
        dataIndex: nameof(dataList[0].revenue),
        ellipsis: true,
        align: 'right',
        render(...[revenue, record, rowIndex]) {
          let value = revenue;
          if (rowIndex === 0) {
            value = record.totalRevenue;
          }
          return renderCell(value, record, 7, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('salesOrderByItems.indirecSalesOrderCounter'),
        key: nameof(dataList[0].salesOrderCounter),
        dataIndex: nameof(dataList[0].salesOrderCounter),
        ellipsis: true,
        align: 'right',
        render(...[salesOrderCounter, record, rowIndex]) {
          return renderCell(
            salesOrderCounter,
            record,
            8,
            0,
            rowIndex,
            1,
            record.rowSpan,
          );
        },
      },
      {
        title: translate('salesOrderByItems.buyerStoreCounter'),
        key: nameof(dataList[0].buyerStoreCounter),
        dataIndex: nameof(dataList[0].buyerStoreCounter),
        ellipsis: true,
        align: 'right',
        render(...[buyerStoreCounter, record, rowIndex]) {
          return renderCell(
            buyerStoreCounter,
            record,
            9,
            0,
            rowIndex,
            1,
            record.rowSpan,
          );
        },
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
        title={translate('salesOrderByItems.master.title')}
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
                    label={translate('salesOrderByItems.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.organizationId),
                      )}
                      getList={
                        salesOrderByItemsRepository.filterListOrganization
                      }
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListProductGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('salesOrderByItems.productGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.productGroupingId}
                      filterType={nameof(filter.productGroupingId.equal)}
                      value={filter.productGroupingId.equal}
                      onChange={handleControlFilter(
                        nameof(filter.productGroupingId),
                      )}
                      getList={
                        salesOrderByItemsRepository.filterListProductGrouping
                      }
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListProductType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('salesOrderByItems.productType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.productTypeId}
                      filterType={nameof(filter.productTypeId.equal)}
                      value={filter.productTypeId.equal}
                      onChange={handleControlFilter(
                        nameof(filter.productTypeId),
                      )}
                      getList={
                        salesOrderByItemsRepository.filterListProductType
                      }
                      modelFilter={productTypeFilter}
                      setModelFilter={setProductTypeFilter}
                      searchField={nameof(productTypeFilter.name)}
                      searchType={nameof(productTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListItem') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('salesOrderByItems.item')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.itemId}
                      filterType={nameof(filter.itemId.equal)}
                      value={filter.itemId.equal}
                      onChange={handleFilterScroll(nameof(filter.itemId))}
                      getList={salesOrderByItemsRepository.filterListItem}
                      modelFilter={itemsFilter}
                      setModelFilter={setItemsFilter}
                      searchField={nameof(itemsFilter.name)}
                      searchType={nameof(itemsFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('salesOrderByItems.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.date))}
                    placeholder={[
                      translate('salesOrderByItems.placeholder.startDate'),
                      translate('salesOrderByItems.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
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
                  onClick={() => handleResetScroll(handleReset)}
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
const transformMethod = (itemm: SalesOrderByItemsReport) => {
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new SalesOrderByItemsReportDataTable(),
    title: itemm.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  itemm.itemDetails?.forEach(
    (itemDetails: SalesOrderByItemsReportDataTable) => {
      const {
        organizationName,
        itemCode,
        itemName,
        unitOfMeasureName,
        buyerStoreCounter,
        discount,
        promotionStock,
        revenue,
        salesOrderCounter,
        saleStock,
      } = itemDetails;
      datalist.push({
        ...new SalesOrderByItemsReportDataTable(),
        key: uuidv4(),
        organizationName,
        itemCode,
        itemName,
        unitOfMeasureName,
        buyerStoreCounter,
        discount,
        promotionStock,
        revenue,
        salesOrderCounter,
        saleStock,
      });
    },
  );
  return datalist;
};
const renderCell = (
  value: any,
  record: SalesOrderByItemsReportDataTable,
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

  if (typeof value === 'object') {
    alignText = 'text-center';
    value = formatDate(value);
  }
  if (colIndex === 0) {
    alignText = 'text-center';
  }
  return {
    children: <span className={`${alignText} table-row`}>{value}</span>,
    props: {
      rowSpan: rowNumber ? rowNumber : 1,
      colSpan: 1,
    },
  };
};
export default SalesOrderByItemsReportReportView;
