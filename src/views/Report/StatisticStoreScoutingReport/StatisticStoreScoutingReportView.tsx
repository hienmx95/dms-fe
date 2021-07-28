import { Col, Modal, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_STATISTIC_STORE_SCOUTING_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { formatNumber } from 'core/helpers/number';
import { crudService } from 'core/services';
import { DistrictFilter } from 'models/DistrictFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { StatisticStoreScoutingReport } from 'models/report/StatisticStoreScoutingReport';
import { StatisticStoreScoutingReportDataTable } from 'models/report/StatisticStoreScoutingReportDataTable';
import { StatisticStoreScoutingReportFilter } from 'models/report/StatisticStoreScoutingReportFilter';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
// import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Report.scss';
import { reportService } from '../ReportService';
import { statisticStoreScoutingReportRepository } from './StatisticStoreScoutingReportRepository';

const { Item: FormItem } = Form;
function StatisticStoreScoutingReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'statistic-store-scouting-report',
    API_STATISTIC_STORE_SCOUTING_REPORT_ROUTE,
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
    StatisticStoreScoutingReport,
    StatisticStoreScoutingReportFilter
  >(
    StatisticStoreScoutingReportFilter,
    statisticStoreScoutingReportRepository.list,
    statisticStoreScoutingReportRepository.count,
    'date',
  );

  const [
    hasMore,
    ,
    handleInfiniteOnLoad,
    handleSearch,
    ,
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
    statisticStoreScoutingReportRepository.list,
    total,
    setLoadList,
    loading,
  );

  const [totalCount] = reportService.getTitleNumber<
    StatisticStoreScoutingReportDataTable,
    StatisticStoreScoutingReportFilter
  >(filter, statisticStoreScoutingReportRepository.total, isCount, setIsCount);

  const [dataSource] = reportService.useMasterDataSource<
    StatisticStoreScoutingReport,
    StatisticStoreScoutingReportDataTable
  >(list, transformMethod);

  const [dataList] = reportService.addTotalCount<
    StatisticStoreScoutingReportDataTable
  >(dataSource, totalCount);
  // Reference  -------------------------------------------------------------------------------------------------------------------------------------
  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );
  const [resetWard, setResetWard] = React.useState<boolean>(false);
  const [resetDistrict, setResetDistrict] = React.useState<boolean>(false);
  const [dates, setDates] = React.useState<boolean>(true);
  // const [dateFilter, setDateFilter] = React.useState<DateFilter>(new DateFilter());

  const [handleExport] = crudService.useExport(
    statisticStoreScoutingReportRepository.export,
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

  const handleFilterProvince = React.useCallback(
    event => {
      const provinceId = event.equal;
      if (districtFilter.provinceId.equal !== provinceId) {
        filter.provinceId.equal = provinceId;
        filter.districtId.equal = undefined;
        filter.wardId.equal = undefined;
        setResetDistrict(true);
        setResetWard(true);
        setFilter({ ...filter });
        handleSearch();
      }
      districtFilter.provinceId.equal = provinceId;
    },
    [districtFilter.provinceId.equal, filter, handleSearch, setFilter],
  );

  const handleFilterDistrict = React.useCallback(
    event => {
      const districtId = event.equal;
      if (wardFilter.districtId.equal !== districtId) {
        filter.districtId.equal = districtId;
        filter.wardId = undefined;
        setResetWard(true);
        setFilter({ ...filter });
        handleSearch();
      }
      wardFilter.districtId.equal = districtId;
    },
    [filter, handleSearch, setFilter, wardFilter.districtId.equal],
  );

  const handleFilterWard = React.useCallback(
    event => {
      filter.wardId.equal = event.equal;
      setFilter({ ...filter });
      handleSearch();
    },
    [filter, handleSearch, setFilter],
  );

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetDistrict(true);
    setResetWard(true);
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

  const columns: ColumnProps<
    StatisticStoreScoutingReportDataTable
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
          return renderCell(value, record, 0, 10, rowIndex, 2, record.rowSpan);
        },
      },

      {
        title: translate('statisticStoreScoutingReports.officalName'),
        key: nameof(dataList[0].officalName),
        dataIndex: nameof(dataList[0].officalName),
        width: 120,
        ellipsis: true,
        align: 'left',
        render(...[officalName, record, rowIndex]) {
          return renderCell(
            officalName,
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
        title: () => (
          <div className="text-center ml-3">
            <div>
              {translate('statisticStoreScoutingReports.storeScoutingCounter')}
            </div>
            <div className="text-center ml-3">(1)</div>
          </div>
        ),
        // title: translate('statisticStoreScoutingReports.storeScoutingCounter'),
        key: nameof(dataList[0].storeScoutingCounter),
        dataIndex: nameof(dataList[0].storeScoutingCounter),
        ellipsis: true,
        align: 'right',
        width: 150,
        render(...[storeScoutingCounter, record, rowIndex]) {
          let value = storeScoutingCounter;
          if (rowIndex === 0) {
            value = record.storeScoutingCounter;
          }
          return renderCell(value, record, 2, 0, rowIndex, 1, 1);
        },
      },
      {
        title: () => (
          <div className="text-center ml-3">
            <div>
              {translate('statisticStoreScoutingReports.storeOpennedCounter')}
            </div>
            <div className="text-center ml-3">(2)</div>
          </div>
        ),
        key: nameof(dataList[0].storeOpennedCounter),
        dataIndex: nameof(dataList[0].storeOpennedCounter),
        ellipsis: true,
        width: 150,
        render(...[storeOpennedCounter, record, rowIndex]) {
          let value = storeOpennedCounter;
          if (rowIndex === 0) {
            value = record.storeOpennedCounter;
          }
          return renderCell(value, record, 3, 0, rowIndex, 1, 1);
        },
        align: 'right',
      },
      {
        title: () => (
          <div className="text-center ml-3">
            <div>
              {translate('statisticStoreScoutingReports.storeScoutingUnOpen')}
            </div>
            <div className="text-center ml-3">(3) = (1) - (2)</div>
          </div>
        ),
        key: nameof(dataList[0].storeScoutingUnOpen),
        dataIndex: nameof(dataList[0].storeScoutingUnOpen),
        ellipsis: true,
        width: 150,
        render(...[storeScoutingUnOpen, record, rowIndex]) {
          let value = storeScoutingUnOpen;
          if (rowIndex === 0) {
            value = record.storeScoutingUnOpen;
          }
          return renderCell(value, record, 4, 0, rowIndex, 1, 1);
        },
        align: 'right',
      },
      {
        title: () => (
          <div className="text-center ml-3">
            <div>
              {' '}
              {translate('statisticStoreScoutingReports.storeCounter')}
            </div>
            <div className="text-center ml-3">(4)</div>
          </div>
        ),
        key: nameof(dataList[0].storeCounter),
        dataIndex: nameof(dataList[0].storeCounter),
        ellipsis: true,
        width: 150,
        render(...[storeCounter, record, rowIndex]) {
          let value = storeCounter;
          if (rowIndex === 0) {
            value = record.storeCounter;
          }
          return renderCell(value, record, 5, 0, rowIndex, 1, 1);
        },
        align: 'right',
      },
      {
        title: () => (
          <div className="text-center ml-3">
            <div>
              {' '}
              {translate(
                'statisticStoreScoutingReports.storeCoutingOpennedRate',
              )}
            </div>
            <div className="text-center ml-3">(5) = (2)/(1)</div>
          </div>
        ),
        key: nameof(dataList[0].storeCoutingOpennedRate),
        dataIndex: nameof(dataList[0].storeCoutingOpennedRate),
        ellipsis: true,
        width: 150,
        render(...[storeCoutingOpennedRate, record, rowIndex]) {
          let value = storeCoutingOpennedRate;
          if (rowIndex === 0) {
            value = record.storeCoutingOpennedRate;
          }
          return renderCell(value, record, 6, 0, rowIndex, 1, 1, true);
        },
        align: 'right',
      },
      {
        title: () => (
          <div className="text-center ml-3">
            <div>
              {' '}
              {translate('statisticStoreScoutingReports.storeCoutingRate')}
            </div>
            <div className="text-center ml-3">(6) = (3)/ ((3) + (4))</div>
          </div>
        ),
        key: nameof(dataList[0].storeCoutingRate),
        dataIndex: nameof(dataList[0].storeCoutingRate),
        ellipsis: true,
        width: 150,
        render(...[storeCoutingRate, record, rowIndex]) {
          let value = storeCoutingRate;
          if (rowIndex === 0) {
            value = record.storeCoutingRate;
          }
          return renderCell(value, record, 7, 0, rowIndex, 1, 1, true);
        },
        align: 'right',
      },
      {
        title: () => (
          <div className="text-center ml-3">
            <div>{translate('statisticStoreScoutingReports.storeRate')}</div>
            <div className="text-center ml-3">(7) = (4)/ ((3) + (4))</div>
          </div>
        ),
        key: nameof(dataList[0].storeRate),
        dataIndex: nameof(dataList[0].storeRate),
        ellipsis: true,
        width: 150,
        render(...[storeRate, record, rowIndex]) {
          let value = storeRate;
          if (rowIndex === 0) {
            value = record.storeRate;
          }
          return renderCell(value, record, 8, 0, rowIndex, 1, 1, true);
        },
        align: 'right',
      },
    ];
  }, [dataList, translate]);
  const data = React.useMemo(
    () => ({
      datasets: [
        {
          data: [dataList[0]?.storeCoutingRate, dataList[0]?.storeRate],
          backgroundColor: ['#87BA65', '#a32f4a'],
        },
      ],

      labels: [
        translate('statisticStoreScoutingReports.storeScoutingCounter'),
        translate('statisticStoreScoutingReports.storeCounter'),
      ],
    }),
    [dataList, translate],
  );
  return (
    <div className="page master-page statistic-store-scouting-report-master">
      <Card
        title={translate('statisticStoreScoutingReports.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {validAction('filterListProvince') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('statisticStoreScoutingReports.province')}
                  >
                    <AdvancedIdFilter
                      filter={filter.provinceId}
                      filterType={nameof(filter.provinceId.equal)}
                      value={filter.provinceId.equal}
                      onChange={handleFilterProvince}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      getList={
                        statisticStoreScoutingReportRepository.filterListProvince
                      }
                      searchField={nameof(provinceFilter.name)}
                      searchType={nameof(provinceFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListDistrict') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('statisticStoreScoutingReports.district')}
                  >
                    <AdvancedIdFilter
                      filter={filter.districtId}
                      filterType={nameof(filter.districtId.equal)}
                      value={filter.districtId.equal}
                      onChange={handleFilterDistrict}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      getList={
                        statisticStoreScoutingReportRepository.filterListDistrict
                      }
                      searchField={nameof(districtFilter.name)}
                      searchType={nameof(districtFilter.name.contain)}
                      isReset={resetDistrict}
                      setIsReset={setResetDistrict}
                      placeholder={translate('general.placeholder.title')}
                      disabled={
                        filter.provinceId.equal === undefined ? true : false
                      }
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListWard') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('statisticStoreScoutingReports.ward')}
                  >
                    <AdvancedIdFilter
                      filter={filter.wardId}
                      filterType={nameof(filter.wardId.equal)}
                      value={filter.wardId.equal}
                      onChange={handleFilterWard}
                      modelFilter={wardFilter}
                      setModelFilter={setWardFilter}
                      getList={
                        statisticStoreScoutingReportRepository.filterListWard
                      }
                      searchField={nameof(wardFilter.name)}
                      searchType={nameof(wardFilter.name.contain)}
                      isReset={resetWard}
                      setIsReset={setResetWard}
                      placeholder={translate('general.placeholder.title')}
                      disabled={
                        filter.districtId.equal === undefined ? true : false
                      }
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('statisticStoreScoutingReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.date))}
                    placeholder={[
                      translate(
                        'statisticStoreScoutingReports.placeholder.startDate',
                      ),
                      translate(
                        'statisticStoreScoutingReports.placeholder.endDate',
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
        <Row className="ml-3">
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
        </Row>
        <Row className="ml-3 mr-3">
          <Col lg={15}>
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
          </Col>
          <Col lg={9}>
            <div className="chart-title d-flex justify-content-center">
              {translate('statisticStoreScoutingReports.chart.title')}
            </div>
            <div className="offical-name d-flex justify-content-center">
              {dataList && dataList[0]?.officalName}
            </div>

            <Pie
              data={data}
              options={{
                legend: {
                  display: true,
                  labels: {
                    padding: 40,
                    boxWidth: 10,
                  },
                  position: 'bottom',
                  align: 'center',
                },
              }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
const transformMethod = (report: StatisticStoreScoutingReport) => {
  const datalist = [];
  // fist record is title record
  const {
    officalName,
    storeCounter,
    storeOpennedCounter,
    storeScoutingUnOpen,
    storeScoutingCounter,
    storeCoutingOpennedRate,
    storeCoutingRate,
    storeRate,
  } = report;
  datalist.push({
    ...new StatisticStoreScoutingReportDataTable(),
    key: uuidv4(),
    // rowSpan,
    officalName,
    storeCounter,
    storeOpennedCounter,
    storeScoutingUnOpen,
    storeScoutingCounter,
    storeCoutingOpennedRate,
    storeCoutingRate,
    storeRate,
  });
  return datalist;
};

const renderCell = (
  value: any,
  record: StatisticStoreScoutingReportDataTable,
  colIndex: number,
  colNumber?: number,
  rowIndex?: number,
  firstColNumber?: number,
  rowNumber?: number,
  type?: boolean,
) => {
  // check if record has title or not
  if (record.title) {
    let colSpan = 0;
    // if colIndex = 0; set colSpan = number of column
    if (colIndex === 0) {
      colSpan = colNumber ? colNumber : 1;
    }
    return {
      children: (
        <div className="table-title-row table-row">
          {type && type === true && (
            <>
              {value} {value && value !== undefined && value !== null && <>%</>}
            </>
          )}
          {!type && <>{value}</>}
        </div>
      ),
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
      children: (
        <span className={`${alignText} table-row`}>
          {type && type === true && (
            <>
              {value} {value && value !== undefined && value !== null && <>%</>}
            </>
          )}
          {!type && <>{value}</>}
        </span>
      ),
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
    children: (
      <span className={`${alignText} table-row`}>
        {type && type === true && (
          <>
            {value} {value && value !== undefined && value !== null && <>%</>}
          </>
        )}
        {!type && <>{value}</>}
      </span>
    ),
    props: {
      rowSpan: rowNumber ? rowNumber : 1,
      colSpan: 1,
    },
  };
};
export default StatisticStoreScoutingReportView;
