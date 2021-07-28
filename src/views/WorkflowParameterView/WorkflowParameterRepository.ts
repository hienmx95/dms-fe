import { API_WORKFLOW_PARAMETER_ROUTE } from './../../config/api-consts';
import { WorkflowParameter } from 'models/WorkflowParameter';
import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import kebabCase from 'lodash/kebabCase';
import { AxiosResponse } from 'axios';
import { PureModelData, BatchId } from 'react3l';
import nameof from 'ts-nameof.macro';
import { WorkflowTypeFilter } from 'models/WorkflowTypeFilter';
import { WorkflowType } from 'models/WorkflowType';

export class WorkflowParameterRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_WORKFLOW_PARAMETER_ROUTE));
  }
  public count = (
    workflowFilter?: WorkflowDefinitionFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), workflowFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    workflowFilter?: WorkflowDefinitionFilter,
  ): Promise<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.list)), workflowFilter)
      .then((response: AxiosResponse<WorkflowDefinition>) => {
        return response.data?.map(
          (workflow: PureModelData<WorkflowDefinition>) =>
            WorkflowDefinition.clone<WorkflowDefinition>(workflow),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public filterListWorkflowType = (): Promise<WorkflowType[]> => {
    return this.http
      .post<WorkflowType[]>(
        kebabCase(nameof(this.filterListWorkflowType)),
        new WorkflowTypeFilter(),
      )
      .then((response: AxiosResponse<WorkflowType[]>) => {
        return response.data.map((workflowType: PureModelData<WorkflowType>) =>
          WorkflowType.clone<WorkflowType>(workflowType),
        );
      });
  };

  public filterListWorkflowParameterType = (): Promise<WorkflowType[]> => {
    return this.http
      .post<WorkflowType[]>(
        kebabCase(nameof(this.filterListWorkflowParameterType)),
        new WorkflowTypeFilter(),
      )
      .then((response: AxiosResponse<WorkflowType[]>) => {
        return response.data.map((workflowType: PureModelData<WorkflowType>) =>
          WorkflowType.clone<WorkflowType>(workflowType),
        );
      });
  };
}
export const workflowParameterRepository: WorkflowParameter = new WorkflowParameterRepository();
