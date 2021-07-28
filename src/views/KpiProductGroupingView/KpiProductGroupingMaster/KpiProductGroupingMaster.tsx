import { Card, Form, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { KPI_PRODUCT_GROUPING_DETAIL_ROUTE } from 'config/route-consts';
import { formatDateTime } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiProductGrouping } from 'models/kpi/KpiProductGrouping';
import { KpiProductGroupingFilter } from 'models/kpi/KpiProductGroupingFilter';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StatusFilter } from 'models/StatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import KpiItemPreview from '../KpiProductGroupingPreview/KpiProductGroupingPreview';
import { kpiItemRepository } from '../KpiProductGroupingRepository';
import { API_KPI_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';
import { notification } from 'helpers';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
function KpiProductGroupingViewMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-product-grouping',
    API_KPI_PRODUCT_GROUPING_ROUTE,
  );
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
  ] = crudService.useMaster<KpiProductGrouping, KpiProductGroupingFilter>(
    KpiProductGrouping,
    KpiProductGroupingFilter,
    kpiItemRepository.count,
    kpiItemRepository.list,
    kpiItemRepository.get,
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

  const [creatorFilter, setCreatorFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [typeFilter, setTypeFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [kpiPeriodFilter, setKpiPeriodFilter] = React.useState<KpiPeriodFilter>(
    new KpiPeriodFilter(),
  );

  const [kpiYearFilter, setKpiYearFilter] = React.useState<KpiYearFilter>(
    new KpiYearFilter(),
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    KPI_PRODUCT_GROUPING_DETAIL_ROUTE,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const [handleDelete] = tableService.useDeleteHandler<KpiProductGrouping>(
    kpiItemRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
  ] = crudService.useImport(kpiItemRepository.import, setLoading);
  const [handleExport, isError, setIsError] = crudService.useExport(
    kpiItemRepository.export,
    filter,
  );
  React.useEffect(() => {
    if (isError) {
      if (filter.kpiPeriodId.equal === undefined) {
        notification.error({
          message: translate('kpiItems.errors.kpiPeriod'),
        });
      }
      if (filter.kpiYearId.equal === undefined) {
        notification.error({
          message: translate('kpiItems.errors.kpiYear'),
        });
      }
      if (
        filter.kpiYearId.equal === undefined &&
        filter.kpiPeriodId.equal === undefined
      ) {
        notification.error({
          message: translate('kpiItems.errors.kpi'),
        });
      }

      setIsError(false);
    }
  }, [isError, translate, setIsError, filter.kpiPeriodId, filter.kpiYearId]);
  const [handleExportTemplate] = crudService.useExport(
    kpiItemRepository.exportTemplate,
    filter,
  );

  const handleOrganizationFilter = React.useCallback(
    f => {
      const { skip, take } = OrganizationFilter.clone<OrganizationFilter>(
        new OrganizationFilter(),
      );
      filter.employeeId.equal = undefined;
      // set OrganizationFilter
      setFilter({ ...filter, organizationId: f, skip, take });
      // set appUserFilter
      setAppUserFilter({ ...appUserFilter, organizationId: f });
      handleSearch();
    },
    [appUserFilter, filter, setFilter, handleSearch],
  );

  const columns: ColumnProps<KpiProductGrouping>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<KpiProductGrouping>(pagination),
        },
        {
          title: translate('kpiProductGroupings.employee.displayName'),
          key: nameof(list[0].employee),
          dataIndex: nameof(list[0].employee),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].employee),
            sorter,
          ),
          render(...[employee]) {
            return <>{employee.displayName}</>;
          },
        },

        {
          title: translate('kpiItems.organization'),
          key: nameof(list[0].organization),
          dataIndex: nameof(list[0].organization),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].organization),
            sorter,
          ),
          render(...[organization]) {
            return <>{organization.name}</>;
          },
        },
        {
          title: translate('kpiItems.kpiItemType'),
          key: nameof(list[0].kpiProductGroupingType),
          dataIndex: nameof(list[0].kpiProductGroupingType),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].kpiItemType),
            sorter,
          ),
          render(...[kpiItemType]) {
            return <>{kpiItemType.name}</>;
          },
        },

        {
          title: translate('kpiItems.kpiPeriod'),
          key: nameof(list[0].kpiPeriod),
          dataIndex: nameof(list[0].kpiPeriod),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].kpiPeriod),
            sorter,
          ),
          render(...[kpiPeriod]) {
            return <>{kpiPeriod.name}</>;
          },
        },
        {
          title: translate('kpiItems.kpiYear'),
          key: nameof(list[0].kpiYear),
          dataIndex: nameof(list[0].kpiYear),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].kpiYear),
            sorter,
          ),
          render(...[kpiYear]) {
            return <>{kpiYear?.name}</>;
          },
        },
        {
          title: translate('kpiItems.creator'),
          key: nameof(list[0].creator),
          dataIndex: nameof(list[0].creator),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].creator),
            sorter,
          ),
          render(...[creator]) {
            return <>{creator.displayName}</>;
          },
        },
        {
          title: translate('kpiItems.updateAt'),
          key: nameof(list[0].updatedAt),
          dataIndex: nameof(list[0].updatedAt),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].updatedAt),
            sorter,
          ),
          render(...[updatedAt]) {
            return <>{formatDateTime(updatedAt)}</>;
          },
        },
        {
          title: translate('kpiItems.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          width: generalColumnWidths.actions,
          align: 'center',
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiProductGrouping>(
            nameof(list[0].status),
            sorter,
          ),
          render(...[status]) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
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
          render(id: number, item: KpiProductGrouping) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}
                {!item.readOnly && validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
                {!item.readOnly && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(item)}
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
      validAction,
    ],
  );

  return (
    <div className="page master-page">
      <Card
        title={translate('kpiProductGroupings.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {validAction('filterListKpiProductGroupingType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.kpiItemType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiProductGroupingTypeId}
                      filterType={nameof(filter.kpiProductGroupingTypeId.equal)}
                      value={filter.kpiProductGroupingTypeId.equal}
                      onChange={handleFilter(
                        nameof(filter.kpiProductGroupingTypeId),
                      )}
                      getList={
                        kpiItemRepository.filterListKpiProductGroupingType
                      }
                      modelFilter={typeFilter}
                      setModelFilter={setTypeFilter}
                      searchField={nameof(typeFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleOrganizationFilter}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={kpiItemRepository.filterListOrganization}
                      searchField={nameof(organizationFilter.name)}
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
                    label={translate(
                      'kpiProductGroupings.employee.displayName',
                    )}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.employeeId}
                      filterType={nameof(filter.employeeId.equal)}
                      value={filter.employeeId.equal}
                      onChange={handleFilter(nameof(filter.employeeId))}
                      getList={kpiItemRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.creator')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.creatorId}
                      filterType={nameof(filter.creatorId.equal)}
                      value={filter.creatorId.equal}
                      onChange={handleFilter(nameof(filter.creatorId))}
                      getList={kpiItemRepository.filterListAppUser}
                      modelFilter={creatorFilter}
                      setModelFilter={setCreatorFilter}
                      searchField={nameof(creatorFilter.displayName)}
                      searchType={nameof(creatorFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={kpiItemRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListKpiPeriod') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.kpiPeriod')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiPeriodId}
                      filterType={nameof(filter.kpiPeriodId.equal)}
                      value={filter.kpiPeriodId.equal}
                      onChange={handleFilter(nameof(filter.kpiPeriodId))}
                      modelFilter={kpiPeriodFilter}
                      setModelFilter={setKpiPeriodFilter}
                      getList={kpiItemRepository.filterListKpiPeriod}
                      searchField={nameof(kpiPeriodFilter.name)}
                      searchType={nameof(kpiPeriodFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListKpiYear') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiItems.kpiYear')}
                    labelAlign="left"
                  >
                    {/* need years filter here */}
                    <AdvancedIdFilter
                      filter={filter.kpiYearId}
                      filterType={nameof(filter.kpiYearId.equal)}
                      value={filter.kpiYearId.equal}
                      onChange={handleFilter(nameof(filter.kpiYearId))}
                      modelFilter={kpiYearFilter}
                      setModelFilter={setKpiYearFilter}
                      getList={kpiItemRepository.filterListKpiYear}
                      searchField={nameof(kpiPeriodFilter.name)}
                      searchType={nameof(kpiPeriodFilter.name.contain)}
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
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleReset}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
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
          onChange={handleTableChange}
          className="table-none-row-selection"
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') && (
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  )}

                  {validAction('import') && (
                    <label
                      className="btn btn-sm btn-outline-primary mr-2 mb-0"
                      htmlFor="master-import"
                    >
                      <i className="tio-file_add_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.import)}
                    </label>
                  )}
                  {validAction('export') && (
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={handleExport}
                    >
                      <i className="tio-file_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.export)}
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-export-template mr-2"
                    onClick={handleExportTemplate}
                  >
                    <i className="tio-download_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.exportTemplate)}
                  </button>
                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
        <input
          ref={ref}
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          onClick={handleClick}
        />
        {typeof errModel !== 'undefined' && (
          <ImportErrorModal
            errVisible={errVisible}
            setErrVisible={setErrVisible}
            errModel={errModel}
          />
        )}
        <KpiItemPreview
          model={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default KpiProductGroupingViewMaster;
