import { WorkflowDirection } from 'models/WorkflowDirection';
import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { API_WORKFLOW_ROUTE } from 'config/api-consts';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import kebabCase from 'lodash/kebabCase';
import { AxiosResponse } from 'axios';
import { PureModelData, BatchId } from 'react3l';
import nameof from 'ts-nameof.macro';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { WorkflowTypeFilter } from 'models/WorkflowTypeFilter';
import { WorkflowType } from 'models/WorkflowType';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { buildTree } from 'helpers/tree';

export class WorkflowDefinitionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_WORKFLOW_ROUTE));
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

  public get = (id: number | string): Promise<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<WorkflowDefinition>) =>
        WorkflowDefinition.clone<WorkflowDefinition>(response.data),
      );
  };

  public getDirection = (id: number | string): Promise<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(kebabCase(nameof(this.getDirection)), {
        id,
      })
      .then((response: AxiosResponse<WorkflowDirection>) =>
        WorkflowDirection.clone<WorkflowDirection>(response.data),
      );
  };

  public check = (
    workflow: WorkflowDefinition,
  ): Promise<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.check)), workflow)
      .then((response: AxiosResponse<PureModelData<WorkflowDefinition>>) =>
        WorkflowDefinition.clone<WorkflowDefinition>(response.data),
      );
  };

  public create = (
    workflow: WorkflowDefinition,
  ): Promise<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.create)), workflow)
      .then((response: AxiosResponse<PureModelData<WorkflowDefinition>>) =>
        WorkflowDefinition.clone<WorkflowDefinition>(response.data),
      );
  };

  public update = (
    workflow: WorkflowDefinition,
  ): Promise<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.update)), workflow)
      .then((response: AxiosResponse<WorkflowDefinition>) =>
        WorkflowDefinition.clone<WorkflowDefinition>(response.data),
      );
  };

  public delete = (
    workflow: WorkflowDefinition,
  ): Promise<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.delete)), workflow)
      .then((response: AxiosResponse<WorkflowDefinition>) =>
        WorkflowDefinition.clone<WorkflowDefinition>(response.data),
      );
  };

  public save = (
    workflowDefinition: WorkflowDefinition,
  ): Promise<WorkflowDefinition> => {
    return workflowDefinition.id
      ? this.update(workflowDefinition)
      : this.create(workflowDefinition);
  };
  public singleListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };
  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public singleListWorkflowType = (): Promise<WorkflowType[]> => {
    return this.http
      .post<WorkflowType[]>(
        kebabCase(nameof(this.singleListWorkflowType)),
        new WorkflowTypeFilter(),
      )
      .then((response: AxiosResponse<WorkflowType[]>) => {
        return response.data.map((workflowType: PureModelData<WorkflowType>) =>
          WorkflowType.clone<WorkflowType>(workflowType),
        );
      });
  };
  public filterListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public filterListWorkflowType = (
    workflowType: WorkflowTypeFilter,
  ): Promise<WorkflowType[]> => {
    return this.http
      .post<WorkflowType[]>(
        kebabCase(nameof(this.filterListWorkflowType)),
        workflowType,
      )
      .then((response: AxiosResponse<WorkflowType[]>) => {
        return response.data.map((workflowType: PureModelData<WorkflowType>) =>
          WorkflowType.clone<WorkflowType>(workflowType),
        );
      });
  };

  public clone = (id: number | string): Promise<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.clone)), { id })
      .then((response: AxiosResponse<WorkflowDefinition>) =>
        WorkflowDefinition.clone<WorkflowDefinition>(response.data),
      );
  };
  public singleListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };

  public filterListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };
}
export const workflowDefinitionRepository: WorkflowDefinition = new WorkflowDefinitionRepository();
