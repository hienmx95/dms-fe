import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_E_ROUTE_CHANGE_REQUEST_ROUTE } from 'config/api-consts';
import { ERouteChangeRequest } from 'models/ERouteChangeRequest';
import { ERouteChangeRequestFilter } from 'models/ERouteChangeRequestFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERoute } from 'models/ERoute';
import { ERouteFilter } from 'models/ERouteFilter';
import { ERouteChangeRequestContent } from 'models/ERouteChangeRequestContent';
import { ERouteChangeRequestContentFilter } from 'models/ERouteChangeRequestContentFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { ERouteType } from 'models/ERouteType';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { StoreType } from 'models/StoreType';

export class ERouteChangeRequestRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_E_ROUTE_CHANGE_REQUEST_ROUTE));
  }

  public count = (eRouteChangeRequestFilter?: ERouteChangeRequestFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), eRouteChangeRequestFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (eRouteChangeRequestFilter?: ERouteChangeRequestFilter): Promise<ERouteChangeRequest[]> => {
    return this.http.post<ERouteChangeRequest[]>(kebabCase(nameof(this.list)), eRouteChangeRequestFilter)
      .then((response: AxiosResponse<ERouteChangeRequest[]>) => {
        return response.data?.map((eRouteChangeRequest: PureModelData<ERouteChangeRequest>) => ERouteChangeRequest.clone<ERouteChangeRequest>(eRouteChangeRequest));
      });
  };

  public get = (id: number | string): Promise<ERouteChangeRequest> => {
    return this.http.post<ERouteChangeRequest>
      (kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ERouteChangeRequest>) => ERouteChangeRequest.clone<ERouteChangeRequest>(response.data));
  };

  public getDraft = (eRouteId: number | string): Promise<ERouteChangeRequest> => {
    return this.http.post<ERouteChangeRequest>
      (kebabCase(nameof(this.getDraft)), { eRouteId })
      .then((response: AxiosResponse<ERouteChangeRequest>) => ERouteChangeRequest.clone<ERouteChangeRequest>(response.data));
  };

  public create = (eRouteChangeRequest: ERouteChangeRequest): Promise<ERouteChangeRequest> => {
    return this.http.post<ERouteChangeRequest>(kebabCase(nameof(this.create)), eRouteChangeRequest)
      .then((response: AxiosResponse<PureModelData<ERouteChangeRequest>>) => ERouteChangeRequest.clone<ERouteChangeRequest>(response.data));
  };

  public update = (eRouteChangeRequest: ERouteChangeRequest): Promise<ERouteChangeRequest> => {
    return this.http.post<ERouteChangeRequest>(kebabCase(nameof(this.update)), eRouteChangeRequest)
      .then((response: AxiosResponse<ERouteChangeRequest>) => ERouteChangeRequest.clone<ERouteChangeRequest>(response.data));
  };

  public delete = (eRouteChangeRequest: ERouteChangeRequest): Promise<ERouteChangeRequest> => {
    return this.http.post<ERouteChangeRequest>(kebabCase(nameof(this.delete)), eRouteChangeRequest)
      .then((response: AxiosResponse<ERouteChangeRequest>) => ERouteChangeRequest.clone<ERouteChangeRequest>(response.data));
  };

  public save = (eRouteChangeRequest: ERouteChangeRequest): Promise<ERouteChangeRequest> => {
    return eRouteChangeRequest.id ? this.update(eRouteChangeRequest) : this.create(eRouteChangeRequest);
  };

  public singleListAppUser = (appUserFilter: AppUserFilter): Promise<AppUser[]> => {
    return this.http.post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) => AppUser.clone<AppUser>(appUser));
      });
  };
  public singleListERoute = (eRouteFilter: ERouteFilter): Promise<ERoute[]> => {
    return this.http.post<ERoute[]>(kebabCase(nameof(this.singleListERoute)), eRouteFilter)
      .then((response: AxiosResponse<ERoute[]>) => {
        return response.data.map((eRoute: PureModelData<ERoute>) => ERoute.clone<ERoute>(eRoute));
      });
  };
  public singleListERouteChangeRequestContent = (eRouteChangeRequestContentFilter: ERouteChangeRequestContentFilter): Promise<ERouteChangeRequestContent[]> => {
    return this.http.post<ERouteChangeRequestContent[]>(kebabCase(nameof(this.singleListERouteChangeRequestContent)), eRouteChangeRequestContentFilter)
      .then((response: AxiosResponse<ERouteChangeRequestContent[]>) => {
        return response.data.map((eRouteChangeRequestContent: PureModelData<ERouteChangeRequestContent>) => ERouteChangeRequestContent.clone<ERouteChangeRequestContent>(eRouteChangeRequestContent));
      });
  };
  public singleListStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http.post<Store[]>(kebabCase(nameof(this.singleListStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) => Store.clone<Store>(store));
      });
  };

  public singleListOrganization = (organizationFilter: OrganizationFilter): Promise<Organization[]> => {
    return this.http.post<Organization[]>(kebabCase(nameof(this.singleListOrganization)), organizationFilter)
      .then((response: AxiosResponse<Organization[]>) => {
        return response.data.map((organization: PureModelData<Organization>) => Organization.clone<Organization>(organization));
      });
  };

  public singleListStoreType = (storeTypeFilter: StoreTypeFilter): Promise<StoreType[]> => {
    return this.http.post<StoreType[]>(kebabCase(nameof(this.singleListStoreType)), storeTypeFilter)
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data.map((storeType: PureModelData<StoreType>) => StoreType.clone<StoreType>(storeType));
      });
  };
  public singleListStatus = (): Promise<Status[]> => {
    return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };

  public singleListErouteType = (): Promise<ERouteType[]> => {
    return this.http.post<ERouteType[]>(kebabCase(nameof(this.singleListErouteType)), new ERouteTypeFilter())
      .then((response: AxiosResponse<ERouteType[]>) => {
        return response.data.map((eRouteType: PureModelData<ERouteType>) => ERouteType.clone<ERouteType>(eRouteType));
      });
  };
  public filterListErouteType = (): Promise<ERouteType[]> => {
    return this.http.post<ERouteType[]>(kebabCase(nameof(this.filterListErouteType)), new ERouteTypeFilter())
      .then((response: AxiosResponse<ERouteType[]>) => {
        return response.data.map((eRouteType: PureModelData<ERouteType>) => ERouteType.clone<ERouteType>(eRouteType));
      });
  };

  public filterListAppUser = (appUserFilter: AppUserFilter): Promise<AppUser[]> => {
    return this.http.post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) => AppUser.clone<AppUser>(appUser));
      });
  };

  public filterListStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http.post<Store[]>(kebabCase(nameof(this.filterListStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) => Store.clone<Store>(store));
      });
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

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http.post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };
}

export const eRouteChangeRequestRepository: ERouteChangeRequest = new ERouteChangeRequestRepository();
