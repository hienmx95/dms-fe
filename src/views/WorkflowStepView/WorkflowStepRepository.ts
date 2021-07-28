import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { API_WORKFLOW_STEP_ROUTE } from 'config/api-consts';
import { WorkflowStep } from 'models/WorkflowStep';
import { WorkflowStepFilter } from 'models/WorkflowStepFilter';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { WorkflowDefinitionFilter } from 'models/WorkflowDefinitionFilter';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import moment from 'moment';
import { WorkflowParameterFilter } from 'models/WorkflowParameterFilter';
import { WorkflowParameter } from 'models/WorkflowParameter';
export class WorkflowStepRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_WORKFLOW_STEP_ROUTE));
  }

  public count = (workflowStepFilter?: WorkflowStepFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), workflowStepFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    workflowStepFilter?: WorkflowStepFilter,
  ): Promise<WorkflowStep[]> => {
    return this.http
      .post<WorkflowStep[]>(kebabCase(nameof(this.list)), workflowStepFilter)
      .then((response: AxiosResponse<WorkflowStep[]>) => {
        return response.data?.map((workflowStep: PureModelData<WorkflowStep>) =>
          WorkflowStep.clone<WorkflowStep>(workflowStep),
        );
      });
  };

  public get = (id: number | string): Promise<WorkflowStep> => {
    return this.http
      .post<WorkflowStep>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<WorkflowStep>) =>
        WorkflowStep.clone<WorkflowStep>(response.data),
      );
  };

  public create = (workflowStep: WorkflowStep): Promise<WorkflowStep> => {
    return this.http
      .post<WorkflowStep>(kebabCase(nameof(this.create)), workflowStep)
      .then((response: AxiosResponse<PureModelData<WorkflowStep>>) =>
        WorkflowStep.clone<WorkflowStep>(response.data),
      );
  };

  public update = (workflowStep: WorkflowStep): Promise<WorkflowStep> => {
    return this.http
      .post<WorkflowStep>(kebabCase(nameof(this.update)), workflowStep)
      .then((response: AxiosResponse<WorkflowStep>) =>
        WorkflowStep.clone<WorkflowStep>(response.data),
      );
  };

  public delete = (workflowStep: WorkflowStep): Promise<WorkflowStep> => {
    return this.http
      .post<WorkflowStep>(kebabCase(nameof(this.delete)), workflowStep)
      .then((response: AxiosResponse<WorkflowStep>) =>
        WorkflowStep.clone<WorkflowStep>(response.data),
      );
  };

  public save = (workflowStep: WorkflowStep): Promise<WorkflowStep> => {
    return workflowStep.id
      ? this.update(workflowStep)
      : this.create(workflowStep);
  };

  public singleListRole = (roleFilter: RoleFilter): Promise<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.singleListRole)), roleFilter)
      .then((response: AxiosResponse<Role[]>) => {
        return response.data.map((role: PureModelData<Role>) =>
          Role.clone<Role>(role),
        );
      });
  };

  public filterListRole = (roleFilter: RoleFilter): Promise<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.filterListRole)), roleFilter)
      .then((response: AxiosResponse<Role[]>) => {
        return response.data.map((role: PureModelData<Role>) =>
          Role.clone<Role>(role),
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

  public singleListAppUser = (filter: AppUserFilter) => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), filter, {
        baseURL: url(API_BASE_URL, API_WORKFLOW_STEP_ROUTE),
      })
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
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
}

export const workflowStepRepository: WorkflowStep = new WorkflowStepRepository();
