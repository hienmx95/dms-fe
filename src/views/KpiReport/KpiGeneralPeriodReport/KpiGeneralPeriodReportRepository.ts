import { AxiosResponse } from 'axios';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
// import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiPeriod } from 'models/kpi/KpiPeriod';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiPeriodReport } from 'models/kpi/KpiPeriodReport';
import { KpiPeriodReportFilter } from 'models/kpi/KpiPeriodReportFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { API_KPI_GENERAL_PERIOD_REPORT_ROUTE } from 'config/api-consts';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { KpiYear } from 'models/kpi/KpiYear';

export class KpiGeneralPeriodReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_KPI_GENERAL_PERIOD_REPORT_ROUTE));
  }
  public count = (filter?: KpiPeriodReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: KpiPeriodReportFilter): Promise<KpiPeriodReport[]> => {
    return this.http
      .post<KpiPeriodReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<KpiPeriodReport[]>) => {
        return response.data?.map((model: PureModelData<KpiPeriodReport>) =>
            KpiPeriodReport.clone<KpiPeriodReport>(model),
        );
      });
  };
  public get = (id: number | string): Promise<KpiPeriodReport> => {
    return this.http
      .post<KpiPeriodReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<KpiPeriodReport>) =>
        KpiPeriodReport.clone<KpiPeriodReport>(response.data),
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
  public filterListKpiPeriod = (
    filter?: KpiPeriodFilter,
  ): Promise<KpiPeriod[]> => {
    return this.http
      .post<KpiPeriod[]>(
        kebabCase(nameof(this.filterListKpiPeriod)),
        filter,
      )
      .then((response: AxiosResponse<KpiPeriod[]>) => {
        return response.data.map((model: PureModelData<KpiPeriod>) =>
        KpiPeriod.clone<KpiPeriod>(model),
        );
      });
  };
  public filterListKpiYear = (
    filter?: KpiYearFilter,
  ): Promise<KpiYear[]> => {
    return this.http
      .post<KpiYear[]>(
        kebabCase(nameof(this.filterListKpiYear)),
        filter,
      )
      .then((response: AxiosResponse<KpiYear[]>) => {
        return response.data.map((model: PureModelData<KpiYear>) =>
        KpiYear.clone<KpiYear>(model),
        );
      });
  };
  public export = (
    filter?: KpiPeriodReportFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', filter, {
      responseType: 'arraybuffer',
    });
  };
}
 export const kpiGeneralPeriodReportRepository: KpiGeneralPeriodReportRepository = new KpiGeneralPeriodReportRepository();