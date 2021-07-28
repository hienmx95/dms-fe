import { AxiosResponse } from 'axios';
import { API_PROBLEM_TYPE_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { ProblemType } from 'models/ProblemType';
import { ProblemTypeFilter } from 'models/ProblemTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';


export class ProblemTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PROBLEM_TYPE_ROUTE));
  }

  public count = (filter?: ProblemTypeFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    filter?: ProblemTypeFilter,
  ): Promise<ProblemType[]> => {
    return this.http
      .post<ProblemType[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<ProblemType[]>) => {
        return response.data?.map((filter: PureModelData<ProblemType>) =>
          ProblemType.clone<ProblemType>(filter),
        );
      });
  };

  public get = (id: number | string): Promise<ProblemType> => {
    return this.http
      .post<ProblemType>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ProblemType>) =>
        ProblemType.clone<ProblemType>(response.data),
      );
  };

  public create = (filter: ProblemType): Promise<ProblemType> => {
    return this.http
      .post<ProblemType>(kebabCase(nameof(this.create)), filter)
      .then((response: AxiosResponse<PureModelData<ProblemType>>) =>
        ProblemType.clone<ProblemType>(response.data),
      );
  };

  public update = (filter: ProblemType): Promise<ProblemType> => {
    return this.http
      .post<ProblemType>(kebabCase(nameof(this.update)), filter)
      .then((response: AxiosResponse<ProblemType>) =>
        ProblemType.clone<ProblemType>(response.data),
      );
  };

  public delete = (filter: ProblemType): Promise<ProblemType> => {
    return this.http
      .post<ProblemType>(kebabCase(nameof(this.delete)), filter)
      .then((response: AxiosResponse<ProblemType>) =>
        ProblemType.clone<ProblemType>(response.data),
      );
  };

  public save = (filter: ProblemType): Promise<ProblemType> => {
    return filter.id ? this.update(filter) : this.create(filter);
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

}

export const problemTypeRepository: ProblemType = new ProblemTypeRepository();
