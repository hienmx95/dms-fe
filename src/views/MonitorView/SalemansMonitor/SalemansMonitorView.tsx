import { Card, Col, Form, Row, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_SALEMANS_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import {
  STORE_CHECKED_REPORT_ROUTE,
  STORE_UN_CHECKED_REPORT_ROUTE,
} from 'config/route-consts';
import { STANDARD_DATE_TIME_FORMAT } from 'core/config';
import { DateFilter } from 'core/filters';
import { crudService } from 'core/services';
import { formatNumber } from 'helpers/number-format';
import { AppUserFilter } from 'models/AppUserFilter';
import { SalemansTableData } from 'models/monitor';
import {
  SalemansDetail,
  SalemansDetailInfo,
  SalemansDetailTableData,
} from 'models/monitor/SalemansDetail';
import {
  SaleEmployee,
  SalemansMonitor,
  StoreChecking,
} from 'models/monitor/SalemansMonitor';
import { SalemansMonitorFilter } from 'models/monitor/SalemansMonitorFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import moment, { Moment } from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Monitor.scss';
import { monitorService } from '../MonitorService';
import SalemansDetailPopup, { ImagePreviewFilter } from './SalemanDetailPopup';
import { salemansRepository } from './SalemansRepository';
import StoreMonitorMap, { Place } from './StoreMonitorMap';

const { Item: FormItem } = Form;
function SalemansMonitorView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'monitor-salesman',
    API_SALEMANS_ROUTE,
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    setLoadlist,
    loading,
    setLoading,
    total,
    ,
    isReset,
    setIsReset,
    handleReset,
  ] = monitorService.useMasterList<SalemansMonitor, SalemansMonitorFilter>(
    SalemansMonitorFilter,
    salemansRepository.count,
    salemansRepository.list,
    true,
    'checkIn',
  );

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
    salemansRepository.list,
    total,
    setLoadlist,
    loading,
  );

  const [dataSource] = monitorService.useMasterDataSource<
    SalemansMonitor,
    SalemansTableData
  >(list, transformObjecToList);

  const [previewList, setPreviewList] = React.useState<Place[]>([]);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

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
    modelList,
    previewLoading,
  ] = monitorService.useMasterPreview<SalemansDetail, SalemansDetailTableData>(
    salemansRepository.get,
    transformDetailObjectToList,
  ); // service for salemanChecker preview

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

  const handlePreviewStore = React.useCallback(
    (id: number) => {
      return () => {
        if (dataSource.length > 0) {
          const row: SalemansTableData = dataSource.find(
            (item: SalemansTableData) => item.saleEmployeeId === id,
          );
          if (row.storeCheckings?.length > 0) {
            const listPlace: Place[] = row.storeCheckings.map(
              (item: StoreChecking) => ({
                latitude: item.latitude,
                longitude: item.longitude,
                checkIn: item.checkIn,
                checkOut: item.checkOut,
                key: uuidv4(),
                storeName: item.storeName,
                address: item.address,
                imageUrl: item.image,
                saleOrders: item.indirectSalesOrder,
                storeProblems:
                  item.storeProblems?.length > 0 ? item.storeProblems : [],
                storeCompetitors:
                  item.competitorProblems?.length > 0
                    ? item.competitorProblems
                    : [],
              }),
            );
            setPreviewList([...listPlace]);
          }
        }
      };
    },
    [dataSource],
  );
  const averageCenter = React.useMemo(() => {
    const listLength = previewList.filter(
      item => item.latitude !== 0 && item.longitude !== 0,
    ).length;
    if (listLength > 0) {
      const center = previewList.reduce(
        (acc: any, item: Place) => {
          const { latitude, longitude } = item;
          acc.lat = acc.lat + latitude;
          acc.lng = acc.lng + longitude;
          return {
            lat: acc.lat,
            lng: acc.lng,
          };
        },
        { lat: 0, lng: 0 },
      );
      return {
        ...center,
        lat: center.lat / listLength,
        lng: center.lng / listLength,
      };
    }
    return { lat: 21.0278, lng: 105.8342 };
  }, [previewList]);

  const [handleExport] = crudService.useExport(
    salemansRepository.export,
    filter,
  );

  const [handleExportUnChecking] = crudService.useExport(
    salemansRepository.exportUnChecking,
    filter,
  );

  const { search } = useLocation();
  const handleGoStoreCheckerReport = React.useCallback(
    (checkingPlanStatusId: string, saleEmployeeId) => {
      const tmp = search.split('&');
      let checkInLess = null;
      let checkInGreater = null;
      tmp.forEach(item => {
        if (item.includes('checkIn.greaterEqual')) {
          const itemTmp = item.split('?');
          checkInGreater = itemTmp[1];
        }
        if (item.includes('checkIn.lessEqual')) {
          checkInLess = item;
        }
      });

      const url = document.URL;
      const urlTmp = url.split('/dms/');
      if (checkingPlanStatusId) {
        window.open(
          urlTmp[0] +
            STORE_CHECKED_REPORT_ROUTE +
            '?' +
            'appUserId.equal=' +
            saleEmployeeId +
            '&' +
            checkInGreater +
            '&' +
            checkInLess +
            '&checkingPlanStatusId.equal=' +
            checkingPlanStatusId,
        );
      } else {
        window.open(
          urlTmp[0] +
            STORE_CHECKED_REPORT_ROUTE +
            '?' +
            'appUserId.equal=' +
            saleEmployeeId +
            '&' +
            checkInGreater +
            '&' +
            checkInLess,
        );
      }
    },
    [search],
  );

  const handleGoStoreUnCheckerReport = React.useCallback(
    (checkingPlanStatusId: string, saleEmployeeId) => {
      const tmp = search.split('&');
      let checkInLess = null;
      let checkInGreater = null;

      tmp.forEach(item => {
        if (item.includes('checkIn.greaterEqual')) {
          const itemTmp = item.split('?');
          checkInGreater = itemTmp[1].replace('checkIn', 'date');
        }
        if (item.includes('checkIn.lessEqual')) {
          checkInLess = item.replace('checkIn', 'date');
        }
      });

      const url = document.URL;
      const urlTmp = url.split('/dms/');
      if (checkingPlanStatusId) {
        window.open(
          urlTmp[0] +
            STORE_UN_CHECKED_REPORT_ROUTE +
            '?' +
            'appUserId.equal=' +
            saleEmployeeId +
            '&' +
            checkInGreater +
            '&' +
            checkInLess +
            '&checkingPlanStatusId.equal=' +
            checkingPlanStatusId,
        );
      } else {
        window.open(
          urlTmp[0] +
            STORE_UN_CHECKED_REPORT_ROUTE +
            '?' +
            'appUserId.equal=' +
            saleEmployeeId +
            '&' +
            checkInGreater +
            '&' +
            checkInLess,
        );
      }
    },
    [search],
  );

  const columns: ColumnProps<SalemansTableData>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: 60,
          ellipsis: true,
          render(...[, record]) {
            if (record.title) {
              return renderCell(record.title, record, 0, 11);
            }
            return (
              <div className="text-center table-row">{record.indexInTable}</div>
            );
          },
        },
        {
          title: translate('salemansMonitors.username'),
          key: nameof(dataSource[0].username),
          dataIndex: nameof(dataSource[0].username),
          ellipsis: true,
          width: 150,
          render(...[username, record]) {
            if (record.title) {
              return renderCell(username, record, 1);
            }
            return <div className="text-left table-row">{username}</div>;
          },
        },
        {
          title: translate('salemansMonitors.displayName'),
          key: nameof(dataSource[0].displayName),
          dataIndex: nameof(dataSource[0].displayName),
          ellipsis: true,
          width: 150,
          render(...[displayName, record]) {
            if (record.title) {
              return renderCell(displayName, record, 2);
            }
            return <div className="text-left table-row">{displayName}</div>;
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('salemansMonitors.planCounter')}
            </div>
          ),
          key: nameof(dataSource[0].planCounter),
          dataIndex: nameof(dataSource[0].planCounter),
          ellipsis: true,
          width: 100,
          render(...[planCounter, record]) {
            if (record.title) {
              return renderCell(planCounter, record, 3);
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
              {translate('salemansMonitors.internalCounter')}
            </div>
          ),
          key: nameof(dataSource[0].internalCounter),
          dataIndex: nameof(dataSource[0].internalCounter),
          ellipsis: true,
          width: 120,
          render(...[internalCounter, record]) {
            if (record.title) {
              return renderCell(internalCounter, record, 3);
            }
            return (
              <div className="text-right text-highlight table-row">
                <div
                  className="code-checking"
                  onClick={() =>
                    handleGoStoreCheckerReport('1', record?.saleEmployeeId)
                  }
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
              {translate('salemansMonitors.externalCounter')}
            </div>
          ),
          key: nameof(dataSource[0].externalCounter),
          dataIndex: nameof(dataSource[0].externalCounter),
          ellipsis: true,
          width: 120,
          render(...[externalCounter, record]) {
            if (record.title) {
              return renderCell(externalCounter, record, 3);
            }
            return (
              <div className="text-right text-highlight table-row">
                <div
                  className="code-checking"
                  onClick={() =>
                    handleGoStoreCheckerReport('2', record?.saleEmployeeId)
                  }
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
              {translate('salemansMonitors.unchecking')}
            </div>
          ),
          key: nameof(dataSource[0].unchecking),
          dataIndex: nameof(dataSource[0].unchecking),
          ellipsis: true,
          width: 150,
          render(...[unchecking, record]) {
            if (record.title) {
              return renderCell(unchecking, record, 7);
            }
            return (
              <div
                className="text-right text-highlight table-row "
                onClick={() =>
                  handleGoStoreUnCheckerReport('', record?.saleEmployeeId)
                }
              >
                {unchecking}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('salemansMonitors.imageCounter')}
            </div>
          ),
          key: nameof(dataSource[0].imageCounter),
          dataIndex: nameof(dataSource[0].imageCounter),
          ellipsis: true,
          width: 100,
          render(...[imageCounter, record]) {
            if (record.title) {
              return renderCell(imageCounter, record, 5);
            }
            return (
              <div className="text-right text-hightlight table-row">
                {imageCounter}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('salemansMonitors.salesOrderCounter')}
            </div>
          ),
          key: nameof(dataSource[0].salesOrderCounter),
          dataIndex: nameof(dataSource[0].salesOrderCounter),
          ellipsis: true,
          width: 100,
          render(...[salesOrderCounter, record]) {
            if (record.title) {
              return renderCell(salesOrderCounter, record, 6);
            }
            return (
              <div className="text-right text-hightlight table-row">
                {salesOrderCounter}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('salemansMonitors.revenueCounter')}
            </div>
          ),
          key: nameof(dataSource[0].revenue),
          dataIndex: nameof(dataSource[0].revenue),
          ellipsis: true,
          width: 100,
          render(...[revenue, record]) {
            if (record.title) {
              return renderCell(revenue, record, 7);
            }
            return (
              <div className="text-right text-hightlight table-row">
                {formatNumber(revenue)}
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
              return renderCell(record.title, record, 8);
            }
            return (
              <div className="d-flex justify-content-center table-row">
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm"
                      onClick={handleOpenImagePreview(
                        saleEmployeeId, // pass saleEmployeeId to filter
                        filter.checkIn.greaterEqual
                          ? filter.checkIn.greaterEqual
                          : moment(), // pass date to filter
                      )}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}
                <Tooltip title={translate('salemansMonitors.viewStore')}>
                  <button
                    className="btn btn-sm"
                    onClick={handlePreviewStore(saleEmployeeId)}
                  >
                    <i className="tio-home_vs_2_outlined" />
                  </button>
                </Tooltip>
              </div>
            );
          },
        },
      ];
    },

    // tslint:disable-next-line:max-line-length
    [
      dataSource,
      filter.checkIn.greaterEqual,
      handleOpenImagePreview,
      handlePreviewStore,
      translate,
      validAction,
      handleGoStoreCheckerReport,
      handleGoStoreUnCheckerReport,
    ],
  );
  return (
    <div className="page master-page monitor-master">
      <Card
        title={translate('salemansMonitors.master.title')}
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
                    label={translate('salemansMonitors.organization')}
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
                      getList={salemansRepository.filterListOrganization}
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
                    label={translate('salemansMonitors.username')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={salemansRepository.filterListAppUser}
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
                  label={translate('salemansMonitors.date')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={
                      typeof filter.checkIn.greaterEqual !== 'undefined'
                        ? filter.checkIn
                        : { ...new DateFilter(), greaterEqual: moment() }
                    }
                    filterType={nameof(filter.checkIn.greaterEqual)}
                    onChange={handleFilterScroll(nameof(filter.checkIn))}
                    className="w-100 mr-1"
                    placeholder={translate('general.placeholder.date')}
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
                  onClick={handleSearch}
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
        <Row style={{ padding: '0 10px' }}>
          <Col span={16} style={{ padding: '0 10px' }}>
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
                {validAction('exportUnchecking') && (
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExportUnChecking}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate('salemansMonitors.export.unChecking')}
                  </button>
                )}
              </div>
            </div>
            {/* scroll inifite table */}
            <div
              className="infinite-container-salemans"
              style={{
                height: 'auto',
                overflowY: 'auto',
                overflowX: 'auto',
              }}
            >
              <Table
                key={nameof(dataSource[0].key)}
                rowKey={nameof(dataSource[0].key)}
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={false}
                className="salemans-monitor-table"
              />
            </div>
          </Col>
          <Col span={8} style={{ padding: '0 10px' }}>
            <div style={{ height: 600, marginTop: 18 }}>
              <StoreMonitorMap
                places={previewList}
                center={averageCenter}
                defaultZoom={8}
              />
            </div>
          </Col>
        </Row>
      </Card>
      <SalemansDetailPopup
        isOpen={isOpen}
        isLoading={previewLoading}
        onClose={handleClosePreview}
        previewList={modelList as SalemansDetailTableData[]}
        filter={imagePreviewFilter}
      />
    </div>
  );
}

