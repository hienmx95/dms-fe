import { Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { WORKFLOW_DIRECTION_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, tableService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowDirectionFilter } from 'models/WorkflowDirectionFilter';
import { WorkflowStep } from 'models/WorkflowStep';
import path from 'path';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import nameof from 'ts-nameof.macro';
import { workflowDefinitionRepository } from 'views/WorkflowDefinitionView/WorkflowDefinitionRepository';
import WorkflowDirectionPreview from 'views/WorkflowDirectionView/WorkflowDirectionMaster/WorkflowDirectionPreview';
import './WorkflowDefinitionPreviewContentTable.scss';
export interface WorkflowDefinitionPreviewContentTableProps {
  model: WorkflowDefinition;

  setModel: Dispatch<SetStateAction<WorkflowDefinition>>;
}

export default function WorkflowDefinitionPreviewContentTable(props: WorkflowDefinitionPreviewContentTableProps) {
  const { model, setModel } = props;
  const [translate] = useTranslation();
  const history = useHistory();
  const [
    workflowDirections,
    ,
    ,
    ,
  ] = crudService.useContentTable<WorkflowDefinition, WorkflowDirection>(
    model,
    setModel,
    nameof(model.workflowDirections),
  );
  const [workflowDirectionFilter, setWorkflowDirectionFilter] = React.useState<WorkflowDirectionFilter>(new WorkflowDirectionFilter());

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    workflowDirections,
    workflowDirectionFilter,
    setWorkflowDirectionFilter,
  );

  const [previewModel, setPreviewModel] = React.useState<WorkflowDirection>(new WorkflowDirection());
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = React.useState<boolean>(true);

  const handleGoCreate = React.useCallback(
    (id: number) => {
      return () => {
        history.push(path.join(WORKFLOW_DIRECTION_DETAIL_ROUTE + '/create?id=' + id));
      };
    },
    [history],
  );

  const handleGoPreview = React.useCallback((id: number) => {
    return () => {
      setPreviewVisible(true);
      workflowDefinitionRepository.getDirection(id).then((res) => {
        setPreviewModel(res);
        setPreviewLoading(false);
      }).catch(() => {
        setPreviewLoading(false);
      });
    };
  }, [setPreviewVisible, setPreviewLoading]);


  const handleClosePreview = React.useCallback(() => {
    setPreviewVisible(false);
  }, []);

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
          title: translate('workflows.workflowDirections.fromStep'),
          key: nameof(dataSource[0].fromStep),
          dataIndex: nameof(dataSource[0].fromStep),
          ellipsis: true,
          render(fromStep: WorkflowDirection) {
            return fromStep?.name;
          },
        },
        {
          title: translate('workflows.workflowDirections.role'),
          key: 'RoleFromStep',
          dataIndex: nameof(dataSource[0].fromStep),
          ellipsis: true,
          render(fromStep: WorkflowStep) {
            return fromStep?.role?.name;
          },
        },
        {
          title: translate('workflows.workflowDirections.toStep'),
          key: nameof(dataSource[0].toStep),
          dataIndex: nameof(dataSource[0].toStep),
          ellipsis: true,
          render(toStep: WorkflowDirection) {
            return toStep?.name;
          },
        },
        {
          title: translate('workflows.workflowDirections.role'),
          key: 'RoleToStep',
          dataIndex: nameof(dataSource[0].toStep),
          ellipsis: true,
          render(toStep: WorkflowStep) {
            return toStep?.role?.name;
          },
        },
        {
          title: translate('workflows.status'),
          key: nameof(dataSource[0].status),
          dataIndex: nameof(dataSource[0].status),
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
          dataIndex: nameof(dataSource[0].id),
          width: 150,
          align: 'center',
          render(id: number) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleGoPreview(id)}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                </Tooltip>
              </div>
            );
          },
        },
      ];
    }, [dataSource, pagination, translate, handleGoPreview],
  );
  return (
    <>

      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        tableLayout="fixed"
        pagination={pagination}
        onChange={handleTableChange}
        className="table-workflow-direction"
        title={() => (
          <>
            <div className="d-flex justify-content-between ml-2">
              <div className="flex-shrink-1 d-flex align-items-center">
                <button
                  className="btn btn-sm btn-primary ml-1"
                  onClick={handleGoCreate(model.id)}
                >
                  <i className="fa mr-2 fa-plus" />
                  {translate('eRouteContents.create')}
                </button>
              </div>
              <div className="flex-shrink-1 d-flex align-items-center mr-4">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total: pagination?.total,
                })}
              </div>
            </div>
          </>
        )}
      />
      <WorkflowDirectionPreview
        previewModel={previewModel}
        previewLoading={previewLoading}
        previewVisible={previewVisible}
        onClose={handleClosePreview}
      />
    </>

  );
}
