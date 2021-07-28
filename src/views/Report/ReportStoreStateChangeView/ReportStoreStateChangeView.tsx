import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_REPORT_STATE_CHANGE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { DateFilter } from 'core/filters/DateFilter';
import { crudService } from 'core/services';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StoreFilter } from 'models/report/StoreFilter';
import { StoreStateChangeReport } from 'models/report/StoreStateChangeReport';
import { StoreStateChangeReportFilter } from 'models/report/StoreStateChangeReportFilter';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import '../Report.scss';
import { reportService } from '../ReportService';
import { reportStoreStateChangeRepository } from './ReportStoreStateChangeRepository';

const { Item: FormItem } = Form;
function ReportStoreStateChangeView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'report-store-state-change',
    API_REPORT_STATE_CHANGE_ROUTE,
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
    StoreStateChangeReport,
    StoreStateChangeReportFilter
  >(
    StoreStateChangeReportFilter,
    reportStoreStateChangeRepository.list,
    reportStoreStateChangeRepository.count,
    'createdAt',
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
    reportStoreStateChangeRepository.list,
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

  const [previousStatusFilter, setPreviousStatusFilter] = React.useState<
    StoreStatusFilter
  >(new StoreStatusFilter());

  const [laterStatusFilter, setLaterStatusFilter] = React.useState<
    StoreStatusFilter
  >(new StoreStatusFilter());

  const [resetStore, setResetStore] = React.useState<boolean>(false);
  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    reportStoreStateChangeRepository.export,
    filter,
  );

  React.useEffect(() => {
    if (filter.createdAt.lessEqual && dates) {
      setDateFilter({ ...filter.createdAt });
      setDates(false);
    }
  }, [filter, setDateFilter, dates, handleExport]);
  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'createdAt') {
          filter.createdAt.lessEqual = f.lessEqual;
          filter.createdAt.greaterEqual = undefined;
          filter.createdAt.greaterEqual = f.greaterEqual;
          if (f.lessEqual && f.greaterEqual) {
            setFilter({ ...filter });
            handleSearch();
          }
        }
        setDateFilter({ ...f });
      };
    },
    [filter, handleSearch, setFilter, setDateFilter],
  );

  const handleResetFilter = React.useCallback(() => {
    handleResetScroll(handleReset);
    setResetStore(true);
  }, [handleResetScroll, handleReset]);

  return (
    <div className="page master-page kpi-report-master">
      <Card
        title={translate('storeStateChangeReports.master.title')}
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
                    label={translate('storeStateChangeReports.organization')}
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
                        reportStoreStateChangeRepository.filterListOrganization
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
                    label={translate('storeStateChangeReports.storeName')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeId))}
                      getList={reportStoreStateChangeRepository.filterListStore}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      isReset={resetStore}
                      setIsReset={setResetStore}
                      placeholder={translate(
                        'storeStateChangeReports.placeholder.store',
                      )}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeStateChangeReports.address')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.storeAddress.contain)}
                    filter={filter.storeAddress}
                    onChange={handleFilterScroll(nameof(filter.storeAddress))}
                    className="w-100"
                    placeholder={translate(
                      'storeStateChangeReports.placeholder.address',
                    )}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('storeStateChangeReports.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.createdAt))}
                    placeholder={[
                      translate(
                        'storeStateChangeReports.placeholder.startDate',
                      ),
                      translate('storeStateChangeReports.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              {validAction('filterListStoreStatusHistoryType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('storeStateChangeReports.previousStatus')}
                  >
                    <AdvancedIdFilter
                      filter={filter.previousStoreStatusId}
                      filterType={nameof(filter.previousStoreStatusId.equal)}
                      value={filter.previousStoreStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.previousStoreStatusId),
                      )}
                      getList={
                        reportStoreStateChangeRepository.filterListStoreStatusHistoryType
                      }
                      modelFilter={previousStatusFilter}
                      setModelFilter={setPreviousStatusFilter}
                      searchField={nameof(previousStatusFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreStatusHistoryType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('storeStateChangeReports.laterStatus')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeStatusId),
                      )}
                      getList={
                        reportStoreStateChangeRepository.filterListStoreStatusHistoryType
                      }
                      modelFilter={laterStatusFilter}
                      setModelFilter={setLaterStatusFilter}
                      searchField={nameof(laterStatusFilter.name)}
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
        </Row>
        {/* )} */}
      </Card>
    </div>
  );
}
// const transformMethod = (item: StoreStateChangeReport) => {
//   const datalist = [];
//   // fist record is title record
//   datalist[0] = {
//     ...new StoreStateChangeReportDataTable(),
//     title: item.organizationName,
//     key: uuidv4(),
//     rowSpan: 1,
//   };
//   let storeStatusName: string;
//   item.stores?.forEach((store: Store) => {
//     const { code, name, phone, address, storeStatus, codeDraft } = store;
//     storeStatusName = storeStatus.name;

//     store.contents?.forEach((content: Problem, index: number) => {
//       let rowSpan = 0;
//       if (index === 0) {
//         rowSpan = store.contents ? store.contents.length : 0;
//       }
//       const {
//         problemTypeName,
//         waitingCounter,
//         processCounter,
//         completedCounter,
//         total,
//         problemTypeId,
//       } = content;

//       datalist.push({
//         ...new StoreStateChangeReportDataTable(),
//         key: uuidv4(),
//         code,
//         codeDraft,
//         name,
//         address,
//         phone,
//         storeStatusName,
//         problemTypeName,
//         waitingCounter,
//         processCounter,
//         completedCounter,
//         total,
//         problemTypeId,
//         rowSpan,
//       });
//     });
//   });

//   return datalist;
// };

// const renderCell = (
//   value: any,
//   record: StoreStateChangeReportDataTable,
//   colIndex: number,
//   colNumber?: number,
//   rowIndex?: number,
//   firstColNumber?: number, // colSpan if first row is total
//   rowNumber?: number,
// ) => {
//   // check if record has title or not
//   if (record.title) {
//     let colSpan = 0;
//     // if colIndex = 0; set colSpan = number of column
//     if (colIndex === 0) {
//       colSpan = colNumber ? colNumber : 1;
//     }
//     return {
//       children: <div className="table-title-row table-row">{value}</div>,
//       props: {
//         rowSpan: 1,
//         colSpan,
//       },
//     };
//   }
//   // base on type of value, we align text right, left or center
//   if (rowIndex === 0) {
//     let alignText = 'text-left';
//     // if typeof value === number, format it
//     if (typeof value === 'number') {
//       alignText = 'text-right';
//       value = formatNumber(value);
//     }
//     return {
//       children: <span className={`${alignText} table-row`}>{value}</span>,
//       props: {
//         rowSpan: 1,
//         colSpan: firstColNumber,
//       },
//     };
//   }
//   let alignText = 'text-left';
//   // if typeof value === number, format it
//   if (typeof value === 'number') {
//     alignText = 'text-right';
//     value = formatNumber(value);
//   }
//   if (colIndex === 0) {
//     alignText = 'text-center';
//   }
//   return {
//     children: <span className={`${alignText} table-row`}>{value}</span>,
//     props: {
//       rowSpan: rowNumber ? rowNumber : 0,
//       colSpan: 1,
//     },
//   };
// };
export default ReportStoreStateChangeView;
