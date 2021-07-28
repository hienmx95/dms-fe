import { ProductGroupingFilter } from 'models/report/ProductGroupingFilter';
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
import { KpiProductGroupingsReport } from 'models/kpi/KpiProductGroupingsReport';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { API_KPI_PRODUCTS_GROUPING_REPORT_ROUTE } from 'config/api-consts';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { KpiYear } from 'models/kpi/KpiYear';
import { ItemFilter } from 'models/ItemFilter';
import { Item } from 'models/Item';
import { KpiProductGroupingsReportFilter } from 'models/kpi/KpiProductGroupingsReportFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { ProductGrouping } from 'models/ProductGrouping';

export class KpiProductGroupingsReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_KPI_PRODUCTS_GROUPING_REPORT_ROUTE));
  }
  public count = (
    filter?: KpiProductGroupingsReportFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    filter?: KpiProductGroupingsReportFilter,
  ): Promise<KpiProductGroupingsReport[]> => {
    return this.http
      .post<KpiProductGroupingsReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<KpiProductGroupingsReport[]>) => {
        return response.data?.map(
          (model: PureModelData<KpiProductGroupingsReport>) =>
            KpiProductGroupingsReport.clone<KpiProductGroupingsReport>(model),
        );
      });
  };
  public get = (id: number | string): Promise<KpiProductGroupingsReport> => {
    return this.http
      .post<KpiProductGroupingsReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<KpiProductGroupingsReport>) =>
        KpiProductGroupingsReport.clone<KpiProductGroupingsReport>(
          response.data,
        ),
      );
  };

  public filterListAppUser = (filter?: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), filter)
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
      .post<KpiPeriod[]>(kebabCase(nameof(this.filterListKpiPeriod)), filter)
      .then((response: AxiosResponse<KpiPeriod[]>) => {
        return response.data.map((model: PureModelData<KpiPeriod>) =>
          KpiPeriod.clone<KpiPeriod>(model),
        );
      });
  };
  public filterListKpiYear = (filter?: KpiYearFilter): Promise<KpiYear[]> => {
    return this.http
      .post<KpiYear[]>(kebabCase(nameof(this.filterListKpiYear)), filter)
      .then((response: AxiosResponse<KpiYear[]>) => {
        return response.data.map((model: PureModelData<KpiYear>) =>
          KpiYear.clone<KpiYear>(model),
        );
      });
  };
  public filterListItem = (filter?: ItemFilter): Promise<Item[]> => {
    return this.http
      .post<Item[]>(kebabCase(nameof(this.filterListItem)), filter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data.map((model: PureModelData<Item>) =>
          Item.clone<Item>(model),
        );
      });
  };
  public export = (
    filter?: KpiProductGroupingsReportFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', filter, {
      responseType: 'arraybuffer',
    });
  };

  public filterListKpiProductGroupingType = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListKpiProductGroupingType)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public filterListProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.filterListProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data.map((productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
          ),
        );
      });
  };
}
export const kpiItemsReportRepository: KpiProductGroupingsReportRepository = new KpiProductGroupingsReportRepository();
