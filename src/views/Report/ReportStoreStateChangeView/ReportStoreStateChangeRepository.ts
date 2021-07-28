import { AxiosResponse } from 'axios';
import { API_REPORT_STATE_CHANGE_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/report/Store';
import { StoreStateChangeReport } from 'models/report/StoreStateChangeReport';
import { StoreStateChangeReportDataTable } from 'models/report/StoreStateChangeReportDataTable';
import { StoreStateChangeReportFilter } from 'models/report/StoreStateChangeReportFilter';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class ReportStoreStateChangeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_REPORT_STATE_CHANGE_ROUTE));
  }
  public count = (filter?: StoreStateChangeReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    filter?: StoreStateChangeReportFilter,
  ): Promise<StoreStateChangeReport[]> => {
    return this.http
      .post<StoreStateChangeReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<StoreStateChangeReport[]>) => {
        return response.data?.map(
          (model: PureModelData<StoreStateChangeReport>) =>
            StoreStateChangeReport.clone<StoreStateChangeReport>(model),
        );
      });
  };

  public total = (
    filter?: StoreStateChangeReportFilter,
  ): Promise<StoreStateChangeReportDataTable> => {
    return this.http
      .post<StoreStateChangeReportDataTable>(
        kebabCase(nameof(this.total)),
        filter,
      )
      .then(
        (response: AxiosResponse<StoreStateChangeReportDataTable>) =>
          response.data,
      );
  };
  public get = (id: number | string): Promise<StoreStateChangeReport> => {
    return this.http
      .post<StoreStateChangeReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StoreStateChangeReport>) =>
        StoreStateChangeReport.clone<StoreStateChangeReport>(response.data),
      );
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
  public filterListStore = (filter?: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), filter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((model: PureModelData<Store>) =>
          Store.clone<Store>(model),
        );
      });
  };
  public filterListStoreType = (
    filter?: StoreTypeFilter,
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
    filter?: StoreGroupingFilter,
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
  public filterListStoreStatusHistoryType = (): Promise<StoreStatus[]> => {
    return this.http
      .post<StoreStatus[]>(
        kebabCase(nameof(this.filterListStoreStatusHistoryType)),
        new StoreStatusFilter(),
      )
      .then((response: AxiosResponse<StoreStatus[]>) => {
        return response.data.map((storeStatus: PureModelData<StoreStatus>) =>
          StoreStatus.clone<StoreStatus>(storeStatus),
        );
      });
  };
  public export = (
    statisticProblemReportFilter?: StoreStateChangeReportFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', statisticProblemReportFilter, {
      responseType: 'arraybuffer',
    });
  };
}
export const reportStoreStateChangeRepository: ReportStoreStateChangeRepository = new ReportStoreStateChangeRepository();
