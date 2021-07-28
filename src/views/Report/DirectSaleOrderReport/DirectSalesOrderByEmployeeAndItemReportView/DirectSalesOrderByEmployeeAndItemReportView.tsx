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
import { API_DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { formatNumber } from 'core/helpers/number';
import { crudService } from 'core/services';
import { AppUserFilter } from 'models/AppUserFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { Items } from 'models/report/Items';
import { SaleEmployee } from 'models/report/SaleEmployee';
import { SalesOrderByEmployeeAndItemReport } from 'models/report/SalesorderByEmployeeAndItemReport';
import { SalesOrderByEmployeeAndItemReportDataTable } from 'models/report/SalesOrderByEmployeeAndItemReportDataTable';
import { SalesOrderByEmployeeAndItemReportFilter } from 'models/report/SalesorderByEmployeeAndItemReportFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { reportService } from 'views/Report/ReportService';
import '../../Report.scss';
import { directSalesOrderByEmployeeAndItemReportRepository } from './DirectSalesOrderByEmployeeAndItemReportRepository';
const { Item: FormItem } = Form;

function DirectSalesOrderByEmployeeAndItemReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'direct-sales-order-by-employee-and-items-report',
    API_DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
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
    ,
    ,
    handleReset,
    ,
    ,
    dateFilter,
    setDateFilter,
  ] = reportService.useReportMaster<
    SalesOrderByEmployeeAndItemReport,
    SalesOrderByEmployeeAndItemReportFilter
  >(
    SalesOrderByEmployeeAndItemReportFilter,
    directSalesOrderByEmployeeAndItemReportRepository.list,
    directSalesOrderByEmployeeAndItemReportRepository.count,
    'orderDate',
  );

  const [
    hasMore,
    ,
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
    directSalesOrderByEmployeeAndItemReportRepository.list,
    total,
    setLoadList,
    loading,
  );

  const [totalCount] = reportService.getTitleNumber<
    SalesOrderByEmployeeAndItemReportDataTable,
    SalesOrderByEmployeeAndItemReportFilter
  >(
    filter,
    directSalesOrderByEmployeeAndItemReportRepository.total,
    isCount,
    setIsCount,
  );

  const [dataSource] = reportService.useMasterDataSource<
    SalesOrderByEmployeeAndItemReport,
    SalesOrderByEmployeeAndItemReportDataTable
  >(list, transformMethod);

  const [dataList] = reportService.addTotalCount<
    SalesOrderByEmployeeAndItemReportDataTable
  >(dataSource, totalCount);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());
  const [resetAppUser, setResetAppUser] = React.useState<boolean>(false);

  const [itemFilter, setItemFilter] = React.useState<ItemFilter>(
    new ItemFilter(),
  );
  const [resetItem, setResetItem] = React.useState<boolean>(false);

  const [defaultListItem, setDefaultListItem] = React.useState<Item[]>([]);
  const [loadItem, setLoadItem] = React.useState<boolean>(true);
  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    directSalesOrderByEmployeeAndItemReportRepository.export,
    filter,
  );

  React.useEffect(() => {
    if (loadItem) {
      directSalesOrderByEmployeeAndItemReportRepository
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
    handleExport,
    dates,
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

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetAppUser(true);
  }, [handleResetScroll, handleReset]);

  const handleChange = React.useCallback(
    event => {
      filter.itemId.in = event?.in;
      setFilter({ ...filter });
      handleSearch();
    },
    [setFilter, filter, handleSearch],
  );

  const columns: ColumnProps<
    SalesOrderByEmployeeAndItemReportDataTable
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
          return renderCell(value, record, 0, 13, rowIndex, 6, record.rowSpan);
        },
      },

      {
        title: translate('directSalesOrderByEmployeeAndItemsReports.username'),
        key: nameof(dataList[0].username),
        dataIndex: nameof(dataList[0].username),
        width: 150,
        ellipsis: true,
        align: 'left',
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
      },
      {
        title: translate(
          'directSalesOrderByEmployeeAndItemsReports.displayName',
        ),
        key: nameof(dataList[0].displayName),
        dataIndex: nameof(dataList[0].displayName),
        ellipsis: true,
        width: 150,
        align: 'left',
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
      },
      {
        title: translate('directSalesOrderByEmployeeAndItemsReports.item'),
        children: [
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.itemCode',
            ),
            key: nameof(dataList[0].code),
            dataIndex: nameof(dataList[0].code),
            ellipsis: true,
            width: 150,
            align: 'left',
            render(...[code, record, rowIndex]) {
              return renderCell(code, record, 4, 0, rowIndex, 0, 1);
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.itemName',
            ),
            key: nameof(dataList[0].name),
            dataIndex: nameof(dataList[0].name),
            ellipsis: true,
            width: 150,
            align: 'left',
            render(...[name, record, rowIndex]) {
              return renderCell(name, record, 5, 0, rowIndex, 0, 1);
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.unitOfMeasureName',
            ),
            key: nameof(dataList[0].unitOfMeasureName),
            dataIndex: nameof(dataList[0].unitOfMeasureName),
            ellipsis: true,
            width: 150,
            align: 'left',
            render(...[unitOfMeasureName, record, rowIndex]) {
              return renderCell(
                unitOfMeasureName,
                record,
                6,
                0,
                rowIndex,
                0,
                1,
              );
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.saleStock',
            ),
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
              return renderCell(value, record, 7, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.promotionStock',
            ),
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
              return renderCell(value, record, 8, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.salePriceAverage',
            ),
            key: nameof(dataList[0].salePriceAverage),
            dataIndex: nameof(dataList[0].salePriceAverage),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[salePriceAverage, record, rowIndex]) {
              return renderCell(salePriceAverage, record, 9, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.discount',
            ),
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
              return renderCell(value, record, 10, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.revenue',
            ),
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
              return renderCell(value, record, 11, 0, rowIndex, 1, 1);
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.indirectSalesOrderCounter',
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
                12,
                0,
                rowIndex,
                1,
                1,
              );
            },
          },
          {
            title: translate(
              'directSalesOrderByEmployeeAndItemsReports.buyerStoreCounter',
            ),
            key: nameof(dataList[0].buyerStoreCounter),
            dataIndex: nameof(dataList[0].buyerStoreCounter),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[buyerStoreCounter, record, rowIndex]) {
              return renderCell(
                buyerStoreCounter,
                record,
                12,
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
        title={translate(
          'directSalesOrderByEmployeeAndItemsReports.master.title',
        )}
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
                      'directSalesOrderByEmployeeAndItemsReports.organization',
                    )}
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
                        () => {
                          setResetAppUser(true);
                        },
                      )}
                      getList={
                        directSalesOrderByEmployeeAndItemReportRepository.filterListOrganization
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
                    label={translate(
                      'directSalesOrderByEmployeeAndItemsReports.appUser',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={
                        directSalesOrderByEmployeeAndItemReportRepository.filterListAppUser
                      }
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={resetAppUser}
                      setIsReset={setResetAppUser}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}

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
                        directSalesOrderByEmployeeAndItemReportRepository.filterListProductGrouping
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
                        directSalesOrderByEmployeeAndItemReportRepository.filterListItem
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
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate(
                    'directSalesOrderByEmployeeAndItemsReports.time',
                  )}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.orderDate))}
                    placeholder={[
                      translate(
                        'directSalesOrderByEmployeeAndItemsReports.placeholder.startDate',
                      ),
                      translate(
                        'directSalesOrderByEmployeeAndItemsReports.placeholder.endDate',
                      ),
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
const transformMethod = (itemm: SalesOrderByEmployeeAndItemReport) => {
  const datalist = [];
  datalist[0] = {
    ...new SalesOrderByEmployeeAndItemReportDataTable(),
    title: itemm.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  itemm.saleEmployees?.forEach((employee: SaleEmployee) => {
    const { username, displayName } = employee;
    employee.items?.forEach((item: Items, index: number) => {
      let rowSpan = 0;
      if (index === 0) {
        rowSpan = employee.items ? employee.items.length : 0;
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
        buyerStoreCounter,
      } = item;
      datalist.push({
        ...new SalesOrderByEmployeeAndItemReportDataTable(),
        key: uuidv4(),
        username,
        displayName,
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
        buyerStoreCounter,
        rowSpan,
      });
    });
  });
  return datalist;
};
const renderCell = (
  value: any,
  record: SalesOrderByEmployeeAndItemReportDataTable,
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
export default DirectSalesOrderByEmployeeAndItemReportView;
