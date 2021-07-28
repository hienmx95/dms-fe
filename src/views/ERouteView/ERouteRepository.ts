import { PostFilter } from 'models/PostFilter';
import { Post } from 'models/Post';
import { FileModel } from 'models/ChatBox/FileModel';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_E_ROUTE_ROUTE, POST_ROUTE } from 'config/api-consts';
import { ERoute } from 'models/ERoute';
import { ERouteFilter } from 'models/ERouteFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { RequestState } from 'models/RequestState';
import { RequestStateFilter } from 'models/RequestStateFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { ERouteType } from 'models/ERouteType';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { StoreType } from 'models/StoreType';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { buildTree } from 'helpers/tree';

export class ERouteRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_E_ROUTE_ROUTE));
  }

  public count = (eRouteFilter?: ERouteFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), eRouteFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (eRouteFilter?: ERouteFilter): Promise<ERoute[]> => {
    return this.http
      .post<ERoute[]>(kebabCase(nameof(this.list)), eRouteFilter)
      .then((response: AxiosResponse<ERoute[]>) => {
        return response.data?.map((eRoute: PureModelData<ERoute>) =>
          ERoute.clone<ERoute>(eRoute),
        );
      });
  };

  public get = (id: number | string): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ERoute>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public getDetail = (id: number | string): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.getDetail)), { id })
      .then((response: AxiosResponse<ERoute>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public create = (eRoute: ERoute): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.create)), eRoute)
      .then((response: AxiosResponse<PureModelData<ERoute>>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public update = (eRoute: ERoute): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.update)), eRoute)
      .then((response: AxiosResponse<ERoute>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public delete = (eRoute: ERoute): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.delete)), eRoute)
      .then((response: AxiosResponse<ERoute>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public save = (eRoute: ERoute): Promise<ERoute> => {
    return eRoute.id ? this.update(eRoute) : this.create(eRoute);
  };

  public send = (eRoute: ERoute): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.send)), eRoute)
      .then((response: AxiosResponse<ERoute>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public approve = (eRoute: ERoute): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.approve)), eRoute)
      .then((response: AxiosResponse<ERoute>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public reject = (eRoute: ERoute): Promise<ERoute> => {
    return this.http
      .post<ERoute>(kebabCase(nameof(this.reject)), eRoute)
      .then((response: AxiosResponse<ERoute>) =>
        ERoute.clone<ERoute>(response.data),
      );
  };

  public singleListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };
  public filterListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public filterListStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
  };
  public singleListStoreType = (
    storeTypeFilter: StoreTypeFilter,
  ): Promise<StoreType[]> => {
    return this.http
      .post<StoreType[]>(
        kebabCase(nameof(this.singleListStoreType)),
        storeTypeFilter,
      )
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data.map((storeType: PureModelData<StoreType>) =>
          StoreType.clone<StoreType>(storeType),
        );
      });
  };
  public singleListRequestState = (
    requestStateFilter: RequestStateFilter,
  ): Promise<RequestState[]> => {
    return this.http
      .post<RequestState[]>(
        kebabCase(nameof(this.singleListRequestState)),
        requestStateFilter,
      )
      .then((response: AxiosResponse<RequestState[]>) => {
        return response.data.map((requestState: PureModelData<RequestState>) =>
          RequestState.clone<RequestState>(requestState),
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

  public singleListErouteType = (): Promise<ERouteType[]> => {
    return this.http
      .post<ERouteType[]>(
        kebabCase(nameof(this.singleListErouteType)),
        new ERouteTypeFilter(),
      )
      .then((response: AxiosResponse<ERouteType[]>) => {
        return response.data.map((eRouteType: PureModelData<ERouteType>) =>
          ERouteType.clone<ERouteType>(eRouteType),
        );
      });
  };
  public filterListErouteType = (): Promise<ERouteType[]> => {
    return this.http
      .post<ERouteType[]>(
        kebabCase(nameof(this.filterListErouteType)),
        new ERouteTypeFilter(),
      )
      .then((response: AxiosResponse<ERouteType[]>) => {
        return response.data.map((eRouteType: PureModelData<ERouteType>) =>
          ERouteType.clone<ERouteType>(eRouteType),
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

  public countStore = (storeFilter: StoreFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countStore)), storeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.listStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
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

      .then((response: AxiosResponse<FileModel>) => response.data);
  };
}

export const eRouteRepository: ERoute = new ERouteRepository();
