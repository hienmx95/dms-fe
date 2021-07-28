import { DatePicker, Input, Modal } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import { AxiosError } from 'axios';
import { formatInputDate } from 'components/AdvancedDateFilter/AdvancedDateFilter';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { notification } from 'helpers/notification';
import Switch from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { WORKFLOW_DEFINITION_ROUTE } from 'config/route-consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { crudService, formService, routerService } from 'core/services';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowTypeFilter } from 'models/WorkflowTypeFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { workflowDefinitionRepository } from '../WorkflowDefinitionRepository';

const { Item: FormItem } = Form;
function WorkflowDefinitionDetail() {
  const [translate] = useTranslation();
  const [handleGoBack] = routerService.useGoBack(WORKFLOW_DEFINITION_ROUTE);
  const [
    workflowDefinition,
    setWorkflowDefinition,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    WorkflowDefinition,
    workflowDefinitionRepository.get,
    workflowDefinitionRepository.save,
  );
  const [
    handleChangeSimpleField,
    handleChangeObjectField,
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

  const handleCheck = React.useCallback(() => {
    workflowDefinitionRepository
      .check(workflowDefinition)
      .then(res => {
        if (res && res?.hasConflict) {
          Modal.confirm({
            title: translate(''),
            content: translate('workflows.noti.content'),

            onOk() {
              handleSave();
            },
          });
          return;
        } // warning if conflict
        handleSave();
      })
      .catch((error: AxiosError<WorkflowDefinition>) => {
        if (error.response && error.response.status === 400) {
          setWorkflowDefinition(error.response?.data);
        } // setError when bad request
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        }); // notify to user
      });
  }, [workflowDefinition, handleSave, translate, setWorkflowDefinition]);

  const handleChangeDate = React.useCallback(
    (field: string) => {
      return (value: any) => {
        const errors = workflowDefinition.errors;
        if (field === 'startDate' && typeof value === 'object') {
          setWorkflowDefinition({
            ...workflowDefinition,
            startDate: value.startOf('day'),
          });
          if (typeof errors !== 'undefined' && errors !== null) {
            errors.startDate = null;
          }
        }
        if (field === 'endDate' && typeof value === 'object') {
          setWorkflowDefinition({
            ...workflowDefinition,
            endDate: value.endOf('day'),
          });
          if (typeof errors !== 'undefined' && errors !== null) {
            errors.endDate = null;
          }
        }
      };
    },
    [workflowDefinition, setWorkflowDefinition],
  );

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
                    ? translate('appUsers.detail.title')
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
                <button
                  className="btn btn-sm btn-primary float-right "
                  onClick={handleCheck}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              </div>
            </div>
          }
        >
          <Form>
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
                    <span className="text-danger"> *</span>
                  </span>
                  <Input
                    type="text"
                    value={workflowDefinition.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(workflowDefinition.code),
                    )}
                    placeholder={translate('workflows.placeholder.code')}
                    disabled={workflowDefinition.used}
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
                    <span className="text-danger"> *</span>
                  </span>
                  <Input
                    type="text"
                    value={workflowDefinition.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(workflowDefinition.name),
                    )}
                    placeholder={translate('workflows.placeholder.name')}
                    maxLength={255}
                    disabled={workflowDefinition.used}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDefinition
                  >(
                    workflowDefinition.errors,
                    nameof(workflowDefinition.endDate),
                  )}
                  help={workflowDefinition.errors?.startDate ? workflowDefinition.errors?.startDate : workflowDefinition.errors?.endDate}
                >
                  <span className="label-input ml-3">
                    {translate('workflows.startDate')}
                  </span>
                  <DatePicker
                    value={formatInputDate(workflowDefinition?.startDate)}
                    onChange={handleChangeDate(
                      nameof(workflowDefinition.startDate),
                    )}
                    className="w-100 mr-3"
                    placeholder={translate('workflows.placeholder.startDate')}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                    disabled={workflowDefinition.used}
                  />
                  <span> đến </span>
                  <DatePicker
                    value={formatInputDate(workflowDefinition?.endDate)}
                    onChange={handleChangeDate(
                      nameof(workflowDefinition.endDate),
                    )}
                    className="w-100 ml-3"
                    placeholder={translate('workflows.placeholder.endDate')}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                    disabled={workflowDefinition.used}
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
                    <span className="text-danger"> *</span>
                  </span>
                  <SelectAutoComplete
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
                    disabled={workflowDefinition.used}
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
                    disabled={workflowDefinition.used}
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
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
export default WorkflowDefinitionDetail;
