import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex, indexInContent } from 'helpers/ant-design/table';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowDirectionCondition } from 'models/WorkflowDirectionCondition';
import { WorkflowDirectionConditionFilter } from 'models/WorkflowDirectionConditionFilter';
import { Tooltip } from 'antd';
import { workflowDirectionRepository } from 'views/WorkflowDirectionView/WorkflowDirectionRepository';
import { WorkflowOperatorFilter } from 'models/WorkflowOperatorFilter';
import FieldInput from './FieldInput';
import { WorkflowParameterFilter } from 'models/WorkflowParameterFilter';
import './WorkflowDirectionContentTable.scss';
export interface WorkflowDirectionConditionTableProps {
  model?: WorkflowDefinition;
  setModel: Dispatch<SetStateAction<WorkflowDefinition>>;

  workflowTypeId?: number;
}
const { Item: FormItem } = Form;

function WorkflowDirectionContentTable(
  props?: WorkflowDirectionConditionTableProps,
) {
  const [translate] = useTranslation();
  const { model, setModel, workflowTypeId } = props;

  const [
    workflowDirectionConditions,
    setWorkflowDirectionConditions,
    ,
    handleDelete,
  ] = crudService.useContentTable<
    WorkflowDefinition,
    WorkflowDirectionCondition
  >(model, setModel, nameof(model.workflowDirectionConditions));

  const [, handleChangeListObjectField] = crudService.useListChangeHandlers<
    WorkflowDirectionCondition
  >(workflowDirectionConditions, setWorkflowDirectionConditions);

  const [workflowTypeContentId, setWorkflowTypeContentId] = React.useState<
    number
  >();

  const [
    workflowDirectionConditionFilter,
    setWorkflowDirectionConditionFilter,
  ] = React.useState<WorkflowDirectionConditionFilter>(
    new WorkflowDirectionConditionFilter(),
  );

  const [dataSource, pagination] = tableService.useLocalTable(
    workflowDirectionConditions,
    workflowDirectionConditionFilter,
    setWorkflowDirectionConditionFilter,
  );

  React.useEffect(() => {
    if (
      model &&
      model.workflowDefinition &&
      model.workflowDefinition.workflowTypeId
    ) {
      setWorkflowTypeContentId(model.workflowDefinition.workflowTypeId);
    } else {
      setWorkflowTypeContentId(workflowTypeId);
    }
  }, [model, setWorkflowTypeContentId, workflowTypeId]);
  const [
    contentFilters,
    setContentFilters,
    handleChangeWorkflowParameter,
  ] = useWorkflowDirectionConditionFilters(
    workflowTypeContentId,
    workflowDirectionConditions,
    setWorkflowDirectionConditions,
  );

  const handleAdd = React.useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const newContent: WorkflowDirectionCondition = new WorkflowDirectionCondition();
      newContent.key = uuidv4();
      setWorkflowDirectionConditions([
        ...workflowDirectionConditions,
        newContent,
      ]);
    },
    [setWorkflowDirectionConditions, workflowDirectionConditions],
  );

  const columns: ColumnProps<WorkflowDirectionCondition>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: 60,
          render: renderMasterIndex<WorkflowDirectionCondition>(pagination),
        },
        {
          title: translate('workflowDirectionConditions.workflowParameterId'),
          key: nameof(dataSource[0].workflowParameterId),
          dataIndex: nameof(dataSource[0].workflowParameterId),
          render(...[workflowParameterId, record, index]) {
            return (
              <FormItem
                validateStatus={formService.getValidationStatus<any>(
                  record.errors,
                  nameof(record.workflowParameter),
                )}
                help={record.errors?.workflowParameter}
              >
                <SelectAutoComplete
                  value={workflowParameterId}
                  onChange={handleChangeWorkflowParameter(
                    indexInContent(index),
                  )}
                  getList={
                    workflowDirectionRepository.singleListWorkflowParameter
                  }
                  modelFilter={contentFilters[index]?.workflowParameterFilter}
                  setModelFilter={setContentFilters(
                    index,
                    'workflowParameterFilter',
                  )}
                  searchField={'name'}
                  searchType={'contain'}
                  placeholder={translate(
                    'workflowDirectionConditions.placeholder.workflowParameter',
                  )}
                  disabled={
                    workflowTypeContentId === undefined ||
                    workflowTypeContentId === 0 ||
                    model.used
                  }
                />
              </FormItem>
            );
          },
        },

        {
          title: translate('workflowDirectionConditions.workflowOperator'),
          key: nameof(dataSource[0].workflowOperatorId),
          dataIndex: nameof(dataSource[0].workflowOperatorId),
          render(...[workflowOperatorId, record, index]) {
            return (
              <>
                <FormItem
                  validateStatus={formService.getValidationStatus<any>(
                    record.errors,
                    nameof(record.permissionOperator),
                  )}
                  help={record.errors?.permissionOperator}
                >
                  <SelectAutoComplete
                    value={workflowOperatorId}
                    onChange={handleChangeListObjectField(
                      nameof(workflowDirectionConditions[0].workflowOperator),
                      indexInContent(index),
                    )}
                    getList={
                      workflowDirectionRepository.singleListWorkflowOperator
                    }
                    modelFilter={contentFilters[index]?.operatorFilter}
                    setModelFilter={setContentFilters(index, 'operatorFilter')}
                    searchField={'name'}
                    searchType={'contain'}
                    placeholder={translate(
                      'workflowDirectionConditions.placeholder.workflowOperator',
                    )}
                    disabled={
                      record.workflowParameterId === undefined ||
                      record.workflowParameterId === 0 ||
                      model.used
                    }
                  />
                </FormItem>
              </>
            );
          },
        },

        {
          title: translate('workflowDirectionConditions.value'),
          key: nameof(dataSource[0].value),
          dataIndex: nameof(dataSource[0].value),
          width: 400,
          render(...[value, record, index]) {
            return (
              <>
                <FieldInput
                  value={value}
                  index={index}
                  contents={workflowDirectionConditions}
                  setContents={setWorkflowDirectionConditions}
                  disabled={
                    record.workflowOperatorId === undefined ||
                    record.workflowOperatorId === 0 ||
                    typeof record.errors?.workflowOperatorId === 'string' ||
                    model.used
                  }
                />
              </>
            );
          },
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(dataSource[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(...[, , index]) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {!model.used &&
                  <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(indexInContent(index, pagination))}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                }
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      dataSource,
      handleChangeListObjectField,
      // handleChangeRowFieldContent,
      handleDelete,
      pagination,
      workflowDirectionConditions,
      translate,
      contentFilters,
      handleChangeWorkflowParameter,
      setContentFilters,
      setWorkflowDirectionConditions,
      workflowTypeContentId,
      model,
    ],
  );
  const tableFooter = React.useCallback(
    () => (
      <>
        {
          !model.used && <button className="btn btn-link" onClick={handleAdd}>
            <i className="fa fa-plus mr-2" />
            {translate(generalLanguageKeys.actions.create)}
          </button>
        }

      </>
    ),
    [handleAdd, translate, model],
  );

  return (
    <div className="table-content">
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        tableLayout="fixed"
        footer={tableFooter}
        className="ml-24"
        rowKey={nameof(dataSource[0].key)}
        scroll={{ y: 450 }}
      />
    </div>
  );
}

