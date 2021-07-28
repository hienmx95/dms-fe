import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE } from 'config/route-consts';
import { DateFilter } from 'core/filters';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERoute } from 'models/ERoute';
import { ERouteChangeRequest } from 'models/ERouteChangeRequest';
import { ERouteChangeRequestFilter } from 'models/ERouteChangeRequestFilter';
import { ERouteType } from 'models/ERouteType';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { StoreFilter } from 'models/StoreFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteChangeRequestRepository } from '../ERouteChangeRequestRepository';
import './ERouteChangeRequestMaster.scss';
import PreviewERouteChangeRequest from './PreviewERouteChangeRequest';

const { Item: FormItem } = Form;

function ERouteChangeRequestMaster() {
  const [translate] = useTranslation();

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
  ] = crudService.useMaster<ERouteChangeRequest, ERouteChangeRequestFilter>(
    ERouteChangeRequest,
    ERouteChangeRequestFilter,
    eRouteChangeRequestRepository.count,
    eRouteChangeRequestRepository.list,
    eRouteChangeRequestRepository.get,
  );

  const [, handleGoDetail] = routerService.useMasterNavigation(
    E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<
    ERouteChangeRequest
  >();

  // const [, handleGoDetail] = routerService.useMasterNavigation(E_ROUTE_CHANGE_REQUEST_ROUTE);
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [saleEmployeeFilter, setSaleEmployeeFilter] = React.useState<
    AppUserFilter
  >(new AppUserFilter());

  const [eRouteTypeFilter, setERouteTypeFilter] = React.useState<
    ERouteTypeFilter
  >(new ERouteTypeFilter());

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [eRouteTypeList] = crudService.useEnumList<ERouteType>(
    eRouteChangeRequestRepository.filterListErouteType,
  );

  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const [handleDelete] = tableService.useDeleteHandler<ERoute>(
    eRouteChangeRequestRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    eRouteChangeRequestRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const handleResetFilter = React.useCallback(() => {
    handleReset();
    setDateFilter(new DateFilter());
  }, [handleReset]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'startDate') {
          filter.startDate.lessEqual = f.lessEqual;
          filter.startDate.greaterEqual = undefined;
          filter.endDate.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
      };
    },
    [filter, handleSearch, setFilter],
  );

  const columns: ColumnProps<ERouteChangeRequest>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<ERouteChangeRequest>(pagination),
        },
        {
          title: translate('eRouteChangeRequests.code'),
          key: nameof(list[0].eRoute.code),
          dataIndex: nameof(list[0].eRoute),
          ellipsis: true,
          // sorter: true,
          // sortOrder: getOrderTypeForTable<ERouteChangeRequest>(
          //   'eRoute.code',
          //   sorter,
          // ),
          render(...[, eRouteChangeRequet]) {
            return (
              <div
                className="display-code"
                onClick={handleOpenPreview(eRouteChangeRequet.id)}
              >
                {eRouteChangeRequet?.eRoute?.code}
              </div>
            );
          },
        },
        {
          title: translate('eRouteChangeRequests.name'),
          key: nameof(list[0].eRoute.name),
          dataIndex: nameof(list[0].eRoute),
          ellipsis: true,
          // sorter: true,
          // sortOrder: getOrderTypeForTable<ERouteChangeRequest>(
          //   nameof(list[0].name),
          //   sorter,
          // ),
          render(eRoute: ERoute) {
            return eRoute?.name;
          },
        },
        {
          title: translate('eRouteChangeRequests.saleEmployee'),
          key: nameof(list[0].eRoute.saleEmployee),
          dataIndex: nameof(list[0].eRoute),
          ellipsis: true,
          // sorter: true,
          // sortOrder: getOrderTypeForTable<ERouteChangeRequest>(
          //   nameof(list[0].saleEmployee),
          //   sorter,
          // ),
          render(eRoute: ERoute) {
            return eRoute?.saleEmployee?.displayName;
          },
        },

        {
          title: translate('eRouteChangeRequests.date'),
          key: nameof(list[0].eRoute.startDate),
          dataIndex: nameof(list[0].eRoute),
          ellipsis: true,
          // sorter: true,
          // sortOrder: getOrderTypeForTable<ERouteChangeRequest>(
          //   nameof(list[0].startDate),
          //   sorter,
          // ),
          render(eRoute: ERoute) {
            const dateTime = `${formatDate(eRoute?.startDate)} - ${formatDate(
              eRoute?.endDate,
            )}`;
            return dateTime;
          },
        },
        {
          title: translate('eRouteChangeRequests.eRouteType'),
          key: nameof(list[0].eRoute.eRouteType),
          dataIndex: nameof(list[0].eRoute),
          ellipsis: true,
          // sorter: true,
          // sortOrder: getOrderTypeForTable<ERouteChangeRequest>(
          //   nameof(list[0].eRouteType),
          //   sorter,
          // ),
          render(eRoute: ERoute) {
            return eRoute?.eRouteType?.name;
          },
        },
        // {
        //   title: translate('eRouteChangeRequests.requestState'),
        //   key: nameof(list[0].requestState),
        //   dataIndex: nameof(list[0].requestState),
        //   ellipsis: true,
        //   render(requestState: RequestStateStatus) {
        //     return (
        //       <>
        //         {requestState?.id === 1 && (<span className="new-state w-100">{requestState?.name}</span>)}
        //         {requestState?.id === 2 && (<span className="pending-state">{requestState?.name}</span>)}
        //         {requestState?.id === 3 && (<span className="approved-state">{requestState?.name}</span>)}
        //         {requestState?.id === 4 && (<span className="rejected-state">{requestState?.name}</span>)}
        //       </>
        //     );
        //   },
        // },
        {
          title: translate('eRouteChangeRequests.status'),
          key: nameof(list[0].eRoute.statusId),
          dataIndex: nameof(list[0].eRoute),
          sorter: true,
          align: 'center',
          sortOrder: getOrderTypeForTable<ERouteChangeRequest>(
            nameof(list[0].status),
            sorter,
          ),
          render(eRoute: ERoute) {
            return (
              <div className={eRoute?.status?.id === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, eRouteChangeRequet: ERouteChangeRequest) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {/* {
                (eRouteChangeRequet?.requestStateId  === 1) && (
                  <button className="btn btn-sm btn-link"
                  // onClick={handleApprove}
                >
                  <i className="fa fa-exchange"></i>
                </button>
                )
              }
              {
                (eRouteChangeRequet?.requestStateId  === 4) && (
                  <button
                  className="btn btn-sm btn-link"
                  // onClick={handleApprove}
                >
                  <i className="fa fa-exchange"></i>
                </button>
                )
              } */}
                {/* {
                eRouteChangeRequet.requestStateId === 3 && (
                  <button className="btn btn-sm btn-link"
                  onClick={handleGoERouteChangeRequest(id)}
                >
                  <i className="fa fa-random"/>
                </button>
                )
              } */}
                <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleOpenPreview(id)}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                </Tooltip>
                {eRouteChangeRequet.requestStateId === 1 && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
                {eRouteChangeRequet.requestStateId === 1 && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(eRouteChangeRequet)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                )}
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      handleDelete,
      handleGoDetail,
      handleOpenPreview,
      list,
      pagination,
      sorter,
      translate,
    ],
  );

  return (
    <div className="page master-page">
      <Card title={translate('eRouteChangeRequests.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequests.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.code',
                    )}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequests.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.name',
                    )}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequests.saleEmployee')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.saleEmployeeId}
                    filterType={nameof(filter.saleEmployeeId.equal)}
                    value={filter.saleEmployeeId.equal}
                    onChange={handleFilter(nameof(filter.saleEmployeeId))}
                    modelFilter={saleEmployeeFilter}
                    setModelFilter={setSaleEmployeeFilter}
                    getList={eRouteChangeRequestRepository.filterListAppUser}
                    searchField={nameof(saleEmployeeFilter.displayName)}
                    searchType={nameof(saleEmployeeFilter.displayName.contain)}
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.saleEmployee',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequests.store')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.storeId}
                    filterType={nameof(filter.storeId.equal)}
                    value={filter.storeId.equal}
                    onChange={handleFilter(nameof(filter.storeId))}
                    modelFilter={storeFilter}
                    setModelFilter={setStoreFilter}
                    getList={eRouteChangeRequestRepository.filterListStore}
                    searchField={nameof(storeFilter.name)}
                    searchType={nameof(storeFilter.name.contain)}
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.store',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequests.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filterType={nameof(dateFilter.range)}
                    filter={dateFilter}
                    onChange={handleDateFilter(nameof(filter.startDate))}
                    className="w-100 mr-1"
                    placeholder={[
                      translate('eRouteChangeRequests.placeholder.startDate'),
                      translate('eRouteChangeRequests.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('eRouteChangeRequests.eRouteType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.eRouteTypeId}
                    filterType={nameof(filter.eRouteTypeId.equal)}
                    value={filter.eRouteTypeId.equal}
                    onChange={handleFilter(nameof(filter.eRouteTypeId))}
                    getList={eRouteChangeRequestRepository.filterListErouteType}
                    modelFilter={eRouteTypeFilter}
                    setModelFilter={setERouteTypeFilter}
                    searchField={nameof(eRouteTypeFilter.name)}
                    searchType={nameof(eRouteTypeFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    list={eRouteTypeList}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleDefaultSearch}
            >
              <i className="tio-filter_outlined mr-2" />
              {translate(generalLanguageKeys.actions.filter)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleResetFilter}
            >
              <i className="tio-clear_circle_outlined mr-2" />
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-danger mr-2"
                    disabled={!hasSelected}
                    onClick={handleBulkDelete}
                  >
                    <i className="fa mr-2 fa-trash" />
                    {translate(generalLanguageKeys.actions.delete)}
                  </button>
                </div>
              </div>
            </>
          )}
        />
        <PreviewERouteChangeRequest
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
          modelFilter={filter}
          setModelFilter={setFilter}
        />
      </Card>
    </div>
  );
}

export default ERouteChangeRequestMaster;
