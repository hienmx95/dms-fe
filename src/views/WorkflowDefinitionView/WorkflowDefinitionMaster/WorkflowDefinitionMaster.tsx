import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import {
  WORKFLOW_STEP_ROUTE,
  WORKFLOW_DIRECTION_ROUTE,
  WORKFLOW_DEFINITION_DETAIL_ROUTE,
  WORKFLOW_DEFINITION_PREVIEW_ROUTE,
} from 'config/route-consts';
import { formatDate, formatDateTime } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import { WorkflowType } from 'models/WorkflowType';
import { WorkflowTypeFilter } from 'models/WorkflowTypeFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { workflowDefinitionRepository } from '../WorkflowDefinitionRepository';
import { notification } from '../../../helpers/notification';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { AxiosError } from 'axios';

const { Item: FormItem } = Form;

function WorkflowMaster() {
  const [translate] = useTranslation();
  const history = useHistory();

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    ,
    ,
    previewModel,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
  ] = crudService.useMaster<WorkflowDefinition, WorkflowDefinitionFilter>(
    WorkflowDefinition,
    WorkflowDefinitionFilter,
    workflowDefinitionRepository.count,
    workflowDefinitionRepository.list,
    workflowDefinitionRepository.get,
  );
  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    WORKFLOW_DEFINITION_DETAIL_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );
  const [workflowTypeFilter, setWorkflowTypeFilter] = React.useState<
    WorkflowTypeFilter
  >(new WorkflowTypeFilter());
  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<WorkflowDefinition>(
    workflowDefinitionRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const handleGoPreview = React.useCallback(
    (id: number) => {
      return () => {
        history.push(path.join(WORKFLOW_DEFINITION_PREVIEW_ROUTE, `${id}`));
      };
    },
    [history],
  );

  const handleGoWorkflowStep = React.useCallback(
    id => {
      history.push(
        path.join(WORKFLOW_STEP_ROUTE, `/?workflowDefinitionId.equal=${id}`),
        id,
      );
    },
    [history],
  );

  const handleGoWorkflowDirection = React.useCallback(
    id => {
      history.push(
        path.join(
          WORKFLOW_DIRECTION_ROUTE,
          `/?workflowDefinitionId.equal=${id}`,
        ),
        id,
      );
    },
    [history],
  );

  const handleClone = React.useCallback(
    (id: number) => {
      workflowDefinitionRepository
        .clone(id)
        .then(() => {
          notification.success({
            message: translate('workflows.notification'),
          });
          handleSearch();
        })
        .catch((error?: AxiosError<WorkflowDefinition>) => {
          if (error.response && error.response.status === 400) {
            const errors = error.response.data?.errors;
            if (errors) {
              Object.keys(errors).forEach(key => {
                notification.error({
                  message: errors[key],
                });
              });
              return;
            } // return error detail
            notification.error({
              message: translate('workflows.errorClone'),
            });
          }
        });
    },
    [handleSearch, translate],
  );

  const columns: ColumnProps<WorkflowDefinition>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<WorkflowDefinition>(pagination),
      },
      {
        title: translate('workflows.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowDefinition>(
          nameof(list[0].code),
          sorter,
        ),
        render(...[, workflowDefinition]) {
          return (
            <div
              className="display-code"
              onClick={handleGoPreview(workflowDefinition.id)}
            >
              {workflowDefinition.code}
            </div>
          );
        },
      },
      {
        title: translate('workflows.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowDefinition>(
          nameof(list[0].name),
          sorter,
        ),
        ellipsis: true,
      },
      {
        title: translate('workflows.workflowType'),
        key: nameof(list[0].workflowType),
        dataIndex: nameof(list[0].workflowType),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowDefinition>(
          nameof(list[0].workflowType),
          sorter,
        ),
        ellipsis: true,
        render(workflowType: WorkflowType) {
          return workflowType?.name;
        },
      },
      {
        title: translate('workflows.organization'),
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowDefinition>(
          nameof(list[0].organization),
          sorter,
        ),
        ellipsis: true,
        render(organization: Organization) {
          return organization?.name;
        },
      },
      {
        title: translate('workflows.startDate'),
        key: nameof(list[0].startDate),
        dataIndex: nameof(list[0].startDate),
        ellipsis: true,
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowDefinition>(
          nameof(list[0].startDate),
          sorter,
        ),
        render(...[, workflowDefinition]) {
          if (workflowDefinition.endDate) {
            const dateTime = `${formatDate(
              workflowDefinition?.startDate,
            )} - ${formatDate(workflowDefinition?.endDate)}`;
            return dateTime;
          }
          return workflowDefinition?.startDate
            ? formatDate(workflowDefinition?.startDate)
            : null;
        },
      },
      {
        title: translate('workflows.updatedTime'),
        key: nameof(list[0].updatedAt),
        dataIndex: nameof(list[0].updatedAt),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowDefinition>(
          nameof(list[0].updatedAt),
          sorter,
        ),
        render(...[updatedAt]) {
          return formatDateTime(updatedAt);
        },
        ellipsis: true,
      },
      {
        title: translate('workflows.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowDefinition>(
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
        width: 150,
        align: 'center',
        render(id: number, workflowDefinition: WorkflowDefinition) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Tooltip title={translate('workflows.clone')}>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => handleClone(id)}
                >
                  <i className="tio-arrow_large_downward_outlined" />
                </button>
              </Tooltip>
              <Tooltip title={translate('workflows.stepView')}>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => handleGoWorkflowStep(id)}
                >
                  <i className="tio-add_event" />
                </button>
              </Tooltip>
              <Tooltip title={translate('workflows.directionView')}>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => handleGoWorkflowDirection(id)}
                >
                  <i className="tio-share" />
                </button>
              </Tooltip>
              <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                <button
                  className="btn btn-sm btn-link"
                  onClick={handleGoPreview(id)}
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
              {!workflowDefinition.used && (
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDelete(workflowDefinition)}
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
  }, [
    handleDelete,
    handleGoDetail,
    handleGoPreview,
    list,
    pagination,
    sorter,
    translate,
    handleGoWorkflowDirection,
    handleGoWorkflowStep,
    handleClone,
  ]);

  return (
    <div className="page master-page">
      <Card title={translate('workflows.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflows.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('workflows.placeholder.code')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflows.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('workflows.placeholder.name')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflows.organization')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={filter.organizationId}
                    filterType={nameof(filter.organizationId.equal)}
                    value={filter.organizationId.equal}
                    onChange={handleFilter(nameof(filter.organizationId))}
                    getList={
                      workflowDefinitionRepository.filterListOrganization
                    }
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflows.workflowType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.workflowTypeId}
                    filterType={nameof(filter.workflowTypeId.equal)}
                    value={filter.workflowTypeId.equal}
                    onChange={handleFilter(nameof(filter.workflowTypeId))}
                    getList={
                      workflowDefinitionRepository.filterListWorkflowType
                    }
                    modelFilter={workflowTypeFilter}
                    setModelFilter={setWorkflowTypeFilter}
                    searchField={nameof(WorkflowTypeFilter.name)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
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
                    getList={workflowDefinitionRepository.filterListStatus}
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
    </div>
  );
}
export default WorkflowMaster;
