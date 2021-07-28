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
import { API_STORE_CHECKER_REPORT_ROUTE } from 'config/api-consts';
import { StoreCheckerReportFilter } from 'models/report/StoreCheckerReportFilter';
import { StoreCheckerReport } from 'models/report/StoreCheckerReport';
import { Store } from 'models/report/Store';
import { StoreType } from 'models/report/StoreType';
import { StoreGrouping } from 'models/report/StoreGrouping';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';


export class StoreCheckerReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_CHECKER_REPORT_ROUTE));
  }
  public count = (filter?: StoreCheckerReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: StoreCheckerReportFilter): Promise<StoreCheckerReport[]> => {
    return this.http
      .post<StoreCheckerReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<StoreCheckerReport[]>) => {
        return response.data?.map((model: PureModelData<StoreCheckerReport>) =>
          StoreCheckerReport.clone<StoreCheckerReport>(model),
        );
      });
  };
  public get = (id: number | string): Promise<StoreCheckerReport> => {
    return this.http
      .post<StoreCheckerReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StoreCheckerReport>) =>
        StoreCheckerReport.clone<StoreCheckerReport>(response.data),
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
  public filterListStore = (
    filter?: StoreCheckerReportFilter,
  ): Promise<Store[]> => {
    return this.http
      .post<Store[]>(
        kebabCase(nameof(this.filterListStore)),
        filter,
      )
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((model: PureModelData<Store>) =>
          Store.clone<Store>(model),
        );
      });
  };
  public filterListStoreType = (
    filter?: StoreCheckerReportFilter,
  ): Promise<StoreType[]> => {
    return this.http
      .post<StoreType[]>(
        kebabCase(nameof(this.filterListStoreType)),
        filter,
      )
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data.map((model: PureModelData<StoreType>) =>
          StoreType.clone<StoreType>(model),
        );
      });
  };
  public filterListStoreGrouping = (
    filter?: StoreCheckerReportFilter,
  ): Promise<StoreGrouping[]> => {
    return this.http
      .post<StoreGrouping[]>(
        kebabCase(nameof(this.filterListStoreGrouping)),
        filter,
      )
      .then((response: AxiosResponse<StoreGrouping[]>) => {
        return response.data.map((model: PureModelData<StoreGrouping>) =>
          StoreGrouping.clone<StoreGrouping>(model),
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


  public export = (storeCheckerReportFilter?: StoreCheckerReportFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', storeCheckerReportFilter, {
      responseType: 'arraybuffer',
    });
  };

  public filterListCheckingPlanStatus = (): Promise<StoreStatus[]> => {
    return this.http
      .post<StoreStatus[]>(
        kebabCase(nameof(this.filterListCheckingPlanStatus)),
        new StoreStatusFilter(),
      )
      .then((response: AxiosResponse<StoreStatus[]>) => {
        return response.data.map((storeStatus: PureModelData<StoreStatus>) =>
          StoreStatus.clone<StoreStatus>(storeStatus),
        );
      });
  };
}
export const storeCheckerReportRepository: StoreCheckerReport = new StoreCheckerReportRepository();
