import { Col, Modal, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_SALES_ORDER_GENERAL_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { formatDate } from 'core/helpers/date-time';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { AppUserFilter } from 'models/AppUserFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { SalesOrderGeneralReport } from 'models/report/SalesOrderGeneral';
import { SalesOrderGeneralReportFilter } from 'models/report/SalesOrderGeneralFilter';
import { SalesOrderGeneralReportDataTable } from 'models/report/SalesOrderGeneralReportDataTable';
import { StoreFilter } from 'models/report/StoreFilter';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Report.scss';
import { reportService } from '../ReportService';
import { salesOrderGeneralReportRepository } from './SalesOrderGeneralReportRepository';
const { Item: FormItem } = Form;
function SalesOrderGeneralReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'indirect-sales-order-general-report',
    API_SALES_ORDER_GENERAL_ROUTE,
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
    SalesOrderGeneralReport,
    SalesOrderGeneralReportFilter
  >(
    SalesOrderGeneralReportFilter,
    salesOrderGeneralReportRepository.list,
    salesOrderGeneralReportRepository.count,
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
    ,
    handleResetScroll,
  ] = crudService.useTableScroll(
    list,
    setList,
    filter,
    setFilter,
    setLoading,
    salesOrderGeneralReportRepository.list,
    total,
    setLoadList,
    loading,
  );

  const [totalCount] = reportService.getTitleNumber<
    SalesOrderGeneralReportDataTable,
    SalesOrderGeneralReportFilter
  >(filter, salesOrderGeneralReportRepository.total, isCount, setIsCount);

  const [dataSource] = reportService.useMasterDataSource<
    SalesOrderGeneralReport,
    SalesOrderGeneralReportDataTable
  >(list, transformMethod);

  const [dataList] = reportService.addTotalCount<
    SalesOrderGeneralReportDataTable
  >(dataSource, totalCount);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [buyerStoreFilter, setBuyerStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StoreStatusFilter
  >(new StoreStatusFilter());

  const [resetAppUser, setResetAppUser] = React.useState<boolean>(false);
  const [resetbuyerStore, setResetBuyerStore] = React.useState<boolean>(false);
  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    salesOrderGeneralReportRepository.export,
    filter,
  );

  React.useEffect(() => {
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
  }, [filter, setDateFilter, translate, handleExport, dates]);

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

  const handleChangeFilterOrganization = React.useCallback(
    event => {
      const organizationId = event.equal;
      if (
        appUserFilter.organizationId.equal !== organizationId ||
        buyerStoreFilter.organizationId.equal !== organizationId
      ) {
        filter.organizationId.equal = organizationId;
        filter.appUserId.equal = undefined;
        filter.buyerStoreId.equal = undefined;
        setFilter({ ...filter });
        setResetAppUser(true);
        setResetBuyerStore(true);
        handleSearch();
      }
      appUserFilter.organizationId.equal = organizationId;
      buyerStoreFilter.organizationId.equal = organizationId;
    },
    [
      appUserFilter.organizationId.equal,
      filter,
      handleSearch,
      setFilter,
      buyerStoreFilter.organizationId.equal,
    ],
  );

  const columns: ColumnProps<
    SalesOrderGeneralReportDataTable
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index + 10,
        render(...[, record, rowIndex]) {
          let value: any;
          if (rowIndex !== 0) {
            value = record.title ? record.title : record.indexInTable;
          } else {
            value = translate('general.total');
          }
          return renderCell(value, record, 0, 9, rowIndex, 6, record.rowSpan);
        },
      },
      {
        title: translate('salesOrderGenerals.code'),
        key: nameof(dataList[0].code),
        dataIndex: nameof(dataList[0].code),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[code, record, rowIndex]) {
          return renderCell(code, record, 1, 0, rowIndex, 0, 1);
        },
      },
      {
        title: translate('salesOrderGenerals.buyerStoreName'),
        key: nameof(dataList[0].buyerStoreName),
        dataIndex: nameof(dataList[0].buyerStoreName),
        width: 150,
        ellipsis: true,
        align: 'left',
        render(...[buyerStoreName, record, rowIndex]) {
          return renderCell(
            buyerStoreName,
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
        title: translate('salesOrderGenerals.buyerStoreStatusName'),
        key: nameof(dataList[0].buyerStoreStatusName),
        dataIndex: nameof(dataList[0].buyerStoreStatusName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[buyerStoreStatusName, record, rowIndex]) {
          return renderCell(
            buyerStoreStatusName,
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
        title: translate('salesOrderGenerals.saleEmployeeName'),
        key: nameof(dataList[0].saleEmployeeName),
        dataIndex: nameof(dataList[0].saleEmployeeName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[saleEmployeeName, record, rowIndex]) {
          return renderCell(
            saleEmployeeName,
            record,
            4,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
      },

      {
        title: translate('salesOrderGenerals.orderDate'),
        key: nameof(dataList[0].orderDate),
        dataIndex: nameof(dataList[0].orderDate),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[orderDate, record, rowIndex]) {
          return renderCell(orderDate, record, 5, 0, rowIndex, 0, 1);
        },
      },
      {
        title: translate('salesOrderGenerals.subTotal'),
        key: nameof(dataList[0].subTotal),
        dataIndex: nameof(dataList[0].subTotal),
        ellipsis: true,
        width: 150,
        align: 'right',
        render(...[subTotal, record, rowIndex]) {
          let value = subTotal;
          if (rowIndex === 0) {
            value = record.subTotal;
          }
          return renderCell(value, record, 6, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('salesOrderGenerals.discount'),
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
          return renderCell(value, record, 7, 0, rowIndex, 1, 1);
        },
      },
      // {
      //   title: translate('salesOrderGenerals.taxValue'),
      //   key: nameof(dataList[0].taxValue),
      //   dataIndex: nameof(dataList[0].taxValue),
      //   ellipsis: true,
      //   width: 150,
      //   align: 'right',
      //   render(...[taxValue, record, rowIndex]) {
      //     let value = taxValue;
      //     if (rowIndex === 0) {
      //       value = record.totalTax;
      //     }
      //     return renderCell(value, record, 8, 0, rowIndex, 1, 1);
      //   },
      // },
      {
        title: translate('salesOrderGenerals.revenue'),
        key: nameof(dataList[0].total),
        dataIndex: nameof(dataList[0].total),
        ellipsis: true,
        width: 150,
        align: 'right',
        render(...[total, record, rowIndex]) {
          let value = total;
          if (rowIndex === 0) {
            value = record.totalRevenue;
          }
          return renderCell(value, record, 9, 0, rowIndex, 1, 1);
        },
      },
    ];
  }, [dataList, translate]);

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetAppUser(true);
  }, [handleResetScroll, handleReset]);

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
        title={translate('salesOrderGenerals.master.title')}
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
                    label={translate('salesOrderGenerals.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleChangeFilterOrganization}
                      getList={
                        salesOrderGeneralReportRepository.filterListOrganization
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
                    label={translate('salesOrderGenerals.saleEmployee')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={
                        salesOrderGeneralReportRepository.filterListAppUser
                      }
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={resetAppUser}
                      setIsReset={setResetAppUser}
                      placeholder={translate(
                        'salesOrderGenerals.placeholder.saleEmployee',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('salesOrderGenerals.buyerStoreName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.buyerStoreId}
                      filterType={nameof(filter.buyerStoreId.equal)}
                      value={filter.buyerStoreId.equal}
                      onChange={handleFilterScroll(nameof(filter.buyerStoreId))}
                      getList={
                        salesOrderGeneralReportRepository.filterListStore
                      }
                      modelFilter={buyerStoreFilter}
                      setModelFilter={setBuyerStoreFilter}
                      searchField={nameof(buyerStoreFilter.name)}
                      searchType={nameof(buyerStoreFilter.name.contain)}
                      isReset={resetbuyerStore}
                      setIsReset={setResetBuyerStore}
                      placeholder={translate(
                        'salesOrderGenerals.placeholder.buyerStore',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('salesOrderGenerals.buyerStoreStatusName')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        salesOrderGeneralReportRepository.filterListStoreStatus
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
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('salesOrderGenerals.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.orderDate))}
                    placeholder={[
                      translate('salesOrderGenerals.placeholder.startDate'),
                      translate('salesOrderGenerals.placeholder.endDate'),
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

const transformMethod = (itemm: SalesOrderGeneralReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */

  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new SalesOrderGeneralReportDataTable(),
    title: itemm.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  itemm.salesOrders?.forEach(
    (salesOrders: SalesOrderGeneralReportDataTable) => {
      const {
        organizationName,
        code,
        discount,
        buyerStoreName,
        saleEmployeeName,
        sellerStoreName,
        taxValue,
        orderDate,
        total,
        subTotal,
        buyerStoreStatusName,
      } = salesOrders;
      datalist.push({
        ...new SalesOrderGeneralReportDataTable(),
        key: uuidv4(),
        organizationName,
        code,
        discount,
        buyerStoreName,
        saleEmployeeName,
        sellerStoreName,
        taxValue,
        orderDate,
        total,
        subTotal,
        buyerStoreStatusName,
      });
    },
  );
  return datalist;
};

const renderCell = (
  value: any,
  record: SalesOrderGeneralReportDataTable,
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
export default SalesOrderGeneralReportView;