function useWorkflowDirectionConditionFilters(
  workflowTypeId: number,
  contents: WorkflowDirectionCondition[],
  setContents: (v: WorkflowDirectionCondition[]) => void,
): [
    any[],
    (index: number, field: string) => (f: any) => void,
    (index: number) => (value, model) => void,
  ] {
  const [contentFilters, setContentFilters] = React.useState<any[]>([]);
  React.useEffect(() => {
    const filters = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < contents.length; i++) {
      const workflowParameterTypeId =
        contents[i]?.workflowParameter?.workflowParameterTypeId;
      const workflowParameterFilter = {
        ...new WorkflowParameterFilter(),
        workflowTypeId: { equal: workflowTypeId },
      };
      const operatorFilter = {
        ...new WorkflowOperatorFilter(),
        workflowParameterTypeId: { equal: workflowParameterTypeId },
      };
      filters.push({
        workflowParameterFilter,
        operatorFilter,
      });
    }
    setContentFilters([...filters]);
  }, [contents, workflowTypeId]);


  const setFilterList = React.useCallback(
    (index: number, field) => {
      return (f: any) => {
        contentFilters[index] = { ...contentFilters[index], [field]: f };
        setContentFilters([...contentFilters]);
      };
    },
    [contentFilters],
  );

  const handleChangeWorkflowParameter = React.useCallback(
    (index: number) => {
      return (value, model?) => {
        // in case field is UserId, set workflowOperatorId = ID_EQ instantly
        if (model?.workflowParameterTypeId === 1) {
          contents[index] = {
            ...contents[index],
            workflowParameter: model,
            workflowParameterId: value,
            workflowOperatorId: 0, // ID_EQ, Id = 101, workflowParameterTypeId = 1
            value: undefined,
          };
          setContents([...contents]);
          return;
        }
        // update field in WorkflowDirectionCondition
        contents[index] = {
          ...contents[index],
          workflowParameterId: value,
          workflowParameter: model,
          workflowOperatorId: undefined,
          value: undefined,
        };
        setContents([...contents]);
        contentFilters[index].operatorFilter = {
          ...contentFilters[index].operatorFilter,
          workflowParameterTypeId: { equal: model?.workflowParameterTypeId },
        };
        setContentFilters([...contentFilters]);
      };
    },
    [contentFilters, setContentFilters, contents, setContents],
  );
  /* return each content one FieldFilter, PermissionOperatorFilter */
  return [contentFilters, setFilterList, handleChangeWorkflowParameter];
}
export default WorkflowDirectionContentTable;
