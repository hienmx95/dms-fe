import { Col, Modal, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_STORE_UN_CHECKED_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { formatDate } from 'core/helpers/date-time';
import { formatNumber } from 'core/helpers/number';
import { crudService } from 'core/services';
import { AppUserFilter } from 'models/AppUserFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { SaleEmployee } from 'models/report/SaleEmployee';
import { Store } from 'models/report/Store';
import { StoreUnCheckedReport } from 'models/report/StoreUnCheckedReport';
import { StoreUnCheckedReportDataTable } from 'models/report/StoreUnCheckedReportDataTable';
import { StoreUnCheckedReportFilter } from 'models/report/StoreUnCheckedReportFilter';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
// import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Report.scss';
import { reportService } from '../ReportService';
import { storeUnCheckerReportRepository } from './StoreUnCheckedReportRepository';
const { Item: FormItem } = Form;
function StoreUnCheckedReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'store-unchecked-report',
    API_STORE_UN_CHECKED_REPORT_ROUTE,
  );
  const [
    filter,
    setFilter,
    list,
    setList,
    seLoadList,
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
    StoreUnCheckedReport,
    StoreUnCheckedReportFilter
  >(
    StoreUnCheckedReportFilter,
    storeUnCheckerReportRepository.list,
    storeUnCheckerReportRepository.count,
    'date',
  );

  const [dataSource] = reportService.useMasterDataSource<
    StoreUnCheckedReport,
    StoreUnCheckedReportDataTable
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
    storeUnCheckerReportRepository.list,
    total,
    seLoadList,
    loading,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StoreStatusFilter
  >(new StoreStatusFilter());
  const [resetAppUser, setResetAppUser] = React.useState<boolean>(false);
  const [dates, setDates] = React.useState<boolean>(true);
  const [handleExport] = crudService.useExport(
    storeUnCheckerReportRepository.export,
    filter,
  );
  React.useEffect(() => {
    if (filter.date.lessEqual && dates) {
      setDateFilter({ ...filter.date });
      const days = filter.date.lessEqual.diff(filter.date.greaterEqual, 'days');
      setDates(false);

      if (days > 7) {
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

  // const [dateFilter, setDateFilter] = React.useState<DateFilter>(new DateFilter());
  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'date') {
          filter.date.lessEqual = f.lessEqual;
          filter.date.greaterEqual = undefined;
          filter.date.greaterEqual = f.greaterEqual;
          if (f.lessEqual && f.greaterEqual) {
            const days = f.lessEqual.diff(f.greaterEqual, 'days');
            if (days > 7) {
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

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetAppUser(true);
  }, [handleReset, handleResetScroll]);

  const columns: ColumnProps<
    StoreUnCheckedReportDataTable
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index + 10,
        render(...[, record]) {
          const value = record.title ? record.title : record.indexInTable;
          return renderCell(value, record, 0, 11);
        },
      },

      {
        title: translate('storeUnCheckedReports.username'),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        width: 150,
        ellipsis: true,
        align: 'left',
        render(...[username, record]) {
          return renderCell(username, record, 1);
        },
      },
      {
        title: translate('storeUnCheckedReports.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[displayName, record]) {
          return renderCell(displayName, record, 2);
        },
      },
      {
        title: translate('storeUnCheckedReports.days'),
        key: nameof(uuidv4),
        dataIndex: nameof(dataSource[0].date),
        ellipsis: true,
        width: 100,
        align: 'left',
        render(...[date, record]) {
          if (record.title) {
            return renderCell(date, record, 3, 0);
          }
          return formatDate(date);
        },
      },
      {
        title: translate('storeUnCheckedReports.storeCode'),
        key: nameof(dataSource[0].storeCode),
        dataIndex: nameof(dataSource[0].storeCode),
        ellipsis: true,
        width: 100,
        align: 'left',
        render(...[storeCode, record]) {
          if (record.title) {
            return renderCell(storeCode, record, 4, 0);
          }
          return storeCode;
        },
      },
      {
        title: translate('storeUnCheckedReports.storeCodeDraft'),
        key: nameof(dataSource[0].storeCodeDraft),
        dataIndex: nameof(dataSource[0].storeCodeDraft),
        ellipsis: true,
        width: 100,
        align: 'left',
        render(...[storeCodeDraft, record]) {
          if (record.title) {
            return renderCell(storeCodeDraft, record, 5, 0);
          }
          return storeCodeDraft;
        },
      },
      {
        title: translate('storeUnCheckedReports.storeName'),
        key: nameof(dataSource[0].storeName),
        dataIndex: nameof(dataSource[0].storeName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[storeName, record]) {
          if (record.title) {
            return renderCell(storeName, record, 6, 0);
          }
          return storeName;
        },
      },
      {
        title: translate('storeUnCheckedReports.storeTypeName'),
        key: nameof(dataSource[0].storeTypeName),
        dataIndex: nameof(dataSource[0].storeTypeName),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[storeTypeName, record]) {
          if (record.title) {
            return renderCell(storeTypeName, record, 7, 0);
          }
          return storeTypeName;
        },
      },
      {
        title: translate('storeUnCheckedReports.storePhone'),
        key: nameof(dataSource[0].storePhone),
        dataIndex: nameof(dataSource[0].storePhone),
        ellipsis: true,
        width: 150,
        align: 'left',
        render(...[storePhone, record]) {
          if (record.title) {
            return renderCell(storePhone, record, 8, 0);
          }
          return storePhone;
        },
      },
      {
        title: translate('storeUnCheckedReports.storeAddress'),
        key: nameof(dataSource[0].storeAddress),
        dataIndex: nameof(dataSource[0].storeAddress),
        ellipsis: true,
        width: 300,
        align: 'left',
        render(...[storeAddress, record]) {
          if (record.title) {
            return renderCell(storeAddress, record, 9, 0);
          }
          return storeAddress;
        },
      },
      {
        title: translate('storeUnCheckedReports.storeStatusName'),
        key: nameof(dataSource[0].storeStatusName),
        dataIndex: nameof(dataSource[0].storeStatusName),
        ellipsis: true,
        width: 150,
        // align: 'center',
        render(...[storeStatusName, record]) {
          if (record.title) {
            return renderCell(storeStatusName, record, 10, 0);
          }
          // return <div className={storeStatusName === 'Chính thức' ? 'approved-state ml-3' : 'pending-state ml-3'}>{storeStatusName}</div>;
          return storeStatusName;
        },
      },
    ];
  }, [dataSource, translate]);

  const hanleDefaultSearch = React.useCallback(() => {
    if (dateFilter.lessEqual && dateFilter.greaterEqual) {
      const days = dateFilter.lessEqual.diff(dateFilter.greaterEqual, 'days');

      if (days > 7) {
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
        title={translate('storeUnCheckedReports.master.title')}
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
                    label={translate('storeUnCheckedReports.organization')}
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
                        storeUnCheckerReportRepository.filterListOrganization
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
                    label={translate('storeUnCheckedReports.displayName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={storeUnCheckerReportRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={resetAppUser}
                      setIsReset={setResetAppUser}
                      placeholder={translate('general.placeholder.title')}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('storeUnCheckedReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.date))}
                    placeholder={[
                      translate('storeUnCheckedReports.placeholder.startDate'),
                      translate('storeUnCheckedReports.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>

              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('storeUnCheckedReports.storeStatusName')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        storeUnCheckerReportRepository.filterListStoreStatus
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
const transformMethod = (item: StoreUnCheckedReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new StoreUnCheckedReportDataTable(),
    title: item.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };

  item.saleEmployees?.forEach((epmloyee: SaleEmployee) => {
    const { username, displayName } = epmloyee;
    epmloyee.stores?.forEach((stores: Store, index: number) => {
      let rowSpan = 0;
      if (index === 0) {
        rowSpan = epmloyee.stores ? epmloyee.stores.length : 0;
      }
      const {
        date,
        eRouteCode,
        storeCode,
        storeCodeDraft,
        storeName,
        storeTypeName,
        storePhone,
        storeAddress,
        storeStatusName,
      } = stores;
      datalist.push({
        ...new StoreUnCheckedReportDataTable(),
        key: uuidv4(),
        // rowSpan,
        username,
        displayName,
        date,
        eRouteCode,
        storeCode,
        storeCodeDraft,
        storeName,
        storeTypeName,
        storePhone,
        storeAddress,
        storeStatusName,
        rowSpan,
      });
    });
  });
  return datalist;
};

const renderCell = (
  value: any,
  record: StoreUnCheckedReportDataTable,
  colIndex: number,
  colNumber?: number,
  rowIndex?: number,
  firstColNumber?: number,
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
      rowSpan: record.rowSpan ? record.rowSpan : 0,
      colSpan: 1,
    },
  };
};
export default StoreUnCheckedReportView;
