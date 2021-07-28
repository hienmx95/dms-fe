import { AxiosResponse } from 'axios';
import { API_SALEMANS_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { EnumList } from 'models/EnumList';
import { EnumListFilter } from 'models/EnumListFilter';
import { SalemansDetail } from 'models/monitor';
import { SalemansMonitor } from 'models/monitor/SalemansMonitor';
import { SalemansMonitorFilter } from 'models/monitor/SalemansMonitorFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Moment } from 'moment';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
export class SalemansRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SALEMANS_ROUTE));
  }

  public count = (filter?: SalemansMonitorFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public get = (
    saleEmployeeId: number,
    date: Moment,
  ): Promise<SalemansDetail[]> => {
    return this.http
      .post<SalemansDetail[]>(kebabCase(nameof(this.get)), {
        saleEmployeeId,
        date,
      })
      .then((response: AxiosResponse<SalemansDetail[]>) => {
        return response.data.map((item: PureModelData<SalemansDetail>) =>
          SalemansDetail.clone<SalemansDetail>(item),
        );
      });
  };

  public list = (
    filter?: SalemansMonitorFilter,
  ): Promise<SalemansMonitor[]> => {
    return this.http
      .post<SalemansMonitor[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<SalemansMonitor[]>) => {
        return response.data?.map((model: PureModelData<SalemansMonitor>) =>
        SalemansMonitor.clone<SalemansMonitor>(model),
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
      .post<EnumList[]>(kebabCase(nameof(this.filterListImage)), filter)
      .then((response: AxiosResponse<EnumList[]>) => {
        return response.data.map((item: PureModelData<EnumList>) =>
          EnumList.clone<EnumList>(item),
        );
      });
  };

  public export = (
    salemansMonitorFilter?: SalemansMonitorFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', salemansMonitorFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportUnChecking = (
    salemansMonitorFilter?: SalemansMonitorFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-unchecking', salemansMonitorFilter, {
      responseType: 'arraybuffer',
    });
  };
}

export const salemansRepository: SalemansRepository = new SalemansRepository();
