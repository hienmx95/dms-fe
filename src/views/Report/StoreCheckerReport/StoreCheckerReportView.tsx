import { Col, Modal, Row, Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_STORE_CHECKER_REPORT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters/DateFilter';
import { flattenData } from 'core/helpers/array';
import { formatDate, formatDateTime } from 'core/helpers/date-time';
import { formatNumber } from 'core/helpers/number';
import { crudService } from 'core/services';
import { groupRowByField } from 'helpers/ant-design/table';
import { AppUserFilter } from 'models/AppUserFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StoreCheckerReport } from 'models/report/StoreCheckerReport';
import { StoreCheckerReportDataTable } from 'models/report/StoreCheckerReportDataTable';
import { StoreCheckerReportFilter } from 'models/report/StoreCheckerReportFilter';
import { StoreFilter } from 'models/report/StoreFilter';
import { StoreGroupingFilter } from 'models/report/StoreGroupingFilter';
import { StoreTypeFilter } from 'models/report/StoreTypeFilter';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import moment, { Moment } from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Report.scss';
import { reportService } from '../ReportService';
import { storeCheckerReportRepository } from './StoreCheckerReportRepository';

const { Item: FormItem } = Form;
function StoreCheckerReportView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'store-checked-report',
    API_STORE_CHECKER_REPORT_ROUTE,
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
    StoreCheckerReport,
    StoreCheckerReportFilter
  >(
    StoreCheckerReportFilter,
    storeCheckerReportRepository.list,
    storeCheckerReportRepository.count,
    'checkIn',
  );

  const [dataSource] = reportService.useMasterDataSource<
    StoreCheckerReport,
    StoreCheckerReportDataTable
  >(list, transformMethod);

  const formatWeekDays = React.useCallback((date: Moment) => {
    const days = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];
    let d = moment(date).toDate();
    d = new Date(d);
    return days[d?.getDay()];
  }, []);

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
    storeCheckerReportRepository.list,
    total,
    setLoadList,
    loading,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

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

  const [
    checkingPlanStatusFilter,
    setCheckingPlanStatusFilter,
  ] = React.useState<StoreStatusFilter>(new StoreStatusFilter());

  const [resetAppUser, setResetAppUser] = React.useState<boolean>(false);
  const [resetStore, setResetStore] = React.useState<boolean>(false);

  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    storeCheckerReportRepository.export,
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
  }, [filter, setDateFilter, translate, handleExport, dates]);

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
    [filter, handleSearch, setFilter, handleExport, translate, setDateFilter],
  );

  const handleFilterOrganization = React.useCallback(
    event => {
      const organizationId = event.equal;
      if (appUserFilter?.organizationId?.equal !== organizationId) {
        filter.organizationId.equal = organizationId;
        filter.appUserId.equal = undefined;
        setResetAppUser(true);
        setResetStore(true);
        setFilter({ ...filter });
        handleSearch();
      }
      appUserFilter.organizationId.equal = organizationId;
      storeFilter.organizationId.equal = organizationId;
    },
    [
      appUserFilter,
      filter,
      handleSearch,
      setFilter,
      storeFilter.organizationId.equal,
    ],
  );

  const handleFormatBoolean = React.useCallback(value => {
    if (value) {
      return 'x';
    }
  }, []);
  const handleFormatTime = React.useCallback(value => {
    const time = formatDateTime(value);
    return time.substr(11, 5);
  }, []);

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetAppUser(true);
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

  const columns: ColumnProps<
    StoreCheckerReportDataTable
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index + 10,
        render(...[, record, rowIndex]) {
          const value = record.title ? record.title : record.indexInTable;
          return renderCell(value, record, 0, 19, rowIndex, 0, record.rowSpan);
        },
      },

      {
        title: translate('storeCheckerReports.username'),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        width: 150,
        align: 'left',
        ellipsis: true,
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
        title: translate('storeCheckerReports.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
        align: 'left',
        width: 150,
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
        title: translate('storeCheckerReports.days'),
        key: nameof(uuidv4),
        dataIndex: nameof(dataSource[0].date),
        ellipsis: true,
        align: 'left',
        width: 100,
        render(...[date, record, rowIndex]) {
          if (record.title) {
            return renderCell(date, record, 3, 0, rowIndex, 0, 1);
          }
          return formatDate(date);
        },
      },
      {
        title: translate('storeCheckerReports.weekdays'),
        key: nameof(dataSource[0].date),
        dataIndex: nameof(dataSource[0].date),
        ellipsis: true,
        width: 100,
        align: 'left',
        render(...[date, record, rowIndex]) {
          if (record.title) {
            return renderCell(date, record, 4, 0, rowIndex, 0, 1);
          }
          return formatWeekDays(date);
        },
      },
      {
        title: translate('storeCheckerReports.store'),
        children: [
          {
            title: translate('storeCheckerReports.storeCode'),
            key: nameof(dataSource[0].storeCode),
            dataIndex: nameof(dataSource[0].storeCode),
            ellipsis: true,
            align: 'left',
            width: 150,
            render(...[storeCode, record, rowIndex]) {
              if (record.title) {
                return renderCell(storeCode, record, 5, 0, rowIndex, 0, 1);
              }
              return storeCode;
            },
          },
          {
            title: translate('storeCheckerReports.storeCodeDraft'),
            key: nameof(dataSource[0].storeCodeDraft),
            dataIndex: nameof(dataSource[0].storeCodeDraft),
            ellipsis: true,
            align: 'left',
            width: 150,
            render(...[storeCodeDraft, record, rowIndex]) {
              if (record.title) {
                return renderCell(storeCodeDraft, record, 6, 0, rowIndex, 0, 1);
              }
              return storeCodeDraft;
            },
          },
          {
            title: translate('storeCheckerReports.storeName'),
            key: nameof(dataSource[0].storeName),
            dataIndex: nameof(dataSource[0].storeName),
            ellipsis: true,
            align: 'left',
            width: 150,
            render(...[storeName, record, rowIndex]) {
              if (record.title) {
                return renderCell(storeName, record, 7, 0, rowIndex, 0, 1);
              }
              return storeName;
            },
          },
          {
            title: translate('storeCheckerReports.storeAddress'),
            key: nameof(dataSource[0].storeAddress),
            dataIndex: nameof(dataSource[0].storeAddress),
            ellipsis: true,
            align: 'left',
            width: 250,
            render(...[storeAddress, record, rowIndex]) {
              if (record.title) {
                return renderCell(storeAddress, record, 8, 0, rowIndex, 0, 1);
              }
              return storeAddress;
            },
          },
          {
            title: translate('storeCheckerReports.storeStatus'),
            key: nameof(dataSource[0].storeStatusName),
            dataIndex: nameof(dataSource[0].storeStatusName),
            ellipsis: true,
            width: 150,
            render(...[storeStatusName, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  storeStatusName,
                  record,
                  9,
                  0,
                  rowIndex,
                  0,
                  1,
                );
              }
              // return <div className={storeStatusName === 'Chính thức' ? 'approved-state ml-3' : 'pending-state ml-3'}>{storeStatusName}</div>;
              return storeStatusName;
            },
          },
        ],
      },
      {
        title: translate('storeCheckerReports.Checker'),
        children: [
          {
            title: translate('storeCheckerReports.checkIn'),
            key: nameof(dataSource[0].checkIn),
            dataIndex: nameof(dataSource[0].checkIn),
            ellipsis: true,
            align: 'left',
            width: 100,
            render(...[checkIn, record, rowIndex]) {
              if (record.title) {
                return renderCell(checkIn, record, 10, 0, rowIndex, 0, 1);
              }
              return handleFormatTime(checkIn);
            },
          },
          {
            title: translate('storeCheckerReports.checkOut'),
            key: nameof(dataSource[0].checkOut),
            dataIndex: nameof(dataSource[0].checkOut),
            ellipsis: true,
            align: 'left',
            width: 100,
            render(...[checkOut, record, rowIndex]) {
              if (record.title) {
                return renderCell(checkOut, record, 11, 0, rowIndex, 0, 1);
              }
              return handleFormatTime(checkOut);
            },
          },
          {
            title: translate('storeCheckerReports.duration'),
            key: nameof(dataSource[0].duaration),
            dataIndex: nameof(dataSource[0].duaration),
            ellipsis: true,
            align: 'left',
            width: 100,
            render(...[duaration, record, rowIndex]) {
              if (record.title) {
                return renderCell(duaration, record, 12, 0, rowIndex, 0, 1);
              }
              return duaration;
            },
          },
          {
            title: (
              <>
                <Tooltip
                  title={translate('storeCheckerReports.checkInDistance')}
                >
                  {translate('storeCheckerReports.checkInDistance')}
                </Tooltip>
              </>
            ),
            key: nameof(dataSource[0].checkInDistance),
            dataIndex: nameof(dataSource[0].checkInDistance),
            ellipsis: true,
            align: 'left',
            width: 100,
            render(...[checkInDistance, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  checkInDistance,
                  record,
                  13,
                  0,
                  rowIndex,
                  0,
                  1,
                );
              }
              return checkInDistance;
            },
          },
          {
            title: (
              <>
                <Tooltip
                  title={translate('storeCheckerReports.checkOutDistance')}
                >
                  {translate('storeCheckerReports.checkOutDistance')}
                </Tooltip>
              </>
            ),
            key: nameof(dataSource[0].checkOutDistance),
            dataIndex: nameof(dataSource[0].checkOutDistance),
            ellipsis: true,
            align: 'left',
            width: 100,
            render(...[checkOutDistance, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  checkOutDistance,
                  record,
                  14,
                  0,
                  rowIndex,
                  0,
                  1,
                );
              }
              return checkOutDistance;
            },
          },
          // {
          //   title: translate('storeCheckerReports.device'),
          //   key: nameof(dataSource[0].deviceName),
          //   dataIndex: nameof(dataSource[0].deviceName),
          //   ellipsis: true,
          //   align: 'left',
          //   width: 100,
          //   render(...[deviceName, record, rowIndex]) {
          //     if (record.title) {
          //       return renderCell(deviceName, record, 14, 0, rowIndex, 0, 1);
          //     }
          //     return deviceName;
          //   },
          // },
          {
            title: translate('storeCheckerReports.planned'),
            key: nameof(dataSource[0].planned),
            dataIndex: nameof(dataSource[0].planned),
            ellipsis: true,
            width: 110,
            align: 'center',
            render(...[planned, record, rowIndex]) {
              if (record.title) {
                return renderCell(planned, record, 15, 0, rowIndex, 0, 1);
              }
              return handleFormatBoolean(planned);
            },
          },
          {
            title: translate('storeCheckerReports.imageCounter'),
            key: nameof(dataSource[0].imageCounter),
            dataIndex: nameof(dataSource[0].imageCounter),
            ellipsis: true,
            align: 'right',
            width: 100,
            render(...[imageCounter, record, rowIndex]) {
              if (record.title) {
                return renderCell(imageCounter, record, 16, 0, rowIndex, 0, 1);
              }
              return imageCounter;
            },
          },
          {
            title: translate('storeCheckerReports.salesOrder'),
            key: nameof(dataSource[0].salesOrderCounter),
            dataIndex: nameof(dataSource[0].salesOrderCounter),
            ellipsis: true,
            width: 100,
            align: 'right',
            render(...[salesOrderCounter, record, rowIndex]) {
              if (record.title) {
                return renderCell(
                  salesOrderCounter,
                  record,
                  17,
                  0,
                  rowIndex,
                  0,
                  1,
                );
              }
              return formatNumber(salesOrderCounter);
            },
          },
          {
            title: translate('storeCheckerReports.closed'),
            key: nameof(dataSource[0].closed),
            dataIndex: nameof(dataSource[0].closed),
            ellipsis: true,
            width: 110,
            align: 'center',
            render(...[closed, record, rowIndex]) {
              if (record.title) {
                return renderCell(closed, record, 18, 0, rowIndex, 0, 1);
              }
              return closed;
            },
          },
        ],
      },
    ];
  }, [
    dataSource,
    translate,
    formatWeekDays,
    handleFormatBoolean,
    handleFormatTime,
  ]);

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
        title={translate('storeCheckerReports.master.title')}
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
                    label={translate('storeCheckerReports.organization')}
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
                      getList={
                        storeCheckerReportRepository.filterListOrganization
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
                    label={translate('storeCheckerReports.displayName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={storeCheckerReportRepository.filterListAppUser}
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
              {validAction('filterListStoreType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerReports.storeType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeTypeId))}
                      getList={storeCheckerReportRepository.filterListStoreType}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      searchField={nameof(storeTypeFilter.name)}
                      searchType={nameof(storeTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'storeCheckerReports.placeholder.storeType',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerReports.storeGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeGroupingId}
                      filterType={nameof(filter.storeGroupingId.equal)}
                      value={filter.storeGroupingId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeGroupingId),
                      )}
                      getList={
                        storeCheckerReportRepository.filterListStoreGrouping
                      }
                      modelFilter={storeGroupingFilter}
                      setModelFilter={setStoreGroupingFilter}
                      searchField={nameof(storeGroupingFilter.name)}
                      searchType={nameof(storeGroupingFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'storeCheckerReports.placeholder.storeGrouping',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerReports.storeName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeId))}
                      getList={storeCheckerReportRepository.filterListStore}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      isReset={resetStore}
                      setIsReset={setResetStore}
                      placeholder={translate(
                        'storeCheckerReports.placeholder.storeName',
                      )}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('storeCheckerReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.checkIn))}
                    placeholder={[
                      translate('storeCheckerReports.placeholder.startDate'),
                      translate('storeCheckerReports.placeholder.endDate'),
                    ]}
                  />
                  {/* <AdvancedRangeFilter
                    filterType={nameof(dateFilter.range)}
                    filter={dateFilter}
                    onChange={handleDateFilter(nameof(filter.checkIn))}
                    disabledDate={disabledDate}
                    placeholder={[
                      translate('storeCheckerReports.placeholder.startDate'),
                      translate('storeCheckerReports.placeholder.endDate'),
                    ]}
                  /> */}
                </FormItem>
              </Col>
              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('storeCheckerReports.storeStatus')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        storeCheckerReportRepository.filterListStoreStatus
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
              {validAction('filterListCheckingPlanStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('storeCheckerReports.checkingPlanStatus')}
                  >
                    <AdvancedIdFilter
                      filter={filter.checkingPlanStatusId}
                      filterType={nameof(filter.checkingPlanStatusId.equal)}
                      value={filter.checkingPlanStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.checkingPlanStatusId),
                      )}
                      getList={
                        storeCheckerReportRepository.filterListCheckingPlanStatus
                      }
                      modelFilter={checkingPlanStatusFilter}
                      setModelFilter={setCheckingPlanStatusFilter}
                      searchField={nameof(checkingPlanStatusFilter.name)}
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
const transformMethod = (item: StoreCheckerReport) => {
  /* {organizationName, saleEmployee} => [{title: 'HCM}, {title: undefined, username, displayName}, {title: undefined, username, displayName}] */
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new StoreCheckerReportDataTable(),
    title: item.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };

  const flattenByStoreCheckingGroup = flattenData(
    item.saleEmployees,
    'storeCheckingGroupByDates',
  ); // flatten by storeCheckingGrouping

  const flattenByStoreChecking = flattenData(
    flattenByStoreCheckingGroup,
    'storeCheckings',
  ).map(
    item =>
      ({ ...item, rowSpan: 0, key: uuidv4() } as StoreCheckerReportDataTable),
  ); // flatten by storeChecking

  if (flattenByStoreChecking.length > 0) {
    return [
      ...datalist,
      ...groupRowByField(
        flattenByStoreChecking, // dataSource
        nameof(item.saleEmployees[0].displayName), // groupBy field
        item.saleEmployees[0].displayName, // displayName
      ), // group dataSource by displayName
    ];
  }
  return datalist;
};

const renderCell = (
  value: any,
  record: StoreCheckerReportDataTable,
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
export default StoreCheckerReportView;
