import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { WORKFLOW_STEP_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import { WorkflowStep } from 'models/WorkflowStep';
import { WorkflowStepFilter } from 'models/WorkflowStepFilter';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { workflowStepRepository } from 'views/WorkflowStepView/WorkflowStepRepository';
import './WorkflowStepMaster.scss';
import WorkflowStepPreview from './WorkflowStepPreview';
import { Tooltip } from 'antd';
import { useRef } from 'reactn';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { StatusFilter } from 'models/StatusFilter';
import { Status } from 'models/Status';
const { Item: FormItem } = Form;

function WorkflowStepMaster() {
  const [translate] = useTranslation();
  const isCurrent = useRef<boolean>(true);
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
  ] = crudService.useMaster<WorkflowStep, WorkflowStepFilter>(
    WorkflowStep,
    WorkflowStepFilter,
    workflowStepRepository.count,
    workflowStepRepository.list,
    workflowStepRepository.get,
  );
  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    WORKFLOW_STEP_DETAIL_ROUTE,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>(
    new RoleFilter(),
  );

  const [
    workflowDefinitionFilter,
    setWorkflowDefinitionFilter,
  ] = React.useState<WorkflowDefinitionFilter>(new WorkflowDefinitionFilter());

  const [
    defaultWorkflowDirectionList,
    setDefaultWorkflowDirectionList,
  ] = React.useState<WorkflowDirection[]>([]);

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<WorkflowStep>(
    workflowStepRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  // Enums

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  useEffect(() => {
    if (isCurrent.current) {
      workflowStepRepository
        .singleListWorkflowDefinition(workflowDefinitionFilter)
        .then((res: WorkflowDirection[]) => {
          setDefaultWorkflowDirectionList(res);
        });
      isCurrent.current = false;
    }
  });

  const handleFilterWorkflowDefinition = React.useCallback(
    event => {
      filter.workflowDefinitionId.equal = event.equal;
      setFilter({ ...filter });
      handleDefaultSearch();
      roleFilter.workflowDefinitionId.equal = event.equal;
      setRoleFilter(roleFilter);
    },
    [setFilter, filter, setRoleFilter, roleFilter, handleDefaultSearch],
  );

  const columns: ColumnProps<WorkflowStep>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<WorkflowStep>(pagination),
        },
        {
          title: translate('workflowSteps.workflowDefinition'),
          key: nameof(list[0].workflowDefinition),
          dataIndex: nameof(list[0].workflowDefinition),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowStep>(
            nameof(list[0].workflowDefinition),
            sorter,
          ),
          render(workflowDefinition: WorkflowDefinition) {
            return workflowDefinition?.name;
          },
        },
        {
          title: translate('workflowSteps.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowStep>(
            nameof(list[0].code),
            sorter,
          ),
          render(...[, worklowStep]) {
            return (
              <div
                className="display-code"
                onClick={handleOpenPreview(worklowStep.id)}
              >
                {worklowStep.code}
              </div>
            );
          },
        },
        {
          title: translate('workflowSteps.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowStep>(
            nameof(list[0].name),
            sorter,
          ),
        },
        {
          title: translate('workflowSteps.role'),
          key: nameof(list[0].role),
          dataIndex: nameof(list[0].role),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowStep>(
            nameof(list[0].role),
            sorter,
          ),
          render(role: Role) {
            return role?.name;
          },
        },
        {
          title: translate('workflows.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowStep>(
            nameof(list[0].status),
            sorter,
          ),
          align: 'center',
          render(status: Status) {
            return (
              <div className={status && status.id === 1 ? 'active' : ''}>
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
          render(id: number, workflowStep: WorkflowStep) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleOpenPreview(id)}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                </Tooltip>
                <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleGoDetail(id)}
                  >
                    <i className="tio-edit" />
                  </button>
                </Tooltip>
                {!workflowStep.used && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(workflowStep)}
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
      <Card title={translate('workflowSteps.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('workflowSteps.workflowDefinition')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.workflowDefinitionId}
                    filterType={nameof(filter.workflowDefinitionId.equal)}
                    value={Number(filter.workflowDefinitionId.equal)}
                    // onChange={handleFilter(nameof(filter.workflowDefinitionId))}
                    onChange={handleFilterWorkflowDefinition}
                    modelFilter={workflowDefinitionFilter}
                    setModelFilter={setWorkflowDefinitionFilter}
                    getList={
                      workflowStepRepository.filterListWorkflowDefinition
                    }
                    searchField={nameof(workflowDefinitionFilter.name)}
                    placeholder={translate(
                      'workflowSteps.placeholder.workflowDefinition',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    list={defaultWorkflowDirectionList}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('workflowSteps.role')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.roleId}
                    filterType={nameof(filter.roleId.equal)}
                    value={filter.roleId.equal}
                    onChange={handleFilter(nameof(filter.roleId))}
                    modelFilter={roleFilter}
                    setModelFilter={setRoleFilter}
                    getList={workflowStepRepository.filterListRole}
                    searchField={nameof(roleFilter.name)}
                    placeholder={translate('workflowSteps.placeholder.role')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflowSteps.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    placeholder={translate('workflowSteps.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflowSteps.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    placeholder={translate('workflowSteps.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflows.status')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.statusId}
                    filterType={nameof(filter.statusId.equal)}
                    value={filter.statusId.equal}
                    onChange={handleFilter(nameof(filter.statusId))}
                    getList={workflowStepRepository.filterListStatus}
                    modelFilter={statusFilter}
                    setModelFilter={setStatusFilter}
                    searchField={nameof(statusFilter.name)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
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
              onClick={handleReset}
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
          onChange={handleTableChange}
          className="table-none-row-selection"
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleGoCreate}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate(generalLanguageKeys.actions.create)}
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
      </Card>
      <WorkflowStepPreview
        previewModel={previewModel}
        previewLoading={previewLoading}
        previewVisible={previewVisible}
        onClose={handleClosePreview}
      />
    </div>
  );
}

export default WorkflowStepMaster;
