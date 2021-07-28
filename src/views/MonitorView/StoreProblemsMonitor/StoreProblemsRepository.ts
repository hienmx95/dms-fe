import { httpConfig } from 'config/http';
import { Repository } from 'core/repositories/Repository';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { API_STORE_PROBLEMS_ROUTE, POST_ROUTE } from 'config/api-consts';
import { StoreProblemsMonitorFilter } from 'models/monitor/StoreProblemsMonitorFilter';
import kebabCase from 'lodash/kebabCase';
import nameof from 'ts-nameof.macro';
import { AxiosResponse } from 'axios';
import { PureModelData, BatchId } from 'react3l';
import {
  StoreProblemsMonitor,
  ProblemStatus,
  StoreProblemsHistoryMonitorFilter,
  StoreProblemsHistoryMonitor,
  ProblemStatusFilter,
  ProblemTypeFilter,
  ProblemType,
} from 'models/monitor/StoreProblemsMonitor';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUser } from 'models/AppUser';
import { Post } from 'models/Post';
import { Comment } from 'models/Comment';
import { PostFilter } from 'models/PostFilter';
import { buildTree } from 'helpers/tree';
import { FileModel } from 'models/ChatBox/FileModel';

export class StoreProblemsRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_PROBLEMS_ROUTE));
  }

  public count = (filter?: StoreProblemsMonitorFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public countProblemHistory = (
    filter?: StoreProblemsHistoryMonitorFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countProblemHistory)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public update = (
    item: StoreProblemsMonitor,
  ): Promise<StoreProblemsMonitor> => {
    return this.http
      .post<StoreProblemsMonitor>(kebabCase(nameof(this.update)), item)
      .then((response: AxiosResponse<StoreProblemsMonitor>) =>
        StoreProblemsMonitor.clone<StoreProblemsMonitor>(response.data),
      );
  };

  public get = (id: number | string): Promise<StoreProblemsMonitor> => {
    return this.http
      .post<StoreProblemsMonitor>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StoreProblemsMonitor>) =>
        StoreProblemsMonitor.clone<StoreProblemsMonitor>(response.data),
      );
  };

  public delete = (
    item: StoreProblemsMonitor,
  ): Promise<StoreProblemsMonitor> => {
    return this.http
      .post<StoreProblemsMonitor>(kebabCase(nameof(this.delete)), item)
      .then((response: AxiosResponse<StoreProblemsMonitor>) =>
        StoreProblemsMonitor.clone<StoreProblemsMonitor>(response.data),
      );
  };

  public list = (
    filter?: StoreProblemsMonitorFilter,
  ): Promise<StoreProblemsMonitor[]> => {
    return this.http
      .post<StoreProblemsMonitor[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<StoreProblemsMonitor[]>) => {
        return response.data?.map(
          (models: PureModelData<StoreProblemsMonitor>) =>
            StoreProblemsMonitor.clone<StoreProblemsMonitor>(models),
        );
      });
  };
  public filterListStore = (filter?: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), filter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((item: PureModelData<Store>) =>
          Store.clone<Store>(item),
        );
      });
  };

  public filterListOrganization = (
    filter?: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        filter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Organization>) =>
            Organization.clone<Organization>(item),
          ),
        );
      });
  };

  public filterListAppUser = (filter?: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), filter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((item: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(item),
        );
      });
  };

  public filterListProblemStatus = (
    filter?: ProblemStatusFilter,
  ): Promise<ProblemStatus[]> => {
    return this.http
      .post<ProblemStatus[]>(
        kebabCase(nameof(this.filterListProblemStatus)),
        filter,
      )
      .then((response: AxiosResponse<ProblemStatus[]>) => {
        return response.data.map((item: PureModelData<ProblemStatus>) =>
          ProblemStatus.clone<ProblemStatus>(item),
        );
      });
  };

  public filterListProblemType = (
    filter?: ProblemTypeFilter,
  ): Promise<ProblemType[]> => {
    return this.http
      .post<ProblemType[]>(
        kebabCase(nameof(this.filterListProblemType)),
        filter,
      )
      .then((response: AxiosResponse<ProblemType[]>) => {
        return response.data.map((item: PureModelData<ProblemType>) =>
          ProblemType.clone<ProblemType>(item),
        );
      });
  };


  public create = (model: Post) => {
    return this.http
      .post<Post>(kebabCase(nameof(this.create)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post>) => Post.clone<Post>(response.data));
  };

  public listPost = (filter: PostFilter) => {
    return this.http
      .post<Post[]>(kebabCase(nameof(this.list)), filter, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post[]>) => {
        return response.data.map((item: PureModelData<Post>) =>
          Post.clone<Post>(item),
        );
      });
  };
  public countPost = (filter: PostFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public deletePost = (model: Post): Promise<Post> => {
    return this.http
      .post<Post>(kebabCase(nameof(this.delete)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post>) => Post.clone<Post>(response.data));
  };

  public saveFile = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<FileModel> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post<Post>(kebabCase(nameof(this.saveFile)), formData, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      // .post(POST_ROUTE + '/save-file', formData, {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   params,
      // })
      .then((response: AxiosResponse<FileModel>) => response.data);
  };

  public listProblemHistory = (filter: StoreProblemsHistoryMonitorFilter) => {
    return this.http
      .post<Post[]>(kebabCase(nameof(this.listProblemHistory)), filter)
      .then((response: AxiosResponse<StoreProblemsHistoryMonitor[]>) => {
        return response.data.map(
          (item: PureModelData<StoreProblemsHistoryMonitor>) =>
            StoreProblemsHistoryMonitor.clone<StoreProblemsHistoryMonitor>(
              item,
            ),
        );
      });
  };

  public createPost = (model: Post) => {
    return this.http
      .post<Post>(kebabCase(nameof(this.create)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post>) => Post.clone<Post>(response.data));
  };

  public createComment = (model: Comment) => {
    return this.http
      .post<Comment>(kebabCase(nameof(this.createComment)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Comment>) =>
        Comment.clone<Comment>(response.data),
      );
  };

  public singleListAppUser = (filter: AppUserFilter) => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), filter, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
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

  public export = (
    storeProblemsMonitorFilter?: StoreProblemsMonitorFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', storeProblemsMonitorFilter, {
      responseType: 'arraybuffer',
    });
  };

  public uploadFile = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<FileModel> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post('/save-file', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        baseURL: url(API_BASE_URL, POST_ROUTE),
        params,
      })
      .then((response: AxiosResponse<FileModel>) => response.data);
  };
}

export const storeProblemsRepository: StoreProblemsMonitor = new StoreProblemsRepository();
