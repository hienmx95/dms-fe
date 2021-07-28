import { Col, Modal, Row, Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_STATISTIC_PROBLEM_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { DEFAULT_TAKE, INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Problem } from 'models/report/Problem';
import { StatisticProblemReport } from 'models/report/StatisticProblemReport';
import { StatisticProblemReportDataTable } from 'models/report/StatisticProblemReportDataTable';
import { StatisticProblemReportFilter } from 'models/report/StatisticProblemReportFilter';
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
import { statisticProblemReportRepository } from './StatisticProblemReportRepository';

const { Item: FormItem } = Form;
function StatisticProblemReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'statistic-problem-report',
    API_STATISTIC_PROBLEM_REPORT_ROUTE,
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
    StatisticProblemReport,
    StatisticProblemReportFilter
  >(
    StatisticProblemReportFilter,
    statisticProblemReportRepository.list,
    statisticProblemReportRepository.count,
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
    handleIndepentFilter,
    handleResetScroll,
  ] = crudService.useTableScroll(
    list,
    setList,
    filter,
    setFilter,
    setLoading,
    statisticProblemReportRepository.list,
    total,
    setLoadList,
    loading,
  );

  const [totalCount] = reportService.getTitleNumber<
    StatisticProblemReportDataTable,
    StatisticProblemReportFilter
  >(filter, statisticProblemReportRepository.total, isCount, setIsCount);

  const [dataSource] = reportService.useMasterDataSource<
    StatisticProblemReport,
    StatisticProblemReportDataTable
  >(list, transformMethod);

  const [dataList] = reportService.addTotalCount<
    StatisticProblemReportDataTable
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
  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    statisticProblemReportRepository.export,
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
  }, [filter, setDateFilter, translate, dates, handleExport]);
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
    [filter, handleSearch, setFilter, handleExport, setDateFilter, translate],
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
  }, [handleResetScroll, handleReset]);
  const columns: ColumnProps<
    StatisticProblemReportDataTable
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
          return renderCell(value, record, 0, 12, rowIndex, 8, record.rowSpan);
        },
      },

      {
        title: translate('statisticProblemReports.code'),
        key: nameof(dataList[0].code),
        dataIndex: nameof(dataList[0].code),
        width: 200,
        align: 'left',
        ellipsis: true,
        render(...[code, record, rowIndex]) {
          return renderCell(code, record, 1, 0, rowIndex, 0, record.rowSpan);
        },
      },
      {
        title: translate('statisticProblemReports.codeDraft'),
        key: nameof(dataList[0].codeDraft),
        dataIndex: nameof(dataList[0].codeDraft),
        width: 200,
        align: 'left',
        ellipsis: true,
        render(...[codeDraft, record, rowIndex]) {
          return renderCell(
            codeDraft,
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
        title: translate('statisticProblemReports.name'),
        key: nameof(dataList[0].name),
        dataIndex: nameof(dataList[0].name),
        ellipsis: true,
        width: 200,
        align: 'left',
        render(...[name, record, rowIndex]) {
          return renderCell(name, record, 3, 0, rowIndex, 0, record.rowSpan);
        },
      },
      {
        title: translate('statisticProblemReports.address'),
        key: nameof(dataList[0].address),
        dataIndex: nameof(dataList[0].address),
        ellipsis: true,
        width: 450,
        align: 'left',
        render(...[address, record, rowIndex]) {
          return renderCell(address, record, 4, 0, rowIndex, 0, record.rowSpan);
        },
      },
      {
        title: translate('statisticProblemReports.phone'),
        key: nameof(dataList[0].phone),
        dataIndex: nameof(dataList[0].phone),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[phone, record, rowIndex]) {
          return renderCell(phone, record, 5, 0, rowIndex, 0, record.rowSpan);
        },
      },
      {
        title: translate('statisticProblemReports.storeStatusName'),
        key: nameof(dataList[0].storeStatusName),
        dataIndex: nameof(dataList[0].storeStatusName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[storeStatusName, record, rowIndex]) {
          return renderCell(
            storeStatusName,
            record,
            6,
            0,
            rowIndex,
            0,
            record.rowSpan,
          );
        },
      },
      {
        title: (
          <Tooltip title={translate('statisticProblemReports.problemTypeName')}>
            {translate('statisticProblemReports.problemTypeName')}
          </Tooltip>
        ),
        key: nameof(dataList[0].problemTypeName),
        dataIndex: nameof(dataList[0].problemTypeName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[problemTypeName, record, rowIndex]) {
          return renderCell(problemTypeName, record, 7, 0, rowIndex, 0, 1);
        },
      },
      {
        title: (
          <Tooltip title={translate('statisticProblemReports.waitingCounter')}>
            {translate('statisticProblemReports.waitingCounter')}
          </Tooltip>
        ),
        key: nameof(dataList[0].waitingCounter),
        dataIndex: nameof(dataList[0].waitingCounter),
        ellipsis: true,
        width: 100,
        align: 'right',
        render(...[waitingCounter, record, rowIndex]) {
          let value = waitingCounter;
          if (rowIndex === 0) {
            value = record.waitingCounter;
          }
          return renderCell(value, record, 8, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('statisticProblemReports.processCounter'),
        key: nameof(dataList[0].processCounter),
        dataIndex: nameof(dataList[0].processCounter),
        ellipsis: true,
        width: 100,
        align: 'right',
        render(...[processCounter, record, rowIndex]) {
          let value = processCounter;
          if (rowIndex === 0) {
            value = record.processCounter;
          }
          return renderCell(value, record, 9, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('statisticProblemReports.completedCounter'),
        key: nameof(dataList[0].completedCounter),
        dataIndex: nameof(dataList[0].completedCounter),
        ellipsis: true,
        width: 120,
        align: 'right',
        render(...[completedCounter, record, rowIndex]) {
          let value = completedCounter;
          if (rowIndex === 0) {
            value = record.completedCounter;
          }
          return renderCell(value, record, 10, 0, rowIndex, 1, 1);
        },
      },
      {
        title: translate('statisticProblemReports.total'),
        key: nameof(dataList[0].total),
        dataIndex: nameof(dataList[0].total),
        ellipsis: true,
        width: 100,
        align: 'right',
        render(...[total, record, rowIndex]) {
          let value = total;
          if (rowIndex === 0) {
            value = record.total;
          }
          return renderCell(value, record, 11, 0, rowIndex, 1, 1);
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
        title={translate('statisticProblemReports.master.title')}
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
                    label={translate('statisticProblemReports.organization')}
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
                        statisticProblemReportRepository.filterListOrganization
                      }
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
                    label={translate('statisticProblemReports.storeType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleControlFilter(nameof(filter.storeTypeId))}
                      getList={
                        statisticProblemReportRepository.filterListStoreType
                      }
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      searchField={nameof(storeTypeFilter.name)}
                      searchType={nameof(storeTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'statisticProblemReports.placeholder.storeType',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('statisticProblemReports.storeGrouping')}
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
                        statisticProblemReportRepository.filterListStoreGrouping
                      }
                      modelFilter={storeGroupingFilter}
                      setModelFilter={setStoreGroupingFilter}
                      searchField={nameof(storeGroupingFilter.name)}
                      searchType={nameof(storeGroupingFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'statisticProblemReports.placeholder.storeGrouping',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('statisticProblemReports.storeName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeId))}
                      getList={statisticProblemReportRepository.filterListStore}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      isReset={resetStore}
                      setIsReset={setResetStore}
                      placeholder={translate(
                        'statisticProblemReports.placeholder.store',
                      )}
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
                  label={translate('statisticProblemReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.date))}
                    placeholder={[
                      translate(
                        'statisticProblemReports.placeholder.startDate',
                      ),
                      translate('statisticProblemReports.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('statisticProblemReports.storeStatusName')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        statisticProblemReportRepository.filterListStoreStatus
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
const transformMethod = (item: StatisticProblemReport) => {
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new StatisticProblemReportDataTable(),
    title: item.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  let storeStatusName: string;
  item.stores?.forEach((store: Store) => {
    const { code, name, phone, address, storeStatus, codeDraft } = store;
    storeStatusName = storeStatus.name;

    store.contents?.forEach((content: Problem, index: number) => {
      let rowSpan = 0;
      if (index === 0) {
        rowSpan = store.contents ? store.contents.length : 0;
      }
      const {
        problemTypeName,
        waitingCounter,
        processCounter,
        completedCounter,
        total,
        problemTypeId,
      } = content;

      datalist.push({
        ...new StatisticProblemReportDataTable(),
        key: uuidv4(),
        code,
        codeDraft,
        name,
        address,
        phone,
        storeStatusName,
        problemTypeName,
        waitingCounter,
        processCounter,
        completedCounter,
        total,
        problemTypeId,
        rowSpan,
      });
    });
  });

  return datalist;
};

const renderCell = (
  value: any,
  record: StatisticProblemReportDataTable,
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
export default StatisticProblemReportView;
