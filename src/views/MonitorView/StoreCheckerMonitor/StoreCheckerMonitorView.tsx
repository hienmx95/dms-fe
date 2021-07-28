import { Card, Modal, Table } from 'antd';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_STORE_CHECKER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { STORE_CHECKED_REPORT_ROUTE } from 'config/route-consts';
import { INF_CONTAINER_HEIGHT, STANDARD_DATE_TIME_FORMAT } from 'core/config';
import { formatDate } from 'core/helpers/date-time';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { AppUserFilter } from 'models/AppUserFilter';
import { EnumListFilter } from 'models/EnumListFilter';
import {
  StoreCheckerMonitor,
  StoreCheckerMonitorFilter,
  StoreChecking,
  StoreCheckingTableData,
} from 'models/monitor';
import {
  StoreCheckerDetail,
  StoreCheckerDetailTableData,
  StoreCheckerMonitorDetailInfo,
} from 'models/monitor/StoreCheckerDetail';
import { SaleEmployee } from 'models/monitor/StoreCheckerMonitor';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StoreCheckerReportFilter } from 'models/report/StoreCheckerReportFilter';
import moment, { Moment } from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Monitor.scss';
import { monitorService } from '../MonitorService';
import { ImagePreviewFilter } from '../SalemansMonitor/SalemanDetailPopup';
import StoreCheckerDetailPopup from './StoreCheckerDetailPopup';
import { storeCheckerRepository } from './StoreCheckerRepository';
import queryString from 'query-string';
import { flatten } from 'core/helpers/json';
import { DateFilter } from 'core/filters';

const { Item: FormItem } = Form;

