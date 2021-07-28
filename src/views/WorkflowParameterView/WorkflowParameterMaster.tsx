import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { WorkflowParameter } from 'models/WorkflowParameter';
import { WorkflowParameterFilter } from 'models/WorkflowParameterFilter';
import { WorkflowTypeFilter } from 'models/WorkflowTypeFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { workflowParameterRepository } from './WorkflowParameterRepository';
import { WorkflowType } from 'models/WorkflowType';

const { Item: FormItem } = Form;

function WorkflowParameterMaster() {
  const [translate] = useTranslation();

  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    ,
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
  ] = crudService.useMaster<WorkflowParameter, WorkflowParameterFilter>(
    WorkflowParameter,
    WorkflowParameterFilter,
    workflowParameterRepository.count,
    workflowParameterRepository.list,
    workflowParameterRepository.get,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [workflowTypeFilter, setWorkflowTypeFilter] = React.useState<
    WorkflowTypeFilter
  >(new WorkflowTypeFilter());

  const [
    workflowParameterTypeFilter,
    setWorkflowParameterTypeFilter,
  ] = React.useState<WorkflowTypeFilter>(new WorkflowTypeFilter());
  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------

  const columns: ColumnProps<WorkflowParameter>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<WorkflowParameter>(pagination),
      },
      {
        title: translate('workflowParameters.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowParameter>(
          nameof(list[0].code),
          sorter,
        ),
      },
      {
        title: translate('workflowParameters.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowParameter>(
          nameof(list[0].name),
          sorter,
        ),
        ellipsis: true,
      },
      {
        title: translate('workflowParameters.workflowType'),
        key: nameof(list[0].workflowType),
        dataIndex: nameof(list[0].workflowType),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowParameter>(
          nameof(list[0].workflowType),
          sorter,
        ),
        ellipsis: true,
        render(workflowType: WorkflowType) {
          return workflowType?.name;
        },
      },

      {
        title: translate('workflowParameters.workflowParameterType'), // kieu du lieu
        key: nameof(list[0].workflowParameterType),
        dataIndex: nameof(list[0].workflowParameterType),
        sorter: true,
        sortOrder: getOrderTypeForTable<WorkflowType>(
          nameof(list[0].workflowParameterType),
          sorter,
        ),
        ellipsis: true,
        render(workflowParameterType: WorkflowType) {
          return workflowParameterType?.name;
        },
      },
    ];
  }, [list, pagination, sorter, translate]);

  return (
    <div className="page master-page">
      <Card title={translate('workflowParameters.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflowParameters.workflowType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.workflowTypeId}
                    filterType={nameof(filter.workflowTypeId.equal)}
                    value={filter.workflowTypeId.equal}
                    onChange={handleFilter(nameof(filter.workflowTypeId))}
                    getList={workflowParameterRepository.filterListWorkflowType}
                    modelFilter={workflowTypeFilter}
                    setModelFilter={setWorkflowTypeFilter}
                    searchField={nameof(workflowTypeFilter.name)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('workflowParameters.workflowParameterType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.workflowParameterTypeId}
                    filterType={nameof(filter.workflowParameterTypeId.equal)}
                    value={filter.workflowParameterTypeId.equal}
                    onChange={handleFilter(
                      nameof(filter.workflowParameterTypeId),
                    )}
                    getList={
                      workflowParameterRepository.filterListWorkflowParameterType
                    }
                    modelFilter={workflowParameterTypeFilter}
                    setModelFilter={setWorkflowParameterTypeFilter}
                    searchField={nameof(workflowParameterTypeFilter.name)}
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
                <div className="flex-shrink-1 d-flex align-items-center"></div>
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
export default WorkflowParameterMaster;
