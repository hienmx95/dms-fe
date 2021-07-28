import { AxiosResponse } from 'axios';
import { API_STATISTIC_PROBLEM_REPORT_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StatisticProblemReport } from 'models/report/StatisticProblemReport';
import { StatisticProblemReportFilter } from 'models/report/StatisticProblemReportFilter';
import { Store } from 'models/report/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { StatisticProblemReportDataTable } from 'models/report/StatisticProblemReportDataTable';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';


export class StatisticProblemReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STATISTIC_PROBLEM_REPORT_ROUTE));
  }
  public count = (filter?: StatisticProblemReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: StatisticProblemReportFilter): Promise<StatisticProblemReport[]> => {
    return this.http
      .post<StatisticProblemReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<StatisticProblemReport[]>) => {
        return response.data?.map((model: PureModelData<StatisticProblemReport>) =>
        StatisticProblemReport.clone<StatisticProblemReport>(model),
        );
      });
  };
  public total = (filter?: StatisticProblemReportFilter): Promise<StatisticProblemReportDataTable> => {
    return this.http
      .post<StatisticProblemReportDataTable>(kebabCase(nameof(this.total)), filter)
      .then((response: AxiosResponse<StatisticProblemReportDataTable>) => response.data);
  };
  public get = (id: number | string): Promise<StatisticProblemReport> => {
    return this.http
      .post<StatisticProblemReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StatisticProblemReport>) =>
      StatisticProblemReport.clone<StatisticProblemReport>(response.data),
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
  public filterListStore = (
    filter?: StoreFilter,
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
    filter?: StoreTypeFilter,
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
  public export = (statisticProblemReportFilter?: StatisticProblemReportFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', statisticProblemReportFilter, {
      responseType: 'arraybuffer',
    });
  };
}
export const statisticProblemReportRepository: StatisticProblemReportRepository = new StatisticProblemReportRepository();
