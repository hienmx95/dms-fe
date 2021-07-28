import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import TextEditor from 'components/RichTextEditor/RichTextEditor';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { WORKFLOW_DIRECTION_ROUTE } from 'config/route-consts';
import {
  aucompleteCallbackConfig,
  defaultContentStyle,
  EditorConfig,
  handleChangeMailTemplateOption,
} from 'core/models/EditorConfig';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowParameterFilter } from 'models/WorkflowParameterFilter';
import { WorkflowStep } from 'models/WorkflowStep';
import { WorkflowStepFilter } from 'models/WorkflowStepFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { workflowDirectionRepository } from 'views/WorkflowDirectionView/WorkflowDirectionRepository';
import WorkflowDirectionContentTable from './WorkflowDirectionContentTable/WorkflowDirectionContentTable';
import './WorkflowDirectionDetail.scss';

const { Item: FormItem } = Form;

function WorkflowDirectionDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack(WORKFLOW_DIRECTION_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    workflowDirection,
    setWorkflowDirection,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    WorkflowDirection,
    workflowDirectionRepository.get,
    workflowDirectionRepository.save,
  );

  const workflowFilter = React.useMemo(
    () => ({
      ...new WorkflowParameterFilter(),
      workflowTypeId: {
        equal: workflowDirection.workflowDefinition?.workflowTypeId,
      },
    }),
    [workflowDirection.workflowDefinition],
  );

  const fetch = React.useCallback(
    (pattern: string) => {
      const filter = {
        ...workflowFilter,
        displayName: { contain: pattern },
      };
      return new Promise(resolver => {
        workflowDirectionRepository
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

  const refMessageCurrent = React.useRef(null);
  const refMessageNextStep = React.useRef(null);
  const refMessageCreator = React.useRef(null);

  React.useEffect(() => {
    const editorCurent = refMessageCurrent.current?.editor;
    const editorNextStep = refMessageNextStep.current?.editor;
    const editorCreator = refMessageCreator.current?.editor;

    if (editorCurent) {
      editorCurent.ui.registry.addAutocompleter(
        'autocompleter-flags',
        aucompleteCallbackConfig(
          fetch,
          handleChangeMailTemplateOption(editorCurent),
        ),
      );
    } // update config of editorCurrent
    if (editorNextStep) {
      editorNextStep.ui.registry.addAutocompleter(
        'autocompleter-flags',
        aucompleteCallbackConfig(
          fetch,
          handleChangeMailTemplateOption(editorNextStep),
        ),
      );
    } // update config of editorNextStep
    if (editorCreator) {
      editorCreator.ui.registry.addAutocompleter(
        'autocompleter-flags',
        aucompleteCallbackConfig(
          fetch,
          handleChangeMailTemplateOption(editorCreator),
        ),
      );
    } // update config of editorCreator
  }, [fetch]);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<WorkflowDirection>(
    workflowDirection,
    setWorkflowDirection,
  );
  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [workflowStepFilter, setWorkflowStepFilter] = React.useState<
    WorkflowStepFilter
  >(new WorkflowStepFilter());

  const [
    workflowDefinitionFilter,
    setWorkflowDefinitionFilter,
  ] = React.useState<WorkflowDefinitionFilter>(new WorkflowDefinitionFilter());

  const [statusList] = crudService.useEnumList<Status>(
    workflowDirectionRepository.singleListStatus,
  );

  const workflowList: WorkflowDefinition[] = crudService.useDefaultList<
    WorkflowDefinition
  >(workflowDirection.workflowDefinition);

  const toStepList: WorkflowStep[] = crudService.useDefaultList<WorkflowStep>(
    workflowDirection.toStep,
  );

  const fromStepList: WorkflowStep[] = crudService.useDefaultList<WorkflowStep>(
    workflowDirection.fromStep,
  );

  const [onCreate, setOnCreate] = React.useState<boolean>(true);
  const [workflowTypeId, setWorkflowTypeId] = React.useState<number>(undefined);
  const url = document.URL;
  const [resetFromStep, setResetFromStep] = React.useState<boolean>(false);
  const [resetToStep, setResetToStep] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (workflowDirection.workflowDefinition) {
      const id: number = workflowDirection.workflowDefinition?.id;
      workflowStepFilter.workflowDefinitionId.equal = id;
      setWorkflowStepFilter(workflowStepFilter);
    }
  }, [workflowDirection.workflowDefinition, workflowStepFilter]);

  const handleChangeWorkflowDefinition = React.useCallback(
    (event, item) => {
      const workflowDefinitionId = event;
      const workflowDefinition = item;

      if (
        workflowStepFilter.workflowDefinitionId.equal !== workflowDefinitionId
      ) {
        const errors = workflowDirection.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.workflowDefinition = null;
        }
        const toStep = undefined;
        const toStepId = undefined;
        const fromStep = undefined;
        const fromStepId = undefined;
        const workflowDirectionConditions = undefined;
        setWorkflowDirection({
          ...workflowDirection,
          toStep,
          toStepId,
          fromStep,
          fromStepId,
          workflowDefinition,
          workflowDefinitionId,
          workflowDirectionConditions,
          errors,
        });
        setResetFromStep(true);
        setResetToStep(true);
        workflowStepFilter.workflowDefinitionId.equal = workflowDefinitionId;
      }
      const typeId = item.workflowTypeId;
      setWorkflowTypeId(typeId);
    },
    [
      setWorkflowDirection,
      workflowStepFilter.workflowDefinitionId.equal,
      setWorkflowTypeId,
      workflowDirection,
    ],
  );

  React.useEffect(() => {
    if (url.includes('?id')) {
      const temp = url.split('id=');
      if (onCreate === true) {
        workflowDirectionRepository
          .singleListWorkflowDefinition({
            ...workflowDefinitionFilter,
            id: { equal: +temp[1] },
          })
          .then(listWorkflowDefinition => {
            if (listWorkflowDefinition.length) {
              setWorkflowDirection({
                ...workflowDirection,
                workflowDefinitionId: Number(temp[1]),
                workflowDefinition: listWorkflowDefinition[0],
              });
            }
          });
        setOnCreate(false);
      }
    }
  }, [
    onCreate,
    setWorkflowDirection,
    url,
    workflowDefinitionFilter,
    workflowDirection,
  ]);

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
                  className="btn btn-sm btn-primary float-right"
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              </div>
            </div>
          }
        >
          <Form className="workflow-direction">
            <Row>
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.workflowDefinition),
                  )}
                  help={workflowDirection.errors?.workflowDefinition}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.workflowDefinition')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    defaultValue={workflowDirection.workflowDefinition?.id}
                    value={workflowDirection.workflowDefinition?.id}
                    onChange={handleChangeWorkflowDefinition}
                    getList={
                      workflowDirectionRepository.singleListWorkflowDefinition
                    }
                    modelFilter={workflowDefinitionFilter}
                    setModelFilter={setWorkflowDefinitionFilter}
                    searchField={nameof(workflowDefinitionFilter.name)}
                    searchType={nameof(workflowDefinitionFilter.name.contain)}
                    placeholder={translate(
                      'workflowDirections.placeholder.workflowDefinition',
                    )}
                    disabled={
                      url.includes('?id') || workflowDirection.used
                        ? true
                        : false
                    }
                    list={workflowList}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.fromStep),
                  )}
                  help={workflowDirection.errors?.fromStep}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.fromStep')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={workflowDirection.fromStep?.id}
                    onChange={handleChangeObjectField(
                      nameof(workflowDirection.fromStep),
                    )}
                    getList={workflowDirectionRepository.singleListWorkflowStep}
                    modelFilter={workflowStepFilter}
                    setModelFilter={setWorkflowStepFilter}
                    searchField={nameof(workflowStepFilter.name)}
                    searchType={nameof(workflowStepFilter.name.contain)}
                    placeholder={translate(
                      'workflowDirections.placeholder.workflowStep',
                    )}
                    disabled={
                      !workflowDirection.workflowDefinitionId ||
                      workflowDirection.used
                    }
                    list={fromStepList}
                    isReset={resetFromStep}
                    setIsReset={setResetFromStep}
                  />
                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(workflowDirection.errors, nameof(workflowDirection.toStep))}
                  help={workflowDirection.errors?.toStep}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.toStep')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={workflowDirection.toStep?.id}
                    onChange={handleChangeObjectField(
                      nameof(workflowDirection.toStep),
                    )}
                    getList={workflowDirectionRepository.singleListWorkflowStep}
                    modelFilter={workflowStepFilter}
                    setModelFilter={setWorkflowStepFilter}
                    searchField={nameof(workflowStepFilter.name)}
                    searchType={nameof(workflowStepFilter.name.contain)}
                    placeholder={translate(
                      'workflowDirections.placeholder.workflowStep',
                    )}
                    disabled={
                      !workflowDirection.workflowDefinitionId ||
                      workflowDirection.used
                    }
                    list={toStepList}
                    isReset={resetToStep}
                    setIsReset={setResetToStep}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <FormItem className="mb-3">
                  <span className="label-input ml-3">
                    {translate('workflowDirections.status')}
                  </span>
                  <SwitchStatus
                    checked={workflowDirection.statusId === 1 ? true : false}
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(workflowDirection.status),
                    )}
                    disabled={workflowDirection.used}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem className="mb-3">
                <span className="label-input-table ml-3">
                  {translate('workflowDirections.workflowDirectionConditions')}
                </span>
                <WorkflowDirectionContentTable
                  model={workflowDirection}
                  setModel={setWorkflowDirection}
                  workflowTypeId={workflowTypeId}
                />
              </FormItem>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="title-detail">
                  {translate(
                    'workflowDirections.title.subjectMailForCurrentStep',
                  )}
                </div>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.subjectMailForCurrentStep),
                  )}
                  help={workflowDirection.errors?.subjectMailForCurrentStep}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.subjectMail')}
                  </span>
                  <input
                    type="text"
                    defaultValue={workflowDirection.subjectMailForCurrentStep}
                    onChange={handleChangeSimpleField(
                      nameof(workflowDirection.subjectMailForCurrentStep),
                    )}
                    placeholder={translate(
                      'workflowDirections.placeholder.subjectMail',
                    )}
                    className="form-control form-control-sm"
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.bodyMailForCurrentStep),
                  )}
                  help={workflowDirection.errors?.bodyMailForCurrentStep}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.bodyMail')}
                  </span>
                  <TextEditor
                    ref={refMessageCurrent}
                    value={workflowDirection.bodyMailForCurrentStep || ''}
                    editorConfig={config}
                    onChange={handleChangeSimpleField(
                      nameof(workflowDirection.bodyMailForCurrentStep),
                    )}
                    className="editor"
                  />
                </FormItem>
              </Col>
              <Col lg={12}>
                <div className="title-detail">
                  {translate('workflowDirections.title.subjectMailForNextStep')}
                </div>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.subjectMailForNextStep),
                  )}
                  help={workflowDirection.errors?.subjectMailForNextStep}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.subjectMail')}
                  </span>
                  <input
                    type="text"
                    defaultValue={workflowDirection.subjectMailForNextStep}
                    onChange={handleChangeSimpleField(
                      nameof(workflowDirection.subjectMailForNextStep),
                    )}
                    placeholder={translate(
                      'workflowDirections.placeholder.subjectMail',
                    )}
                    className="form-control form-control-sm"
                    disabled={!workflowDirection.workflowDefinitionId}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.bodyMailForNextStep),
                  )}
                  help={workflowDirection.errors?.bodyMailForNextStep}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.bodyMail')}
                  </span>
                  <TextEditor
                    ref={refMessageNextStep}
                    value={workflowDirection.bodyMailForNextStep || ''}
                    editorConfig={config}
                    onChange={handleChangeSimpleField(
                      nameof(workflowDirection.bodyMailForNextStep),
                    )}
                    className="editor"
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col lg={12} span={11}>
                <div className="title-detail">
                  {translate('workflowDirections.title.subjectMailForCreator')}
                </div>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.subjectMailForCreator),
                  )}
                  help={workflowDirection.errors?.subjectMailForCreator}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.subjectMail')}
                  </span>
                  <input
                    type="text"
                    defaultValue={workflowDirection.subjectMailForCreator}
                    onChange={handleChangeSimpleField(
                      nameof(workflowDirection.subjectMailForCreator),
                    )}
                    placeholder={translate(
                      'workflowDirections.placeholder.subjectMail',
                    )}
                    className="form-control form-control-sm"
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    WorkflowDirection
                  >(
                    workflowDirection.errors,
                    nameof(workflowDirection.bodyMailForCreator),
                  )}
                  help={workflowDirection.errors?.bodyMailForCreator}
                >
                  <span className="label-input ml-3">
                    {translate('workflowDirections.bodyMail')}
                  </span>
                  <TextEditor
                    ref={refMessageCreator}
                    value={workflowDirection.bodyMailForCreator || ''}
                    editorConfig={config}
                    onChange={handleChangeSimpleField(
                      nameof(workflowDirection.bodyMailForCreator),
                    )}
                    className="editor"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
              onClick={handleGoBack}
            >
              <i className="fa mr-2 fa-times-circle" />
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
export default WorkflowDirectionDetail;
