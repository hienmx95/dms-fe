import { Card, Col, Input, Row, Spin } from 'antd';
import Form from 'antd/lib/form';
import TextEditor from 'components/RichTextEditor/RichTextEditor';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { WORKFLOW_STEP_ROUTE } from 'config/route-consts';
import {
  aucompleteCallbackConfig,
  defaultContentStyle,
  EditorConfig,
  handleChangeMailTemplateOption,
} from 'core/models/EditorConfig';
import { crudService, formService, routerService } from 'core/services';
import { RoleFilter } from 'models/RoleFilter';
import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import { WorkflowParameterFilter } from 'models/WorkflowParameterFilter';
import { WorkflowStep } from 'models/WorkflowStep';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { workflowStepRepository } from 'views/WorkflowStepView/WorkflowStepRepository';
import './WorkflowStepDetail.scss';
const { Item: FormItem } = Form;

function WorkflowStepDetail() {
  const [translate] = useTranslation();
  const [handleGoBack] = routerService.useGoBack(WORKFLOW_STEP_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    workflowStep,
    setWorkflowStep,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    WorkflowStep,
    workflowStepRepository.get,
    workflowStepRepository.save,
  );
  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<WorkflowStep>(
    workflowStep,
    setWorkflowStep,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>(
    new RoleFilter(),
  );
  const [
    workflowDefinitionFilter,
    setWorkflowDefinitionFilter,
  ] = React.useState<WorkflowDefinitionFilter>(new WorkflowDefinitionFilter());

  const workflowFilter = React.useMemo(
    () => ({
      ...new WorkflowParameterFilter(),
      workflowTypeId: {
        equal: workflowStep.workflowDefinition?.workflowTypeId,
      },
    }),
    [workflowStep.workflowDefinition],
  );

  const fetch = React.useCallback(
    (pattern: string) => {
      const filter = {
        ...workflowFilter,
        displayName: { contain: pattern },
      };
      return new Promise(resolver => {
        workflowStepRepository
          .singleListWorkflowParameter(filter)
          .then(list => {
            const results = list.map(item => ({
              ...item,
              value: `${item.name};${item.id};${item.code}`,
              text: item.name,
            }));
            resolver(results);
          });
      });
    },
    [workflowFilter],
  );

  const config = React.useMemo(
    () => ({
      ...new EditorConfig(
        '100%',
        165,
        true,
        false,
        true,
        setup(fetch),
        defaultContentStyle,
      ),
    }),
    [fetch],
  );

  const refMessageCreator = React.useRef(null);

  React.useEffect(() => {
    const editorCreator = refMessageCreator.current?.editor;
    if (editorCreator) {
      editorCreator.ui.registry.addAutocompleter(
        'autocompleter-flags',
        aucompleteCallbackConfig(
          fetch,
          handleChangeMailTemplateOption(editorCreator),
        ),
      );
    } // update config of editorCurrent
  }, [fetch]);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  const [statusList] = crudService.useEnumList<Status>(
    workflowStepRepository.singleListStatus,
  );
  const workflowList: WorkflowDefinition[] = crudService.useDefaultList<
    WorkflowDefinition
  >(workflowStep.workflowDefinition);

  const handleChangeWorkflowDefinition = React.useCallback(
    (workflowDefinitionId, workflowDefinition) => {
      setWorkflowStep({
        ...workflowStep,
        workflowDefinitionId,
        workflowDefinition,
      });
      roleFilter.workflowDefinitionId.equal = workflowDefinitionId;
      setRoleFilter(roleFilter);
    },
    [workflowStep, setWorkflowStep, setRoleFilter, roleFilter],
  );
  return (
    <div className="page detail-page">
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
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              </div>
            </div>
          }
        >
          <Form className="workflow-step">
            <Row>
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<WorkflowStep>(
                    workflowStep.errors,
                    nameof(workflowStep.code),
                  )}
                  help={workflowStep.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('workflowSteps.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={workflowStep.code}
                    onChange={handleChangeSimpleField(
                      nameof(workflowStep.code),
                    )}
                    placeholder={translate('workflowSteps.code')}
                    className="form-control form-control-sm"
                    disabled={workflowStep.used}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<WorkflowStep>(
                    workflowStep.errors,
                    nameof(workflowStep.name),
                  )}
                  help={workflowStep.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('workflowSteps.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={workflowStep.name}
                    onChange={handleChangeSimpleField(
                      nameof(workflowStep.name),
                    )}
                    placeholder={translate('workflowSteps.name')}
                    className="form-control form-control-sm"
                    disabled={workflowStep.used}
                  />
                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<WorkflowStep>(
                    workflowStep.errors,
                    nameof(workflowStep.workflowDefinition),
                  )}
                  help={workflowStep.errors?.workflowDefinition}
                >
                  <span className="label-input ml-3">
                    {translate('workflowSteps.workflowDefinition')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={workflowStep.workflowDefinition?.id}
                    onChange={handleChangeWorkflowDefinition}
                    getList={
                      workflowStepRepository.singleListWorkflowDefinition
                    }
                    modelFilter={workflowDefinitionFilter}
                    setModelFilter={setWorkflowDefinitionFilter}
                    searchField={nameof(workflowDefinitionFilter.name)}
                    searchType={nameof(workflowDefinitionFilter.name.contain)}
                    placeholder={translate(
                      'workflowSteps.placeholder.workflowDefinition',
                    )}
                    disabled={isDetail}
                    list={workflowList}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<WorkflowStep>(
                    workflowStep.errors,
                    nameof(workflowStep.role),
                  )}
                  help={workflowStep.errors?.role}
                >
                  <span className="label-input ml-3">
                    {translate('workflowSteps.role')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={workflowStep.role?.id}
                    onChange={handleChangeObjectField(
                      nameof(workflowStep.role),
                    )}
                    getList={workflowStepRepository.singleListRole}
                    modelFilter={roleFilter}
                    setModelFilter={setRoleFilter}
                    searchField={nameof(roleFilter.name)}
                    searchType={nameof(roleFilter.name.contain)}
                    placeholder={translate('workflowSteps.placeholder.role')}
                    disabled={workflowStep.used}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <FormItem className="mb-3">
                  <span className="label-input mr-3">
                    {translate('workflowSteps.status')}
                  </span>
                  <SwitchStatus
                    checked={workflowStep.statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(workflowStep.status),
                    )}
                    disabled={workflowStep.used}
                  />
                </FormItem>
              </Col>
            </Row>
            <div className="title-detail">
              {translate('workflowSteps.detail.email')}
            </div>
            <Row>
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<WorkflowStep>(
                    workflowStep.errors,
                    nameof(workflowStep.subjectMailForReject),
                  )}
                  help={workflowStep.errors?.subjectMailForReject}
                >
                  <span className="label-input ml-3">
                    {translate('workflowSteps.subjectMailForReject')}
                  </span>
                  <Input
                    type="text"
                    value={workflowStep.subjectMailForReject}
                    onChange={handleChangeSimpleField(
                      nameof(workflowStep.subjectMailForReject),
                    )}
                    placeholder={translate(
                      'workflowSteps.subjectMailForReject',
                    )}
                    className="form-control form-control-sm"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem
                validateStatus={formService.getValidationStatus<WorkflowStep>(
                  workflowStep.errors,
                  nameof(workflowStep.bodyMailForReject),
                )}
                help={workflowStep.errors?.bodyMailForReject}
              >
                <span className="label ml-3">
                  {translate('workflowSteps.bodyMailForReject')}
                </span>
                <TextEditor
                  value={workflowStep.bodyMailForReject}
                  editorConfig={config}
                  ref={refMessageCreator}
                  onChange={handleChangeSimpleField(
                    nameof(workflowStep.bodyMailForReject),
                  )}
                  className="editor"
                />
              </FormItem>
            </Row>
          </Form>
          <div className="d-flex justify-content-end mt-4 mr-2">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
              onClick={handleGoBack}
            >
              <i className="fa mr-2 fa-times-circle " />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </Card>
      </Spin>
    </div>
  );
}

const setup = (fetch: (pattern: string) => Promise<any>) => {
  return editor => {
    editor.ui.registry.addAutocompleter('autocompleter-flags', {
      ch: '@',
      minChars: 2,
      columns: 1,
      fetch,
      onAction: handleChangeMailTemplateOption(editor),
    });
  };
};
export default WorkflowStepDetail;
