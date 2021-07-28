import { buildTree } from 'helpers/tree';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_WORKFLOW_DIRECTION_ROUTE } from 'config/api-consts';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowDirectionFilter } from 'models/WorkflowDirectionFilter';
import { WorkflowStep } from 'models/WorkflowStep';
import { WorkflowStepFilter } from 'models/WorkflowStepFilter';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { WorkflowParameterFilter } from 'models/WorkflowParameterFilter';
import { WorkflowParameter } from 'models/WorkflowParameter';
import { WorkflowOperator } from 'models/WorkflowOperator';
import { WorkflowOperatorFilter } from 'models/WorkflowOperatorFilter';
import { Organization } from 'models/Organization';
import moment from 'moment';
export class WorkflowDirectionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_WORKFLOW_DIRECTION_ROUTE));
  }

  public count = (
    workflowDirectionFilter?: WorkflowDirectionFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), workflowDirectionFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    workflowDirectionFilter?: WorkflowDirectionFilter,
  ): Promise<WorkflowDirection[]> => {
    return this.http
      .post<WorkflowDirection[]>(
        kebabCase(nameof(this.list)),
        workflowDirectionFilter,
      )
      .then((response: AxiosResponse<WorkflowDirection[]>) => {
        return response.data?.map(
          (workflowDirection: PureModelData<WorkflowDirection>) =>
            WorkflowDirection.clone<WorkflowDirection>(workflowDirection),
        );
      });
  };

  public get = (id: number | string): Promise<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<WorkflowDirection>) =>
        WorkflowDirection.clone<WorkflowDirection>(response.data),
      );
  };

  public create = (
    workflowDirection: WorkflowDirection,
  ): Promise<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(
        kebabCase(nameof(this.create)),
        workflowDirection,
      )
      .then((response: AxiosResponse<PureModelData<WorkflowDirection>>) =>
        WorkflowDirection.clone<WorkflowDirection>(response.data),
      );
  };

  public update = (
    workflowDirection: WorkflowDirection,
  ): Promise<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(
        kebabCase(nameof(this.update)),
        workflowDirection,
      )
      .then((response: AxiosResponse<WorkflowDirection>) =>
        WorkflowDirection.clone<WorkflowDirection>(response.data),
      );
  };

  public delete = (
    workflowDirection: WorkflowDirection,
  ): Promise<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(
        kebabCase(nameof(this.delete)),
        workflowDirection,
      )
      .then((response: AxiosResponse<WorkflowDirection>) =>
        WorkflowDirection.clone<WorkflowDirection>(response.data),
      );
  };

  public save = (
    workflowDirection: WorkflowDirection,
  ): Promise<WorkflowDirection> => {
    return workflowDirection.id
      ? this.update(workflowDirection)
      : this.create(workflowDirection);
  };

  public singleListWorkflowStep = (
    workflowStepFilter: WorkflowStepFilter,
  ): Promise<WorkflowStep[]> => {
    return this.http
      .post<WorkflowStep[]>(
        kebabCase(nameof(this.singleListWorkflowStep)),
        workflowStepFilter,
      )
      .then((response: AxiosResponse<WorkflowStep[]>) => {
        return response.data.map((workflowStep: PureModelData<WorkflowStep>) =>
          WorkflowStep.clone<WorkflowStep>(workflowStep),
        );
      });
  };
  public filterListWorkflowStep = (
    workflowStepFilter: WorkflowStepFilter,
  ): Promise<WorkflowStep[]> => {
    return this.http
      .post<WorkflowStep[]>(
        kebabCase(nameof(this.filterListWorkflowStep)),
        workflowStepFilter,
      )
      .then((response: AxiosResponse<WorkflowStep[]>) => {
        return response.data.map((workflowStep: PureModelData<WorkflowStep>) =>
          WorkflowStep.clone<WorkflowStep>(workflowStep),
        );
      });
  };
  public singleListWorkflowDefinition = (
    workflowDefinitionFilter: WorkflowDefinitionFilter,
  ): Promise<WorkflowDefinition[]> => {
    return this.http
      .post<WorkflowDefinition[]>(
        kebabCase(nameof(this.singleListWorkflowDefinition)),
        {
          ...workflowDefinitionFilter,
          endDate: {
            greaterEqual: moment(),
          }, // filter out workflow expired
        },
      )
      .then((response: AxiosResponse<WorkflowDefinition[]>) => {
        return response.data.map(
          (workflowDefinition: PureModelData<WorkflowDefinition>) =>
            WorkflowDefinition.clone<WorkflowDefinition>(workflowDefinition),
        );
      });
  };
  public filterListWorkflowDefinition = (
    workflowDefinitionFilter: WorkflowDefinitionFilter,
  ): Promise<WorkflowDefinition[]> => {
    return this.http
      .post<WorkflowDefinition[]>(
        kebabCase(nameof(this.filterListWorkflowDefinition)),
        workflowDefinitionFilter,
      )
      .then((response: AxiosResponse<WorkflowDefinition[]>) => {
        return response.data.map(
          (workflowDefinition: PureModelData<WorkflowDefinition>) =>
            WorkflowDefinition.clone<WorkflowDefinition>(workflowDefinition),
        );
      });
  };

  public singleListWorkflowParameter = (
    workflowParameterFilter: WorkflowParameterFilter,
  ): Promise<WorkflowParameter[]> => {
    return this.http
      .post<WorkflowParameter[]>(
        kebabCase(nameof(this.singleListWorkflowParameter)),
        workflowParameterFilter,
      )
      .then((response: AxiosResponse<WorkflowParameter[]>) => {
        return response.data.map(
          (workflowParameter: PureModelData<WorkflowParameter>) =>
            WorkflowParameter.clone<WorkflowParameter>(workflowParameter),
        );
      });
  };

  public singleListWorkflowOperator = (
    workflowOperatorFilter: WorkflowOperatorFilter,
  ): Promise<WorkflowOperator[]> => {
    return this.http
      .post<WorkflowOperator[]>(
        kebabCase(nameof(this.singleListWorkflowOperator)),
        workflowOperatorFilter,
      )
      .then((response: AxiosResponse<WorkflowOperator[]>) => {
        return response.data.map(
          (workflowOperator: PureModelData<WorkflowOperator>) =>
            WorkflowOperator.clone<WorkflowOperator>(workflowOperator),
        );
      });
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

  public singleListAppUser = (filter: AppUserFilter) => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), filter, {
        baseURL: url(API_BASE_URL, API_WORKFLOW_DIRECTION_ROUTE),
      })
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };
  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
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

  public singleListOrganization2 = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return response.data.map((organization: PureModelData<Organization>) =>
          Organization.clone<Organization>(organization),
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
}

export const workflowDirectionRepository: WorkflowDirection = new WorkflowDirectionRepository();
