import { DatePicker } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { WORKFLOW_DEFINITION_ROUTE } from 'config/route-consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { formatDateTime } from 'core/helpers/date-time';
import { crudService, formService, routerService } from 'core/services';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowTypeFilter } from 'models/WorkflowTypeFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { workflowDefinitionRepository } from '../WorkflowDefinitionRepository';
import './WorkflowDefinitionPreview.scss';
import WorkflowDefinitionPreviewContentTable from './WorkflowDefinitionPreviewContentTable/WorkflowDefinitionPreviewContentTable';
const { Item: FormItem } = Form;

function WorkflowDefinitionPreview() {
  const [translate] = useTranslation();
  const [handleGoBack] = routerService.useGoBack(WORKFLOW_DEFINITION_ROUTE);
  const [
    workflowDefinition,
    setWorkflowDefinition,
    loading,
    ,
    isDetail,
  ] = crudService.useDetail(
    WorkflowDefinition,
    workflowDefinitionRepository.get,
    workflowDefinitionRepository.save,
  );
  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleChangeDateField,
  ] = crudService.useChangeHandlers<WorkflowDefinition>(
    workflowDefinition,
    setWorkflowDefinition,
  );
  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  const [statusList] = crudService.useEnumList<Status>(
    workflowDefinitionRepository.singleListStatus,
  );
  const [workflowTypeFilter, setWorkflowTypeFilter] = React.useState<
    WorkflowTypeFilter
  >(new WorkflowTypeFilter());
  const [defaultWorkflowType] = crudService.useEnumList<Status>(
    workflowDefinitionRepository.singleListWorkflowType,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  return (
    <div className="page detail-page workflow-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-link btn-back"
                  onClick={handleGoBack}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <div className="pt-1 pl-1">
                  {isDetail
                    ? translate('general.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                  onClick={handleGoBack}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
              </div>
            </div>
          }
        >
          <Form>
            <div className="title-detail mt-2">
              {translate('workflows.detail.title')}
            </div>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDefinition
                  >(workflowDefinition.errors, nameof(workflowDefinition.code))}
                  help={workflowDefinition.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('workflows.code')}
                  </span>
                  <input
                    disabled={true}
                    type="text"
                    defaultValue={workflowDefinition.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(workflowDefinition.code),
                    )}
                    placeholder={translate('workflows.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDefinition
                  >(workflowDefinition.errors, nameof(workflowDefinition.name))}
                  help={workflowDefinition.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('workflows.name')}
                  </span>
                  <input
                    disabled={true}
                    type="text"
                    defaultValue={workflowDefinition.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(workflowDefinition.name),
                    )}
                    placeholder={translate('workflows.placeholder.name')}
                    // pattern=".{0,255}"
                    maxLength={255}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDefinition
                  >(
                    workflowDefinition.errors,
                    nameof(workflowDefinition.startDate),
                  )}
                  help={workflowDefinition.errors?.startDate}
                >
                  <span className="label-input ml-3">
                    {translate('workflows.startDate')}
                  </span>
                  <DatePicker
                    disabled={true}
                    value={
                      typeof workflowDefinition?.startDate === 'object'
                        ? workflowDefinition?.startDate
                        : null
                    }
                    onChange={handleChangeDateField(
                      nameof(workflowDefinition.startDate),
                    )}
                    className="w-100 mr-3"
                    placeholder={translate('workflows.placeholder.startDate')}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                  <span> đến </span>
                  <DatePicker
                    disabled={true}
                    value={
                      typeof workflowDefinition?.endDate === 'object'
                        ? workflowDefinition?.endDate
                        : null
                    }
                    onChange={handleChangeDateField(
                      nameof(workflowDefinition.endDate),
                    )}
                    className="w-100 ml-3"
                    placeholder={translate('workflows.placeholder.endDate')}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDefinition
                  >(
                    workflowDefinition.errors,
                    nameof(workflowDefinition.workflowType),
                  )}
                  help={workflowDefinition.errors?.workflowType}
                >
                  <span className="label-input ml-3">
                    {translate('workflows.workflowType')}
                  </span>
                  <SelectAutoComplete
                    disabled={true}
                    value={workflowDefinition.workflowType?.id}
                    onChange={handleChangeObjectField(
                      nameof(workflowDefinition.workflowType),
                    )}
                    getList={
                      workflowDefinitionRepository.singleListWorkflowType
                    }
                    modelFilter={workflowTypeFilter}
                    setModelFilter={setWorkflowTypeFilter}
                    searchField={nameof(workflowTypeFilter.name)}
                    searchType={nameof(workflowTypeFilter.name.contain)}
                    placeholder={translate(
                      'workflows.placeholder.workflowType',
                    )}
                    list={defaultWorkflowType}
                  />
                </FormItem>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<
                    WorkflowDefinition
                  >(
                    workflowDefinition.errors,
                    nameof(workflowDefinition.organization),
                  )}
                  help={workflowDefinition.errors?.organization}
                >
                  <span className="label-input ml-3">
                    {translate('workflows.organization')}
                    <span className="text-danger"> *</span>
                  </span>
                  <TreeSelectDropdown
                    defaultValue={workflowDefinition.organization?.id}
                    value={workflowDefinition.organization?.id}
                    mode="single"
                    onChange={handleChangeObjectField(
                      nameof(workflowDefinition.organization),
                    )}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    getList={
                      workflowDefinitionRepository.singleListOrganization
                    }
                    searchField={nameof(organizationFilter.id)}
                    placeholder={translate(
                      'workflows.placeholder.organization',
                    )}
                    disabled
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDefinition
                  >(
                    workflowDefinition.errors,
                    nameof(workflowDefinition.status),
                  )}
                  help={workflowDefinition.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('workflows.status')}
                  </span>
                  <Switch
                    checked={workflowDefinition.statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(workflowDefinition.status),
                    )}
                    disabled
                  />
                </FormItem>
              </Col>
            </Row>
            <div className="title mt-2">
              {translate('workflows.detail.steps')}
            </div>
            <WorkflowDefinitionPreviewContentTable
              model={workflowDefinition}
              setModel={setWorkflowDefinition}
            />
            <div className="title mt-2">
              {translate('workflows.detail.edit')}
            </div>
            <Row>
              <Col span={6}>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('workflows.editInfo.createdAt')}
                  </span>
                  <span>{formatDateTime(workflowDefinition?.createdAt)}</span>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('workflows.editInfo.creator')}
                  </span>
                  <span>{workflowDefinition?.creator?.displayName}</span>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('workflows.editInfo.updateAt')}
                  </span>
                  <span>{formatDateTime(workflowDefinition?.updatedAt)}</span>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('workflows.editInfo.updatePerson')}
                  </span>
                  <span>{workflowDefinition?.modifier?.displayName}</span>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
export default WorkflowDefinitionPreview;
