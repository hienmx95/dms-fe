import { AxiosResponse } from 'axios';
import { API_POSM_REPORT_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { POSMReport } from 'models/report/POSMReport';
import { POSMReportFilter } from 'models/report/POSMReportFilter';
import { Store } from 'models/report/Store';
import { StoreGrouping } from 'models/report/StoreGrouping';
import { StoreType } from 'models/report/StoreType';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class POSMReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_POSM_REPORT_ROUTE));
  }
  public count = (filter?: POSMReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: POSMReportFilter): Promise<POSMReport[]> => {
    return this.http
      .post<POSMReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<POSMReport[]>) => {
        return response.data?.map((model: PureModelData<POSMReport>) =>
          POSMReport.clone<POSMReport>(model),
        );
      });
  };
  public get = (id: number | string): Promise<POSMReport> => {
    return this.http
      .post<POSMReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<POSMReport>) =>
        POSMReport.clone<POSMReport>(response.data),
      );
  };

  public filterListShowingItem = (
    filter?: ShowingItemFilter,
  ): Promise<ShowingItem[]> => {
    return this.http
      .post<ShowingItem[]>(
        kebabCase(nameof(this.filterListShowingItem)),
        filter,
      )
      .then((response: AxiosResponse<ShowingItem[]>) => {
        return response.data.map((model: PureModelData<ShowingItem>) =>
          ShowingItem.clone<ShowingItem>(model),
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
  public filterListStore = (filter?: POSMReportFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), filter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((model: PureModelData<Store>) =>
          Store.clone<Store>(model),
        );
      });
  };
  public filterListStoreType = (
    filter?: POSMReportFilter,
  ): Promise<StoreType[]> => {
    return this.http
      .post<StoreType[]>(kebabCase(nameof(this.filterListStoreType)), filter)
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data.map((model: PureModelData<StoreType>) =>
          StoreType.clone<StoreType>(model),
        );
      });
  };
  public filterListStoreGrouping = (
    filter?: POSMReportFilter,
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

  public export = (
    posmReportFilter?: POSMReportFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', posmReportFilter, {
      responseType: 'arraybuffer',
    });
  };
}
export const posmReportRepository: POSMReport = new POSMReportRepository();