const transformObjecToList = (storeChecker: SalemansMonitor) => {
  // each storeChecking map for a list {username, planCounter, CheckinCounter, imageCounter, saleOrderCounter, revenueCounter}
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new SalemansTableData(),
    title: storeChecker.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  storeChecker.saleEmployees?.forEach((epmloyee: SaleEmployee) => {
    const {
      username,
      displayName,
      saleEmployeeId,
      organizationName,
      planCounter,
      internalCounter,
      externalCounter,
      salesOrderCounter,
      imageCounter,
      revenue,
      storeCheckings,
      unchecking,
    } = epmloyee;
    datalist.push({
      ...new SalemansTableData(),
      key: uuidv4(),
      username,
      displayName,
      organizationName,
      planCounter,
      saleEmployeeId,
      internalCounter,
      externalCounter,
      salesOrderCounter,
      imageCounter,
      unchecking,
      revenue,
      storeCheckings,
    });
  });

  return datalist;
};

const transformDetailObjectToList = (storeCheckerDetail: SalemansDetail) => {
  const { storeCode, storeName, storeId, imageCounter } = storeCheckerDetail;
  const dataList = [];
  storeCheckerDetail.infoes?.forEach((info: SalemansDetailInfo, index) => {
    const {
      indirectSalesOrderCode,
      sales,
      imagePath,
      problemCode,
      competitorProblemCode,
      problemId,
      competitorProblemId,
    } = info;
    let rowSpan = 0;
    if (index === 0 && storeCheckerDetail.infoes?.length) {
      rowSpan = storeCheckerDetail.infoes.length;
    }
    let tableItem = new SalemansDetailTableData();
    tableItem = {
      ...tableItem,
      storeCode,
      storeName,
      storeId,
      indirectSalesOrderCode,
      sales,
      imagePath,
      imageCounter,
      problemCode,
      competitorProblemCode,
      problemId,
      competitorProblemId,
      rowSpan,
      key: uuidv4(),
    };
    dataList.push(tableItem);
  });
  return dataList as SalemansDetailTableData[];
};

const renderCell = (
  value: any,
  record: SalemansTableData,
  colIndex: number,
  colNumber?: number,
) => {
  if (record.title) {
    let colSpan = 0;
    if (colIndex === 0) colSpan = colNumber ? colNumber : 1; // if colIndex = 0; set colSpan = number of column
    return {
      children: <div className="table-title-row table-row">{value}</div>,
      props: {
        rowSpan: 1,
        colSpan,
      },
    };
  } // check if record has title or not
  return {
    children: <div className="table-row">{value}</div>,
    props: {
      rowSpan: record.rowSpan ? record.rowSpan : 0,
      colSpan: 1,
    },
  };
};

export default SalemansMonitorView;
