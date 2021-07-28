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
import { API_POSM_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { flattenData } from 'core/helpers/array';
import { formatNumber } from 'core/helpers/number';
import { crudService } from 'core/services';
import { groupRowByField } from 'helpers/ant-design/table';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { POSMReport } from 'models/report/POSMReport';
import { POSMReportDataTable } from 'models/report/POSMReportDataTable';
import { POSMReportFilter } from 'models/report/POSMReportFilter';
import { StoreFilter } from 'models/report/StoreFilter';
import { StoreGroupingFilter } from 'models/report/StoreGroupingFilter';
import { StoreTypeFilter } from 'models/report/StoreTypeFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Report.scss';
import { reportService } from '../ReportService';
import { posmReportRepository } from './POSMReportRepository';

const { Item: FormItem } = Form;
function POSMReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'posm-report',
    API_POSM_REPORT_ROUTE,
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
  ] = reportService.useReportMaster<POSMReport, POSMReportFilter>(
    POSMReportFilter,
    posmReportRepository.list,
    posmReportRepository.count,
    'date',
  );

  const [dataSource] = reportService.useMasterDataSource<
    POSMReport,
    POSMReportDataTable
  >(list, transformMethod);

  // const formatWeekDays = React.useCallback((date: Moment) => {
  //   const days = [
  //     'Chủ nhật',
  //     'Thứ 2',
  //     'Thứ 3',
  //     'Thứ 4',
  //     'Thứ 5',
  //     'Thứ 6',
  //     'Thứ 7',
  //   ];
  //   let d = moment(date).toDate();
  //   d = new Date(d);
  //   return days[d?.getDay()];
  // }, []);

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
    posmReportRepository.list,
    total,
    setLoadList,
    loading,
  );

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

  const [showingItemFilter, setShowingItemFilter] = React.useState<
    ShowingItemFilter
  >(new ShowingItemFilter());

  const [resetStore, setResetStore] = React.useState<boolean>(false);

  const [defaultListItem, setDefaultListItem] = React.useState<ShowingItem[]>(
    [],
  );

  const [loadItem, setLoadItem] = React.useState<boolean>(true);

  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    posmReportRepository.export,
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
    if (loadItem) {
      posmReportRepository
        .filterListShowingItem(showingItemFilter)
        .then(res => {
          setDefaultListItem(res);
          setLoadItem(false);
        })
        .catch((error: AxiosError) => {
          notification.error(error);
        });
    }
  }, [
    filter,
    setDateFilter,
    translate,
    handleExport,
    dates,
    loadItem,
    showingItemFilter,
  ]);

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

  const handleFilterOrganization = React.useCallback(
    event => {
      const organizationId = event.equal;
      if (storeFilter?.organizationId?.equal !== organizationId) {
        filter.organizationId.equal = organizationId;
        filter.storeId.equal = undefined;
        setResetStore(true);
        setFilter({ ...filter });
        handleSearch();
      }
      storeFilter.organizationId.equal = organizationId;
      setStoreFilter({ ...storeFilter });
    },
    [filter, handleSearch, setFilter, storeFilter],
  );

  // const handleFormatBoolean = React.useCallback(value => {
  //   if (value) {
  //     return 'x';
  //   }
  // }, []);
  // const handleFormatTime = React.useCallback(value => {
  //   const time = formatDateTime(value);
  //   return time.substr(11, 5);
  // }, []);

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetStore(true);
  }, [handleReset, handleResetScroll]);

  // const disabledDate = React.useCallback(
  //   (current) => {
  //     if (dates[0]) {
  //       if (!dateFilter?.greaterEqual) {
  //         return false;
  //       }
  //       const endOfMonth = dates[0].clone().endOf('month');
  //       const startOfMonth = dates[0].clone().startOf('month');
  //       const currentDate = current.clone();
  //       return currentDate.valueOf() < startOfMonth || currentDate.valueOf() > endOfMonth;
  //     }
  //     return false;
  //   }, [dateFilter, dates]);

  const columns: ColumnProps<POSMReportDataTable>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index + 10,
        render(...[, record, rowIndex]) {
          const value = record.title ? record.title : record.indexInTable;
          return renderCell(value, record, 0, 13, rowIndex, 0, record.rowSpan);
        },
      },

      {
        title: translate('posmReports.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].code),
        width: 150,
        align: 'left',
        ellipsis: true,
        render(...[code, record, rowIndex]) {
          return renderCell(code, record, 1, 0, rowIndex, 0, record.rowSpan);
        },
      },
      {
        title: translate('posmReports.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        ellipsis: true,
        align: 'left',
        width: 250,
        render(...[name, record, rowIndex]) {
          return renderCell(name, record, 2, 0, rowIndex, 0, record.rowSpan);
        },
      },

      // {
      //   title: translate('posmReports.days'),
      //   key: nameof(uuidv4),
      //   dataIndex: nameof(dataSource[0].date),
      //   ellipsis: true,
      //   align: 'left',
      //   width: 100,
      //   render(...[date, record, rowIndex]) {
      //     if (record.title) {
      //       return renderCell(date, record, 3, 0, rowIndex, 0, 1);
      //     }
      //     return formatDate(date);
      //   },
      // },
      {
        title: translate('posmReports.address'),
        key: nameof(dataSource[0].address),
        dataIndex: nameof(dataSource[0].address),
        ellipsis: true,
        width: 250,
        align: 'left',
        render(...[address, record, rowIndex]) {
          return renderCell(address, record, 3, 0, rowIndex, 0, record.rowSpan);
        },
      },
      {
        title: translate('posmReports.total'),
        key: nameof(dataSource[0].total),
        dataIndex: nameof(dataSource[0].total),
        ellipsis: true,
        width: 250,
        align: 'left',
        render(...[total, record, rowIndex]) {
          return renderCell(total, record, 4, 0, rowIndex, 0, record.rowSpan);
        },
      },

      {
        title: translate('posmReports.showingItem'),
        children: [
          {
            title: translate('posmReports.showingItemCode'),
            key: nameof(dataSource[0].showingItemCode),
            dataIndex: nameof(dataSource[0].showingItemCode),
            ellipsis: true,
            align: 'left',
            width: 150,
            render(...[showingItemCode, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  showingItemCode,
                  record,
                  5,
                  0,
                  rowIndex,
                  0,
                  1,
                );
              }
              return showingItemCode;
            },
          },
          {
            title: translate('posmReports.showingItemName'),
            key: nameof(dataSource[0].showingItemName),
            dataIndex: nameof(dataSource[0].showingItemName),
            ellipsis: true,
            align: 'left',
            width: 150,
            render(...[showingItemName, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  showingItemName,
                  record,
                  6,
                  0,
                  rowIndex,
                  0,
                  1,
                );
              }
              return showingItemName;
            },
          },
          {
            title: translate('posmReports.unitOfMeasure'),
            key: nameof(dataSource[0].unitOfMeasure),
            dataIndex: nameof(dataSource[0].unitOfMeasure),
            ellipsis: true,
            align: 'left',
            width: 150,
            render(...[unitOfMeasure, record, rowIndex]) {
              if (record.title) {
                return renderCell(unitOfMeasure, record, 7, 0, rowIndex, 0, 1);
              }
              return unitOfMeasure;
            },
          },
          {
            title: translate('posmReports.salePrice'),
            key: nameof(dataSource[0].salePrice),
            dataIndex: nameof(dataSource[0].salePrice),
            ellipsis: true,
            align: 'left',
            width: 250,
            render(...[salePrice, record, rowIndex]) {
              if (record.title) {
                return renderCell(salePrice, record, 8, 0, rowIndex, 0, 1);
              }
              return formatNumber(salePrice);
            },
          },
          {
            title: translate('posmReports.POSMquantity'),
            key: nameof(dataSource[0].quantity),
            dataIndex: nameof(dataSource[0].quantity),
            ellipsis: true,
            align: 'right',
            width: 150,
            render(...[quantity, record, rowIndex]) {
              if (record.title) {
                return renderCell(quantity, record, 9, 0, rowIndex, 0, 1);
              }
              // return <div className={storeStatusName === 'Chính thức' ? 'approved-state ml-3' : 'pending-state ml-3'}>{storeStatusName}</div>;
              return formatNumber(quantity);
            },
          },
          {
            title: translate('posmReports.withdrawQuantity'),
            key: nameof(dataSource[0].quantity),
            dataIndex: nameof(dataSource[0].quantity),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[quantity, record, rowIndex]) {
              if (record.title) {
                return renderCell(quantity, record, 9, 0, rowIndex, 0, 1);
              }
              // return <div className={storeStatusName === 'Chính thức' ? 'approved-state ml-3' : 'pending-state ml-3'}>{storeStatusName}</div>;
              return formatNumber(quantity);
            },
          },
          {
            title: translate('posmReports.remainQuantity'),
            key: nameof(dataSource[0].quantity),
            dataIndex: nameof(dataSource[0].quantity),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[quantity, record, rowIndex]) {
              if (record.title) {
                return renderCell(quantity, record, 9, 0, rowIndex, 0, 1);
              }
              // return <div className={storeStatusName === 'Chính thức' ? 'approved-state ml-3' : 'pending-state ml-3'}>{storeStatusName}</div>;
              return formatNumber(quantity);
            },
          },
          {
            title: translate('posmReports.amount'),
            key: nameof(dataSource[0].amount),
            dataIndex: nameof(dataSource[0].amount),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[amount, record, rowIndex]) {
              if (record.title) {
                return renderCell(amount, record, 10, 0, rowIndex, 0, 1);
              }
              return formatNumber(amount);
            },
          },
        ],
      },
    ];
  }, [dataSource, translate]);

  const handleDefaultSearch = React.useCallback(() => {
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

  const handleChange = React.useCallback(
    event => {
      filter.showingItemId.in = event?.in;
      setFilter({ ...filter });
      handleSearch();
    },
    [setFilter, filter, handleSearch],
  );
  return (
    <div className="page master-page kpi-report-master">
      <Card
        title={translate('posmReports.master.title')}
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
                    label={translate('posmReports.organization')}
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
                        handleFilterOrganization,
                      )}
                      getList={posmReportRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}

              {validAction('filterListStoreType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('posmReports.storeType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeTypeId))}
                      getList={posmReportRepository.filterListStoreType}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      searchField={nameof(storeTypeFilter.name)}
                      searchType={nameof(storeTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('posmReports.storeGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeGroupingId}
                      filterType={nameof(filter.storeGroupingId.equal)}
                      value={filter.storeGroupingId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeGroupingId),
                      )}
                      getList={posmReportRepository.filterListStoreGrouping}
                      modelFilter={storeGroupingFilter}
                      setModelFilter={setStoreGroupingFilter}
                      searchField={nameof(storeGroupingFilter.name)}
                      searchType={nameof(storeGroupingFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('posmReports.storeName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeId))}
                      getList={posmReportRepository.filterListStore}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      isReset={resetStore}
                      setIsReset={setResetStore}
                      placeholder={translate('general.placeholder.title')}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>

            <Row>
              <Col className="pl-1" span={6}>
                {validAction('filterListShowingItem') && (
                  <FormItem
                    className="mb-0"
                    label={translate(
                      'salesOrderByEmployeeAndItemsReports.item',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdMultiFilter
                      filter={filter.showingItemId}
                      filterType={nameof(filter.showingItemId.in)}
                      onChange={handleChange}
                      getList={posmReportRepository.filterListShowingItem}
                      modelFilter={showingItemFilter}
                      setModelFilter={setShowingItemFilter}
                      searchField={nameof(showingItemFilter.search)}
                      value={filter.showingItemId.in}
                      list={defaultListItem}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                )}
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('posmReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.date))}
                    placeholder={[
                      translate('posmReports.placeholder.startDate'),
                      translate('posmReports.placeholder.endDate'),
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
                  onClick={handleDefaultSearch}
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
const transformMethod = (item: POSMReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new POSMReportDataTable(),
    title: item.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };

  // const flattenByStoreCheckingGroup = flattenData(item.stores, 'contents'); // flatten by storeCheckingGrouping

  const flattenByStore = flattenData(item.stores, 'contents').map(
    item => ({ ...item, rowSpan: 0, key: uuidv4() } as POSMReportDataTable),
  ); // flatten by storeChecking

  if (flattenByStore.length > 0) {
    return [
      ...datalist,
      ...groupRowByField(
        flattenByStore, // dataSource
        nameof(item.stores[0].code), // groupBy field
        item.stores[0].code, // displayName
      ), // group dataSource by displayName
    ];
  }
  return datalist;
};

const renderCell = (
  value: any,
  record: POSMReportDataTable,
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
export default POSMReportView;
