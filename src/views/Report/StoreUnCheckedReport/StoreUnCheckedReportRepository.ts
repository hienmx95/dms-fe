import { AxiosResponse } from 'axios';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { API_STORE_UN_CHECKED_REPORT_ROUTE } from 'config/api-consts';
import { StoreUnCheckedReportFilter } from 'models/report/StoreUnCheckedReportFilter';
import { StoreUnCheckedReport } from 'models/report/StoreUnCheckedReport';
import { ERoute } from 'models/report/ERoute';
import { ERouteFilter } from 'models/report/ERouteFilter';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';

export class StoreUnCheckerReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_UN_CHECKED_REPORT_ROUTE));
  }
  public count = (filter?: StoreUnCheckedReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: StoreUnCheckedReportFilter): Promise<StoreUnCheckedReport[]> => {
    return this.http
      .post<StoreUnCheckedReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<StoreUnCheckedReport[]>) => {
        return response.data?.map((model: PureModelData<StoreUnCheckedReport>) =>
          StoreUnCheckedReport.clone<StoreUnCheckedReport>(model),
        );
      });
  };
  public get = (id: number | string): Promise<StoreUnCheckedReport> => {
    return this.http
      .post<StoreUnCheckedReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StoreUnCheckedReport>) =>
        StoreUnCheckedReport.clone<StoreUnCheckedReport>(response.data),
      );
  };

  public filterListAppUser = (filter?: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(
        kebabCase(nameof(this.filterListAppUser)),
        filter,
      )
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((model: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(model),
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
  public filterListERoute = (
    filter?: ERouteFilter,
  ): Promise<ERoute[]> => {
    return this.http
      .post<ERoute[]>(
        kebabCase(nameof(this.filterListERoute)),
        filter,
      )
      .then((response: AxiosResponse<ERoute[]>) => {
        return response.data.map((model: PureModelData<ERoute>) =>
          ERoute.clone<ERoute>(model),
        );
      });
  };
  public filterListStoreStatus = (): Promise<StoreStatus[]> => {
    return this.http
      .post<StoreStatus[]>(
        kebabCase(nameof(this.filterListStoreStatus)),
        new StoreStatusFilter(),
      )
      .then((response: AxiosResponse<StoreStatus[]>) => {
        return response.data.map((storeStatus: PureModelData<StoreStatus>) =>
          StoreStatus.clone<StoreStatus>(storeStatus),
        );
      });
  };
  public export = (storeUnCheckedReportFilter?: StoreUnCheckedReportFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', storeUnCheckedReportFilter, {
      responseType: 'arraybuffer',
    });
  };
}
export const storeUnCheckerReportRepository: StoreUnCheckedReport = new StoreUnCheckerReportRepository();