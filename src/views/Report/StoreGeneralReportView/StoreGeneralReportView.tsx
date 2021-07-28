import { Col, Modal, Row, Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_STORE_GENERAL_REPORT_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { DEFAULT_TAKE, INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/report/Store';
import { StoreFilter } from 'models/report/StoreFilter';
import { StoreGeneralReport } from 'models/report/StoreGeneralReport';
import { StoreGeneralReportDataTable } from 'models/report/StoreGeneralReportDataTable';
import { StoreGeneralReportFilter } from 'models/report/StoreGeneralReportFilter';
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
import { storeGeneralReportRepository } from './StoreGeneralReportRepository';

const { Item: FormItem } = Form;
function StoreGeneralReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'store-general-report',
    API_STORE_GENERAL_REPORT_ROUTE,
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
    StoreGeneralReport,
    StoreGeneralReportFilter
  >(
    StoreGeneralReportFilter,
    storeGeneralReportRepository.list,
    storeGeneralReportRepository.count,
    'checkIn',
  );

  const [dataSource] = reportService.useMasterDataSource<
    StoreGeneralReport,
    StoreGeneralReportDataTable
  >(list, transformMethod);

  const [
    hasMore,
    setHasMore,
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
    storeGeneralReportRepository.list,
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

  const [resetStore, setResetStore] = React.useState<boolean>(false);

  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StoreStatusFilter
  >(new StoreStatusFilter());
  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    storeGeneralReportRepository.export,
    filter,
  );

  React.useEffect(() => {
    if (filter.checkIn.lessEqual && dates) {
      setDateFilter({ ...filter.checkIn });
      const days = filter.checkIn.lessEqual.diff(
        filter.checkIn.greaterEqual,
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
  }, [filter, setDateFilter, translate, dates, handleExport]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'checkIn') {
          filter.checkIn.lessEqual = f.lessEqual;
          filter.checkIn.greaterEqual = undefined;
          filter.checkIn.greaterEqual = f.greaterEqual;
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
    [filter, handleSearch, setFilter, handleExport, setDateFilter, translate],
  );

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
  }, [handleResetScroll, handleReset]);

  const columns: ColumnProps<
    StoreGeneralReportDataTable
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 60,
        render(...[, record, rowIndex]) {
          const value = record.title ? record.title : record.indexInTable;
          return renderCell(value, record, 0, 18, rowIndex, 0, record.rowSpan);
        },
      },

      {
        title: translate('storeGeneralReports.code'),
        key: uuidv4(),
        dataIndex: nameof(dataSource[0].code),
        width: 150,
        ellipsis: true,
        align: 'left',
        render(...[code, record, rowIndex]) {
          if (record.title) {
            return renderCell(code, record, 1, 0, rowIndex, 1, 1);
          }
          return code;
        },
      },
      {
        title: translate('storeGeneralReports.codeDraft'),
        key: nameof(dataSource[0].codeDraft),
        dataIndex: nameof(dataSource[0].codeDraft),
        width: 150,
        ellipsis: true,
        align: 'left',
        render(...[codeDraft, record, rowIndex]) {
          if (record.title) {
            return renderCell(codeDraft, record, 2, 0, rowIndex, 1, 1);
          }
          return codeDraft;
        },
      },
      {
        title: translate('storeGeneralReports.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[name, record, rowIndex]) {
          if (record.title) {
            return renderCell(name, record, 4, 0, rowIndex, 1, 1);
          }
          return name;
        },
      },
      {
        title: translate('storeGeneralReports.address'),
        key: nameof(dataSource[0].address),
        dataIndex: nameof(dataSource[0].address),
        ellipsis: true,
        width: 400,
        align: 'left',
        render(...[address, record, rowIndex]) {
          if (record.title) {
            return renderCell(address, record, 5, 0, rowIndex, 1, 1);
          }
          return address;
        },
      },
      {
        title: translate('storeGeneralReports.phone'),
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[phone, record, rowIndex]) {
          if (record.title) {
            return renderCell(phone, record, 6, 0, rowIndex, 1, 1);
          }
          return phone;
        },
      },
      {
        title: translate('storeGeneralReports.storeStatusName'),
        key: nameof(dataSource[0].storeStatusName),
        dataIndex: nameof(dataSource[0].storeStatusName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[storeStatusName, record, rowIndex]) {
          if (record.title) {
            return renderCell(storeStatusName, record, 7, 0, rowIndex, 1, 1);
          }
          // return <div className={storeStatusName === 'Chính thức' ? 'approved-state ml-3' : 'pending-state ml-3'}>{storeStatusName}</div>;
          return storeStatusName;
        },
      },
      {
        title: translate('storeGeneralReports.storeChecking'),
        children: [
          {
            title: (
              <Tooltip
                title={translate('storeGeneralReports.checkingPlannedCounter')}
              >
                {translate('storeGeneralReports.checkingPlannedCounter')}
              </Tooltip>
            ),
            key: nameof(dataSource[0].checkingPlannedCounter),
            dataIndex: nameof(dataSource[0].checkingPlannedCounter),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[checkingPlannedCounter, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  checkingPlannedCounter,
                  record,
                  8,
                  0,
                  rowIndex,
                  1,
                  1,
                );
              }
              return checkingPlannedCounter;
            },
          },
          {
            title: (
              <Tooltip
                title={translate(
                  'storeGeneralReports.checkingUnPlannedCounter',
                )}
              >
                {translate('storeGeneralReports.checkingUnPlannedCounter')}
              </Tooltip>
            ),
            key: nameof(dataSource[0].checkingUnPlannedCounter),
            dataIndex: nameof(dataSource[0].checkingUnPlannedCounter),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[checkingUnPlannedCounter, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  checkingUnPlannedCounter,
                  record,
                  9,
                  0,
                  rowIndex,
                  1,
                  1,
                );
              }
              return checkingUnPlannedCounter;
            },
          },
          {
            title: translate('storeGeneralReports.totalCheckingTime'),
            key: nameof(dataSource[0].totalCheckingTime),
            dataIndex: nameof(dataSource[0].totalCheckingTime),
            ellipsis: true,
            width: 150,
            align: 'left',
            render(...[totalCheckingTime, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  totalCheckingTime,
                  record,
                  10,
                  0,
                  rowIndex,
                  1,
                  1,
                );
              }
              return totalCheckingTime;
            },
          },
          {
            title: translate('storeGeneralReports.firstChecking'),
            key: nameof(dataSource[0].eFirstChecking),
            dataIndex: nameof(dataSource[0].eFirstChecking),
            ellipsis: true,
            width: 150,
            align: 'left',
            render(...[eFirstChecking, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  eFirstChecking,
                  record,
                  11,
                  0,
                  rowIndex,
                  1,
                  1,
                );
              }
              return eFirstChecking;
            },
          },
          {
            title: translate('storeGeneralReports.lastChecking'),
            key: nameof(dataSource[0].eLastChecking),
            dataIndex: nameof(dataSource[0].eLastChecking),
            ellipsis: true,
            width: 150,
            align: 'left',
            render(...[eLastChecking, record, rowIndex]) {
              if (record.title) {
                return renderCell(eLastChecking, record, 12, 0, rowIndex, 1, 1);
              }
              return eLastChecking;
            },
          },
          {
            title: (
              <Tooltip
                title={translate('storeGeneralReports.employeeLastChecking')}
              >
                {translate('storeGeneralReports.employeeLastChecking')}
              </Tooltip>
            ),
            key: nameof(dataSource[0].employeeLastChecking),
            dataIndex: nameof(dataSource[0].employeeLastChecking),
            ellipsis: true,
            width: 150,
            align: 'left',
            render(...[employeeLastChecking, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  employeeLastChecking,
                  record,
                  13,
                  0,
                  rowIndex,
                  1,
                  1,
                );
              }
              return employeeLastChecking;
            },
          },
        ],
      },
      {
        title: translate('storeGeneralReports.informationOrder'),
        children: [
          {
            title: translate('storeGeneralReports.indirectSalesOrderCounter'),
            key: nameof(dataSource[0].indirectSalesOrderCounter),
            dataIndex: nameof(dataSource[0].indirectSalesOrderCounter),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[indirectSalesOrderCounter, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  indirectSalesOrderCounter,
                  record,
                  14,
                  0,
                  rowIndex,
                  1,
                  1,
                );
              }
              return indirectSalesOrderCounter;
            },
          },
          {
            title: translate('storeGeneralReports.skuCounter'),
            key: nameof(dataSource[0].skuCounter),
            dataIndex: nameof(dataSource[0].skuCounter),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[skuCounter, record, rowIndex]) {
              if (record.title) {
                return renderCell(skuCounter, record, 15, 0, rowIndex, 1, 1);
              }
              return skuCounter;
            },
          },
          {
            title: (
              <Tooltip title={translate('storeGeneralReports.totalRevenue')}>
                {translate('storeGeneralReports.totalRevenue')}
              </Tooltip>
            ),
            key: nameof(dataSource[0].totalRevenue),
            dataIndex: nameof(dataSource[0].totalRevenue),
            ellipsis: true,
            width: 150,
            align: 'right',
            render(...[totalRevenue, record, rowIndex]) {
              if (record.title) {
                return renderCell(totalRevenue, record, 16, 0, rowIndex, 1, 1);
              }
              return formatNumber(totalRevenue);
            },
          },
          {
            title: (
              <Tooltip title={translate('storeGeneralReports.lastOrder')}>
                {translate('storeGeneralReports.lastOrder')}
              </Tooltip>
            ),
            key: nameof(dataSource[0].lastOrderDisplay),
            dataIndex: nameof(dataSource[0].lastOrderDisplay),
            ellipsis: true,
            width: 180,
            align: 'left',
            render(...[lastOrderDisplay, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  lastOrderDisplay,
                  record,
                  17,
                  0,
                  rowIndex,
                  1,
                  1,
                );
              }
              return lastOrderDisplay;
            },
          },
        ],
      },
    ];
  }, [dataSource, translate]);
  return (
    <div className="page master-page kpi-report-master">
      <Card
        title={translate('storeGeneralReports.master.title')}
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
                    label={translate('storeGeneralReports.organization')}
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
                        storeGeneralReportRepository.filterListOrganization
                      }
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeGeneralReports.storeName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeId))}
                      getList={storeGeneralReportRepository.filterListStore}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      isReset={resetStore}
                      setIsReset={setResetStore}
                      placeholder={translate(
                        'storeGeneralReports.placeholder.store',
                      )}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeGeneralReports.storeType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleControlFilter(nameof(filter.storeTypeId))}
                      getList={storeGeneralReportRepository.filterListStoreType}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      searchField={nameof(storeTypeFilter.name)}
                      searchType={nameof(storeTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'storeGeneralReports.placeholder.storeType',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeGeneralReports.storeGrouping')}
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
                        storeGeneralReportRepository.filterListStoreGrouping
                      }
                      modelFilter={storeGroupingFilter}
                      setModelFilter={setStoreGroupingFilter}
                      searchField={nameof(storeGroupingFilter.name)}
                      searchType={nameof(storeGroupingFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'storeGeneralReports.placeholder.storeGrouping',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('storeGeneralReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.checkIn))}
                    placeholder={[
                      translate('storeGeneralReports.placeholder.startDate'),
                      translate('storeGeneralReports.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>

              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('storeGeneralReports.storeStatusName')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleControlFilter(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        storeGeneralReportRepository.filterListStoreStatus
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
const transformMethod = (item: StoreGeneralReport) => {
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new StoreGeneralReportDataTable(),
    title: item.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  item.stores?.forEach((s: Store) => {
    const {
      id,
      code,
      codeDraft,
      name,
      address,
      phone,
      checkingPlannedCounter,
      checkingUnPlannedCounter,
      totalCheckingTime,
      firstChecking,
      lastChecking,
      indirectSalesOrderCounter,
      skuCounter,
      totalRevenue,
      lastOrder,
      lastOrderDisplay,
      employeeLastChecking,
      eFirstChecking,
      eLastChecking,
      storeStatusName,
    } = s;
    datalist.push({
      ...new StoreGeneralReportDataTable(),
      key: uuidv4(),
      id,
      code,
      codeDraft,
      name,
      address,
      phone,
      checkingPlannedCounter,
      checkingUnPlannedCounter,
      totalCheckingTime,
      firstChecking,
      lastChecking,
      indirectSalesOrderCounter,
      skuCounter,
      totalRevenue,
      lastOrder,
      lastOrderDisplay,
      employeeLastChecking,
      eFirstChecking,
      eLastChecking,
      storeStatusName,
    });
  });
  return datalist;
};

const renderCell = (
  value: any,
  record: StoreGeneralReportDataTable,
  colIndex: number,
  colNumber?: number,
  rowIndex?: number,
  firstColNumber?: number, // colSpan if first row is total
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
      children: <div className={`${alignText} table-row`}>{value}</div>,
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
    children: <div className={`${alignText} table-row`}>{value}</div>,
    props: {
      rowSpan: rowNumber ? rowNumber : 1,
      colSpan: 1,
    },
  };
};
export default StoreGeneralReportView;