function StoreCheckerMonitorView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'monitor-store-checker',
    API_STORE_CHECKER_ROUTE,
  );
  const [
    filter,
    setFilter,
    list,
    setList,
    setLoadList,
    loading,
    setLoading,
    total,
    ,
    isReset,
    setIsReset,
    handleReset,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    dateFilter,
    setDateFilter,
  ] = monitorService.useMasterList<
    StoreCheckerMonitor,
    StoreCheckerMonitorFilter
  >(
    StoreCheckerMonitorFilter,
    storeCheckerRepository.count,
    storeCheckerRepository.list,
    true,
    'checkIn',
  );

  // const defaultFilter: StoreCheckerMonitorFilter = useMemo(
  //   () => ({
  //     ...filter,
  //     checkIn: {
  //       greaterEqual:
  //         typeof filter.checkIn.greaterEqual === 'undefined'
  //           ? moment()
  //           : filter.checkIn.greaterEqual,
  //       lessEqual:
  //         typeof filter.checkIn.lessEqual === 'undefined'
  //           ? moment()
  //           : filter.checkIn.lessEqual,
  //     },
  //   }),
  //   [filter],
  // );

  const [
    ,
    ,
    ,
    handleSearch,
    handleFilterScroll,
    ,
    ,
    ,
    ,
    handleIndepentFilter,
    handleResetScroll,
  ] = crudService.useTableScroll(
    list,
    setList,
    filter,
    setFilter,
    setLoading,
    storeCheckerRepository.list,
    total,
    setLoadList,
    loading,
  );

  const [dataSource] = monitorService.useMasterDataSource<
    StoreCheckerMonitor,
    StoreCheckingTableData
  >(list, transformObjecToList);

  const [imagePreviewFilter, setImagePreviewFilter] = React.useState<
    ImagePreviewFilter
  >({
    date: null,
    storeId: null,
    saleEmployeeId: null,
    isOpen: false,
  }); // for build link to storeImage with query filter

  const [
    isOpen,
    handleOpenPreview,
    handleClosePreview,
    previewList,
    previewLoading,
  ] = monitorService.useMasterPreview<
    StoreCheckerDetail,
    StoreCheckerDetailTableData
  >(storeCheckerRepository.get, transformDetailObjectToList);

  const handleOpenImagePreview = React.useCallback(
    (saleEmployeeId: number, date: Moment) => {
      return () => {
        setImagePreviewFilter({
          saleEmployeeId,
          date: date.format(STANDARD_DATE_TIME_FORMAT), // format Moment to queryString
          isOpen: true,
        }); // omit storeId because we not yet choose item to preview
        handleOpenPreview(saleEmployeeId, date);
      };
    },
    [handleOpenPreview],
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

  const [imageFilter, setImageFilter] = React.useState<EnumListFilter>(
    new EnumListFilter(),
  );
  const [saleOrderFilter, setSaleOrderFilter] = React.useState<EnumListFilter>(
    new EnumListFilter(),
  );

  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    storeCheckerRepository.export,
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
  }, [setFilter, filter, dates, handleExport, translate, setDateFilter]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'checkIn') {
          filter.checkIn.lessEqual = f.lessEqual;
          filter.checkIn.greaterEqual = undefined;
          filter.checkIn.greaterEqual = f.greaterEqual;
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
    [filter, handleSearch, setFilter, handleExport, translate, setDateFilter],
  );

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
  }, [handleSearch, translate, handleExport, dateFilter]);

  const handleGoStoreCheckerReport = React.useCallback(
    (checkingPlanStatusId: string, record) => {
      const url = document.URL;
      const urlTmp = url.split('/dms/');
      const startDate = record?.date.startOf('day').toDate();
      const endDate = record?.date.startOf('day').toDate();
      const storeCheckerReportFilter = {
        ...new StoreCheckerReportFilter(),
        checkingPlanStatusId: { equal: checkingPlanStatusId },
        appUserId: { equal: record?.saleEmployeeId },
        startDate,
        endDate,
      };
      window.open(
        `${urlTmp[0]}${STORE_CHECKED_REPORT_ROUTE}?${queryString.stringify(
          flatten(storeCheckerReportFilter),
        )}`,
      );
    },
    [],
  );

  const columns: ColumnProps<StoreCheckingTableData>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render(...[, record]) {
            if (record.title) {
              return renderCell(record.title, record, 0, 12);
            }
            return (
              <div className="text-center table-row">{record.indexInTable}</div>
            );
          },
        },
        {
          title: translate('storeCheckerMonitors.username'),
          key: nameof(dataSource[0].username),
          dataIndex: nameof(dataSource[0].username),
          render(...[username, record]) {
            return renderCell(username, record, 1);
          },
        },
        {
          title: translate('storeCheckerMonitors.displayName'),
          key: nameof(dataSource[0].displayName),
          dataIndex: nameof(dataSource[0].displayName),
          render(...[displayName, record]) {
            return renderCell(displayName, record, 2);
          },
        },
        {
          title: (
            <div className="text-center">
              {translate('storeCheckerMonitors.date')}
            </div>
          ),
          ellipsis: true,
          key: nameof(dataSource[0].date),
          dataIndex: nameof(dataSource[0].date),
          render(...[date, record]) {
            if (record.title) {
              return renderCell(date, record, 4);
            }
            return (
              <div className="text-center text-plan table-row">
                {formatDate(date)}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeCheckerMonitors.planCounter')}
            </div>
          ),
          key: nameof(dataSource[0].planCounter),
          dataIndex: nameof(dataSource[0].planCounter),
          ellipsis: true,
          render(...[planCounter, record]) {
            if (record.title) {
              return renderCell(planCounter, record, 5);
            }
            return (
              <div className="text-right text-plan table-row">
                {planCounter}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeCheckerMonitors.internalCounter')}
            </div>
          ),
          key: nameof(dataSource[0].internalCounter),
          dataIndex: nameof(dataSource[0].internalCounter),
          ellipsis: true,
          render(...[internalCounter, record]) {
            if (record.title) {
              return renderCell(internalCounter, record, 6);
            }
            return (
              <div className="text-right text-highlight table-row">
                <div
                  className="code-checking"
                  onClick={() => handleGoStoreCheckerReport('1', record)}
                >
                  {internalCounter}
                </div>
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeCheckerMonitors.externalCounter')}
            </div>
          ),
          key: nameof(dataSource[0].externalCounter),
          dataIndex: nameof(dataSource[0].externalCounter),
          ellipsis: true,
          render(...[externalCounter, record]) {
            if (record.title) {
              return renderCell(externalCounter, record, 7);
            }
            return (
              <div className="text-right text-highlight table-row">
                <div
                  className="code-checking"
                  onClick={() => handleGoStoreCheckerReport('2', record)}
                >
                  {externalCounter}
                </div>
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeCheckerMonitors.unchecking')}
            </div>
          ),
          key: nameof(dataSource[0].unchecking),
          dataIndex: nameof(dataSource[0].unchecking),
          ellipsis: true,
          render(...[unchecking, record]) {
            if (record.title) {
              return renderCell(unchecking, record, 7);
            }
            return (
              <div
                className="text-right text-highlight table-row "
                onClick={() => handleGoStoreCheckerReport('', record)}
              >
                {unchecking}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeCheckerMonitors.imageCounter')}
            </div>
          ),
          key: nameof(dataSource[0].imageCounter),
          dataIndex: nameof(dataSource[0].imageCounter),
          ellipsis: true,
          render(...[imageCounter, record]) {
            if (record.title) {
              return renderCell(imageCounter, record, 8);
            }
            return (
              <div className="text-right text-highlight table-row">
                {imageCounter}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeCheckerMonitors.salesOrderCounter')}
            </div>
          ),
          key: nameof(dataSource[0].salesOrderCounter),
          dataIndex: nameof(dataSource[0].salesOrderCounter),
          ellipsis: true,
          render(...[salesOrderCounter, record]) {
            if (record.title) {
              return renderCell(salesOrderCounter, record, 9);
            }
            return (
              <div className="text-right text-highlight table-row">
                {salesOrderCounter}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeCheckerMonitors.revenueCounter')}
            </div>
          ),
          key: nameof(dataSource[0].revenueCounter),
          dataIndex: nameof(dataSource[0].revenueCounter),
          ellipsis: true,
          render(...[revenueCounter, record]) {
            if (record.title) {
              return renderCell(revenueCounter, record, 10);
            }
            return (
              <div className="text-right text-highlight table-row">
                {formatNumber(revenueCounter)}
              </div>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(dataSource[0].saleEmployeeId),
          width: generalColumnWidths.actions,
          align: 'center',
          render(...[saleEmployeeId, record]) {
            if (record.title) {
              return renderCell(record.title, record, 11);
            }
            return (
              <div className="d-flex justify-content-center table-row button-action-table">
                {validAction('get') && (
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleOpenImagePreview(
                      saleEmployeeId, // pass saleEmployeeId to filter
                      record.date ? record.date : moment(), // pass date to filter
                    )}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                )}
              </div>
            );
          },
        },
      ];
    },

    // tslint:disable-next-line:max-line-length
    [
      dataSource,
      handleOpenImagePreview,
      translate,
      validAction,
      handleGoStoreCheckerReport,
    ],
  );

  return (
    <div className="page master-page monitor-master store-checker-master">
      <Card
        title={translate('storeCheckerMonitors.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {/* organization filter */}
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerMonitors.organization')}
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
                      )}
                      getList={storeCheckerRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {/* username filter */}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerMonitors.username')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={storeCheckerRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
              {/* DateTime filter */}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeCheckerMonitors.date')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filterType={nameof(dateFilter.range)}
                    filter={dateFilter}
                    onChange={handleDateFilter(nameof(filter.checkIn))}
                    className="w-100 mr-1"
                    placeholder={[
                      translate('storeCheckerMonitors.placeholder.startDate'),
                      translate('storeCheckerMonitors.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {/* checking filter */}
              {/* {validAction('filterListChecking') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerMonitors.checking')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.checking}
                      filterType={nameof(filter.checking.equal)}
                      value={filter.checking.equal}
                      onChange={handleFilterScroll(nameof(filter.checking))}
                      getList={storeCheckerRepository.filterListChecking}
                      modelFilter={checkingFilter}
                      setModelFilter={setCheckingFilter}
                      searchField={nameof(checkingFilter.name)}
                      searchType={nameof(checkingFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )} */}
              {/* image filter */}
              {validAction('filterListImage') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerMonitors.image')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.image}
                      filterType={nameof(filter.image.equal)}
                      value={filter.checking.equal}
                      onChange={handleFilterScroll(nameof(filter.image))}
                      getList={storeCheckerRepository.filterListImage}
                      modelFilter={imageFilter}
                      setModelFilter={setImageFilter}
                      searchField={nameof(imageFilter.name)}
                      searchType={nameof(imageFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {/* saleOrder filter */}
              {validAction('filterListSalesOrder') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeCheckerMonitors.saleOrder')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.salesOrder}
                      filterType={nameof(filter.salesOrder.equal)}
                      value={filter.checking.equal}
                      onChange={handleFilterScroll(nameof(filter.salesOrder))}
                      getList={storeCheckerRepository.filterListSalesOrder}
                      modelFilter={saleOrderFilter}
                      setModelFilter={setSaleOrderFilter}
                      searchField={nameof(saleOrderFilter.name)}
                      searchType={nameof(saleOrderFilter.name.contain)}
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
                  {translate(generalLanguageKeys.actions.filter)}
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
        <div className="d-flex justify-content-between p-3">
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
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Table
            className="store-checker-table table-merge"
            dataSource={dataSource}
            columns={columns}
            bordered
            size="small"
            tableLayout="fixed"
            loading={loading}
            pagination={false}
          />
        </div>
      </Card>
      <StoreCheckerDetailPopup
        isOpen={isOpen}
        isLoading={previewLoading}
        onClose={handleClosePreview}
        previewList={previewList as StoreCheckerDetailTableData[]}
        filter={imagePreviewFilter}
      />
    </div>
  );
}

// mapper for master dataSource
const transformObjecToList = (storeChecker: StoreCheckerMonitor) => {
  // each storeChecking map for a list
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new StoreCheckingTableData(),
    title: storeChecker.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  storeChecker.saleEmployees?.forEach((epmloyee: SaleEmployee) => {
    epmloyee.storeCheckings?.forEach(
      (storeChecking: StoreChecking, index: number, array) => {
        let tableItem = new StoreCheckingTableData();
        const {
          planCounter,
          internalCounter,
          externalCounter,
          imageCounter,
          salesOrderCounter,
          revenueCounter,
          unchecking,
          date,
        } = storeChecking;
        const { username, displayName, saleEmployeeId } = epmloyee;
        if (index === 0) {
          tableItem.rowSpan = array.length;
        } else {
          tableItem.rowSpan = 0;
        }
        tableItem = {
          ...tableItem,
          planCounter,
          internalCounter,
          externalCounter,
          imageCounter,
          salesOrderCounter,
          revenueCounter,
          date,
          username,
          displayName,
          unchecking,
          saleEmployeeId,
          key: uuidv4(),
        };
        datalist.push(tableItem);
      },
    );
  });
  return datalist;
};

// mapper for detail modal data
const transformDetailObjectToList = (
  storeCheckerDetail: StoreCheckerDetail,
) => {
  const { storeCode, storeName, storeId, imageCounter } = storeCheckerDetail;
  const dataList = [];
  storeCheckerDetail.infoes?.forEach(
    (info: StoreCheckerMonitorDetailInfo, index) => {
      const {
        indirectSalesOrderCode,
        sales,
        imagePath,
        storeProblemCode,
        competitorProblemCode,
        problemId,
        problemCode,
      } = info;
      let rowSpan = 0;
      if (index === 0 && storeCheckerDetail.infoes?.length) {
        rowSpan = storeCheckerDetail.infoes.length;
      }
      let tableItem = new StoreCheckerDetailTableData();
      tableItem = {
        ...tableItem,
        storeCode,
        storeName,
        storeId,
        indirectSalesOrderCode,
        sales,
        imagePath,
        imageCounter,
        storeProblemCode,
        competitorProblemCode,
        problemId,
        problemCode,
        rowSpan,
        key: uuidv4(),
      };
      dataList.push(tableItem);
    },
  );
  return dataList as StoreCheckerDetailTableData[];
};

const renderCell = (
  value: any,
  record: StoreCheckingTableData,
  colIndex: number,
  colNumber?: number,
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
  return {
    children: <div className="table-row">{value}</div>,
    props: {
      rowSpan: record.rowSpan ? record.rowSpan : 0,
      colSpan: 1,
    },
  };
};

export default StoreCheckerMonitorView;
