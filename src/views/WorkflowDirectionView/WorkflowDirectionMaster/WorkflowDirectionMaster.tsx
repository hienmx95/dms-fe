import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { WORKFLOW_DIRECTION_DETAIL_ROUTE } from 'config/route-consts';
import { formatDateTime } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowDirectionFilter } from 'models/WorkflowDirectionFilter';
import { WorkflowStep } from 'models/WorkflowStep';
import { WorkflowStepFilter } from 'models/WorkflowStepFilter';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { workflowDirectionRepository } from 'views/WorkflowDirectionView/WorkflowDirectionRepository';
import './WorkflowDirectionMaster.scss';
import WorkflowDirectionPreview from './WorkflowDirectionPreview';
import { useRef } from 'reactn';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

const { Item: FormItem } = Form;

function WorkflowDirectionMaster() {
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
  ] = crudService.useMaster<WorkflowDirection, WorkflowDirectionFilter>(
    WorkflowDirection,
    WorkflowDirectionFilter,
    workflowDirectionRepository.count,
    workflowDirectionRepository.list,
    workflowDirectionRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    WORKFLOW_DIRECTION_DETAIL_ROUTE,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [fromStepFilter, setFromStepFilter] = React.useState<
    WorkflowStepFilter
  >(new WorkflowStepFilter());

  const [toStepFilter, setToStepFilter] = React.useState<WorkflowStepFilter>(
    new WorkflowStepFilter(),
  );

  const [
    workflowDefinitionFilter,
    setWorkflowDefinitionFilter,
  ] = React.useState<WorkflowDefinitionFilter>(new WorkflowDefinitionFilter());

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<WorkflowDirection>(
    workflowDirectionRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [
    defaultWorkflowDirectionList,
    setDefaultWorkflowDirectionList,
  ] = React.useState<WorkflowDirection[]>([]);

  useEffect(() => {
    if (isCurrent.current) {
      workflowDirectionRepository
        .singleListWorkflowDefinition(workflowDefinitionFilter)
        .then((res: WorkflowDirection[]) => {
          setDefaultWorkflowDirectionList(res);
        });
      isCurrent.current = false;
    }
  });

  const columns: ColumnProps<WorkflowDirection>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<WorkflowDirection>(pagination),
        },
        {
          title: translate('workflowDirections.workflowDefinition'),
          key: nameof(list[0].workflowDefinition),
          dataIndex: nameof(list[0].workflowDefinition),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowDirection>(
            nameof(list[0].workflowDefinition),
            sorter,
          ),
          render(workflowDefinition: WorkflowDefinition) {
            return workflowDefinition.name;
          },
        },
        {
          title: translate('workflowDirections.fromStep'),
          key: nameof(list[0].fromStep),
          dataIndex: nameof(list[0].fromStep),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowDirection>(
            nameof(list[0].fromStep),
            sorter,
          ),
          render(fromStep: WorkflowStep) {
            return fromStep?.name;
          },
        },
        {
          title: translate('workflowDirections.toStep'),
          key: nameof(list[0].toStep),
          dataIndex: nameof(list[0].toStep),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowDirection>(
            nameof(list[0].toStep),
            sorter,
          ),
          render(toStep: WorkflowStep) {
            return toStep?.name;
          },
        },

        {
          title: translate('workflowDirections.updateTime'),
          key: nameof(list[0].updatedAt),
          dataIndex: nameof(list[0].updatedAt),
          sorter: true,
          sortOrder: getOrderTypeForTable<WorkflowDirection>(
            nameof(list[0].updatedAt),
            sorter,
          ),
          render(...[updatedAt]) {
            return formatDateTime(updatedAt);
          },
        },
        {
          title: translate('workflowDirections.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          align: 'center',
          sorter: true,
          sortOrder: getOrderTypeForTable<Status>(
            nameof(list[0].status),
            sorter,
          ),
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
          render(id: number, workflowDirection: WorkflowDirection) {
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
                {!workflowDirection.used && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(workflowDirection)}
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

  const handleFilterWorkflowDefinition = React.useCallback(
    event => {
      filter.workflowDefinitionId.equal = event.equal;
      setFilter({ ...filter });
      handleDefaultSearch();
      fromStepFilter.workflowDefinitionId.equal = event.equal;
      toStepFilter.workflowDefinitionId.equal = event.equal;
      setFromStepFilter(fromStepFilter);
      setToStepFilter(toStepFilter);
    },
    [
      setFilter,
      filter,
      setFromStepFilter,
      fromStepFilter,
      handleDefaultSearch,
      toStepFilter,
      setToStepFilter,
    ],
  );

  return (
    <div className="page master-page">
      <Card title={translate('workflowDirections.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('workflowDirections.workflowDefinition')}
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
                      workflowDirectionRepository.filterListWorkflowDefinition
                    }
                    list={defaultWorkflowDirectionList}
                    searchField={nameof(workflowDefinitionFilter.name)}
                    placeholder={translate(
                      'workflowDirections.placeholder.workflowDefinition',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('workflowDirections.fromStep')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.fromStepId}
                    filterType={nameof(filter.fromStepId.equal)}
                    value={filter.fromStepId.equal}
                    onChange={handleFilter(nameof(filter.fromStepId))}
                    modelFilter={fromStepFilter}
                    setModelFilter={setFromStepFilter}
                    getList={workflowDirectionRepository.filterListWorkflowStep}
                    searchField={nameof(fromStepFilter.name)}
                    placeholder={translate(
                      'workflowDirections.placeholder.fromStep',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('workflowDirections.toStep')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.toStepId}
                    filterType={nameof(filter.toStepId.equal)}
                    value={filter.toStepId.equal}
                    onChange={handleFilter(nameof(filter.toStepId))}
                    modelFilter={toStepFilter}
                    setModelFilter={setToStepFilter}
                    getList={workflowDirectionRepository.filterListWorkflowStep}
                    searchField={nameof(toStepFilter.name)}
                    placeholder={translate(
                      'workflowDirections.placeholder.toStep',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('products.status')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.statusId}
                    filterType={nameof(filter.statusId.equal)}
                    value={filter.statusId.equal}
                    onChange={handleFilter(nameof(filter.statusId))}
                    getList={workflowDirectionRepository.filterListStatus}
                    modelFilter={statusFilter}
                    setModelFilter={setStatusFilter}
                    searchField={nameof(statusFilter.name)}
                    searchType={nameof(statusFilter.name.contain)}
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
        <WorkflowDirectionPreview
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
        />
      </Card>
    </div>
  );
}

export default WorkflowDirectionMaster;
