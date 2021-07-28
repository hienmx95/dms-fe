import { AxiosResponse } from 'axios';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
// import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { API_DIRECT_SALES_ORDER_GENERAL_ROUTE } from 'config/api-consts';
import { Store } from 'models/report/Store';
import { AppUser } from 'models/AppUser';
import { SalesOrderGeneralReportDataTable } from 'models/report/SalesOrderGeneralReportDataTable';
import { SalesOrderGeneralReportFilter } from 'models/report/SalesOrderGeneralFilter';
import { SalesOrderGeneralReport } from 'models/report/SalesOrderGeneral';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';


export class DirectSalesOrderGeneralReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DIRECT_SALES_ORDER_GENERAL_ROUTE));
  }
  public count = (filter?: SalesOrderGeneralReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: SalesOrderGeneralReportFilter): Promise<SalesOrderGeneralReport[]> => {
    return this.http
      .post<SalesOrderGeneralReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<SalesOrderGeneralReport[]>) => {
        return response.data?.map((model: PureModelData<SalesOrderGeneralReport>) =>
          SalesOrderGeneralReport.clone<SalesOrderGeneralReport>(model),
        );
      });
  };
  public total = (filter?: SalesOrderGeneralReportFilter): Promise<SalesOrderGeneralReportDataTable> => {
    return this.http
      .post<SalesOrderGeneralReportDataTable>(kebabCase(nameof(this.total)), filter)
      .then((response: AxiosResponse<SalesOrderGeneralReportDataTable>) => response.data);
  };
  public get = (id: number | string): Promise<SalesOrderGeneralReport> => {
    return this.http
      .post<SalesOrderGeneralReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<SalesOrderGeneralReport>) =>
        SalesOrderGeneralReport.clone<SalesOrderGeneralReport>(response.data),
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
    filter?: SalesOrderGeneralReportFilter,
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
  public filterListAppUser = (
    filter?: SalesOrderGeneralReportFilter,
  ): Promise<AppUser[]> => {
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

  public export = (salesOrderGeneralReportFilter?: SalesOrderGeneralReportFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', salesOrderGeneralReportFilter, {
      responseType: 'arraybuffer',
    });
  };

}
export const directSalesOrderGeneralReportRepository: DirectSalesOrderGeneralReportRepository = new DirectSalesOrderGeneralReportRepository();
