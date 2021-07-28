import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { API_STORE_CHECKER_ROUTE } from 'config/api-consts';
import kebabCase from 'lodash/kebabCase';
import { AxiosResponse } from 'axios';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { StoreCheckerMonitorFilter, StoreCheckerMonitor } from 'models/monitor';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { EnumListFilter } from 'models/EnumListFilter';
import { EnumList } from 'models/EnumList';
import { Organization } from 'models/Organization';
import {Moment} from 'moment';
import { StoreCheckerDetail } from 'models/monitor/StoreCheckerDetail';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUser } from 'models/AppUser';
import { buildTree } from 'helpers/tree';
export class StoreCheckerRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_CHECKER_ROUTE));
  }

  public count = (
    storeCheckerMonitorFilter?: StoreCheckerMonitorFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), storeCheckerMonitorFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    storeCheckerMonitorFilter?: StoreCheckerMonitorFilter,
  ): Promise<StoreCheckerMonitor[]> => {
    return this.http
      .post<StoreCheckerMonitor[]>(
        kebabCase(nameof(this.list)),
        storeCheckerMonitorFilter,
      )
      .then((response: AxiosResponse<StoreCheckerMonitor[]>) => {
        return response.data?.map(
          (storeCheckerMonitor: PureModelData<StoreCheckerMonitor>) =>
            StoreCheckerMonitor.clone<StoreCheckerMonitor>(storeCheckerMonitor),
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

  public filterListChecking = (
    filter?: EnumListFilter,
  ): Promise<EnumList[]> => {
    return this.http
      .post<EnumList[]>(kebabCase(nameof(this.filterListChecking)), filter)
      .then((response: AxiosResponse<EnumList[]>) => {
        return response.data.map((item: PureModelData<EnumList>) =>
          EnumList.clone<EnumList>(item),
        );
      });
  };

  public filterListImage = (filter?: EnumListFilter): Promise<EnumList[]> => {
    return this.http
      .post<EnumList[]>(kebabCase(nameof(this.filterListImage)), filter)
      .then((response: AxiosResponse<EnumList[]>) => {
        return response.data.map((item: PureModelData<EnumList>) =>
          EnumList.clone<EnumList>(item),
        );
      });
  };

  public filterListSalesOrder = (
    filter?: EnumListFilter,
  ): Promise<EnumList[]> => {
    return this.http
      .post<EnumList[]>(kebabCase(nameof(this.filterListSalesOrder)), filter)
      .then((response: AxiosResponse<EnumList[]>) => {
        return response.data.map((item: PureModelData<EnumList>) =>
          EnumList.clone<EnumList>(item),
        );
      });
  };

  public get = (saleEmployeeId: number, date: Moment): Promise<StoreCheckerDetail[]> => {
    return this.http
      .post<StoreCheckerDetail[]>(kebabCase(nameof(this.get)), {saleEmployeeId, date})
      .then((response: AxiosResponse<StoreCheckerDetail[]>) => {
        return response.data.map((item: PureModelData<StoreCheckerDetail>) =>
        StoreCheckerDetail.clone<StoreCheckerDetail>(item),
        );
      });
  }

  public export = (
    storeCheckerMonitor?: StoreCheckerMonitorFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', storeCheckerMonitor, {
      responseType: 'arraybuffer',
    });
  };
}

export const storeCheckerRepository: StoreCheckerMonitor = new StoreCheckerRepository();
