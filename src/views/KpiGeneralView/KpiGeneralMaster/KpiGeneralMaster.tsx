import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { KPI_GENERAL_DETAIL_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiGeneral } from 'models/kpi/KpiGeneral';
import { KpiGeneralFilter } from 'models/kpi/KpiGeneralFilter';
import { KpiYear } from 'models/kpi/KpiYear';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { kpiGeneralRepository } from 'views/KpiGeneralView/KpiGeneralRepository';
import './KpiGeneralMaster.scss';
import KpiGeneralPreview from './KpiGeneralPreview/KpiGeneralPreview';
import { API_KPI_GENERAL_ROUTE } from 'config/api-consts';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { notification } from 'helpers';

const { Item: FormItem } = Form;

function KpiGeneralMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-general',
    API_KPI_GENERAL_ROUTE,
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
  ] = crudService.useMaster<KpiGeneral, KpiGeneralFilter>(
    KpiGeneral,
    KpiGeneralFilter,
    kpiGeneralRepository.count,
    kpiGeneralRepository.list,
    kpiGeneralRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    KPI_GENERAL_DETAIL_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [creatorFilter, setCreatorFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [employeeFilter, setEmployeeFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

  const [kpiYearFilter, setKpiYearFilter] = React.useState<KpiYearFilter>(
    new KpiYearFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<KpiGeneral>(
    kpiGeneralRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );
  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
  ] = crudService.useImport(kpiGeneralRepository.import, setLoading);
  const [handleExport, isError, setIsError] = crudService.useExport(
    kpiGeneralRepository.export,
    filter,
  );

  const [handleExportTemplate] = crudService.useExport(
    kpiGeneralRepository.exportTemplate,
    filter,
  );

  const handleOrganizationFilter = React.useCallback(
    f => {
      const { skip, take } = OrganizationFilter.clone<OrganizationFilter>(
        new OrganizationFilter(),
      );
      filter.appUserId.equal = undefined;
      // set OrganizationFilter
      setFilter({ ...filter, organizationId: f, skip, take });
      // set appUserFilter
      setEmployeeFilter({ ...employeeFilter, organizationId: f });
      handleSearch();
    },
    [employeeFilter, filter, setFilter, handleSearch],
  );
  React.useEffect(() => {
    if (isError) {
      notification.error({
        message: translate('kpiGenerals.errorExport'),
      });
      setIsError(false);
    }
  }, [isError, translate, setIsError]);
  const columns: ColumnProps<KpiGeneral>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<KpiGeneral>(pagination),
        },
        {
          title: translate('kpiGenerals.employee'),
          key: nameof(list[0].employee),
          dataIndex: nameof(list[0].employee),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiGeneral>(
            nameof(list[0].employee),
            sorter,
          ),
          render(employee: AppUser) {
            return employee?.displayName;
          },
        },
        {
          title: translate('kpiGenerals.organization'),
          key: nameof(list[0].organization),
          dataIndex: nameof(list[0].organization),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiGeneral>(
            nameof(list[0].organization),
            sorter,
          ),
          render(organization: Organization) {
            return organization?.name;
          },
        },
        {
          title: translate('kpiGenerals.creator'),
          key: nameof(list[0].creator),
          dataIndex: nameof(list[0].creator),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiGeneral>(
            nameof(list[0].creator),
            sorter,
          ),
          render(creator: AppUser) {
            return creator?.displayName;
          },
        },

        {
          title: translate('kpiGenerals.kpiYear'),
          key: nameof(list[0].kpiYear),
          dataIndex: nameof(list[0].kpiYear),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiGeneral>(
            nameof(list[0].kpiYear),
            sorter,
          ),
          render(kpiYear: KpiYear) {
            return kpiYear?.name;
          },
        },

        {
          title: translate('kpiGenerals.updateAt'),
          key: nameof(list[0].updateAt),
          dataIndex: nameof(list[0].updateAt),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiGeneral>(
            nameof(list[0].updateAt),
            sorter,
          ),
          render(...[updateAt]) {
            return formatDate(updateAt);
          },
          ellipsis: true,
          align: 'center',
        },

        {
          title: translate('kpiGenerals.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          sortOrder: getOrderTypeForTable<KpiGeneral>(
            nameof(list[0].status),
            sorter,
          ),
          align: 'center',
          render(status: Status) {
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
          render(id: number, kpiGeneral: KpiGeneral) {
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
                {validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
                {validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(kpiGeneral)}
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
      <Card title={translate('kpiGenerals.master.title')}>
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
                    label={translate('kpiGenerals.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleOrganizationFilter}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={kpiGeneralRepository.filterListOrganization}
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
                    label={translate('kpiGenerals.employee')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      modelFilter={employeeFilter}
                      setModelFilter={setEmployeeFilter}
                      getList={kpiGeneralRepository.filterListAppUser}
                      searchField={nameof(employeeFilter.displayName)}
                      searchType={nameof(employeeFilter.displayName.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGenerals.creator')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.creatorId}
                      filterType={nameof(filter.creatorId.equal)}
                      value={filter.creatorId.equal}
                      onChange={handleFilter(nameof(filter.creatorId))}
                      modelFilter={creatorFilter}
                      setModelFilter={setCreatorFilter}
                      getList={kpiGeneralRepository.filterListCreator}
                      searchField={nameof(creatorFilter.displayName)}
                      searchType={nameof(creatorFilter.displayName.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGenerals.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      getList={kpiGeneralRepository.filterListStatus}
                      searchField={nameof(statusFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListKpiYear') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('kpiGenerals.kpiYear')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.kpiYearId}
                      filterType={nameof(filter.kpiYearId.equal)}
                      value={filter.kpiYearId.equal}
                      onChange={handleFilter(nameof(filter.kpiYearId))}
                      modelFilter={kpiYearFilter}
                      setModelFilter={setKpiYearFilter}
                      getList={kpiGeneralRepository.filterListKpiYear}
                      searchField={nameof(kpiYearFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
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
              <>
                <div className="d-flex justify-content-between">
                  <div className="flex-shrink-1 d-flex align-items-center">
                    {/* create button */}
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
                    {/* {validAction('exportTemplate') && ( */}
                    <button
                      className="btn btn-sm btn-export-template mr-2"
                      onClick={handleExportTemplate}
                    >
                      <i className="tio-download_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.exportTemplate)}
                    </button>
                    {/* )} */}
                  </div>
                  <div className="flex-shrink-1 d-flex align-items-center">
                    {translate('general.master.pagination', {
                      pageSize: pagination.pageSize,
                      total,
                    })}
                  </div>
                </div>
              </>
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
        <KpiGeneralPreview
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
        />
        {typeof errModel !== 'undefined' && (
          <ImportErrorModal
            errVisible={errVisible}
            setErrVisible={setErrVisible}
            errModel={errModel}
          />
        )}
      </Card>
    </div>
  );
}

export default KpiGeneralMaster;
