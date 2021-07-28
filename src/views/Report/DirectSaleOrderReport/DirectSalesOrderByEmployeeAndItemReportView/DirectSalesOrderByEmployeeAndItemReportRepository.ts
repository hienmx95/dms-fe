import { AxiosResponse } from 'axios';
import { API_DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE } from 'config/api-consts';
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
import { Store } from 'models/report/Store';
import { StoreCheckerReportFilter } from 'models/report/StoreCheckerReportFilter';
import { StoreGrouping } from 'models/report/StoreGrouping';
import { StoreType } from 'models/report/StoreType';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { SalesOrderByEmployeeAndItemReport } from 'models/report/SalesorderByEmployeeAndItemReport';
import { SalesOrderByEmployeeAndItemReportFilter } from 'models/report/SalesorderByEmployeeAndItemReportFilter';
import { SalesOrderByEmployeeAndItemReportDataTable } from 'models/report/SalesOrderByEmployeeAndItemReportDataTable';
import { ItemFilter } from 'models/ItemFilter';
import { Item } from 'models/Item';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductGrouping } from 'models/ProductGrouping';

export class DirectSalesOrderByEmployeeAndItemReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(
      url(
        API_BASE_URL,
        API_DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
      ),
    );
  }
  public count = (
    filter?: SalesOrderByEmployeeAndItemReportFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    filter?: SalesOrderByEmployeeAndItemReportFilter,
  ): Promise<SalesOrderByEmployeeAndItemReport[]> => {
    return this.http
      .post<SalesOrderByEmployeeAndItemReport[]>(
        kebabCase(nameof(this.list)),
        filter,
      )
      .then((response: AxiosResponse<SalesOrderByEmployeeAndItemReport[]>) => {
        return response.data?.map(
          (model: PureModelData<SalesOrderByEmployeeAndItemReport>) =>
            SalesOrderByEmployeeAndItemReport.clone<
              SalesOrderByEmployeeAndItemReport
            >(model),
        );
      });
  };
  public get = (
    id: number | string,
  ): Promise<SalesOrderByEmployeeAndItemReport> => {
    return this.http
      .post<SalesOrderByEmployeeAndItemReport>(kebabCase(nameof(this.get)), {
        id,
      })
      .then((response: AxiosResponse<SalesOrderByEmployeeAndItemReport>) =>
        SalesOrderByEmployeeAndItemReport.clone<
          SalesOrderByEmployeeAndItemReport
        >(response.data),
      );
  };

  public total = (
    filter?: SalesOrderByEmployeeAndItemReportFilter,
  ): Promise<SalesOrderByEmployeeAndItemReportDataTable> => {
    return this.http
      .post<SalesOrderByEmployeeAndItemReportDataTable>(
        kebabCase(nameof(this.total)),
        filter,
      )
      .then(
        (response: AxiosResponse<SalesOrderByEmployeeAndItemReportDataTable>) =>
          response.data,
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
  public filterListStore = (
    filter?: StoreCheckerReportFilter,
  ): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), filter)
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
      .post<StoreType[]>(kebabCase(nameof(this.filterListStoreType)), filter)
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
  public export = (
    salesOrderByEmployeeAndItemReportFilter?: SalesOrderByEmployeeAndItemReportFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', salesOrderByEmployeeAndItemReportFilter, {
      responseType: 'arraybuffer',
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

  public filterListProductGrouping = (
    productGroupingFilter?: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.filterListProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data.map((model: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(model),
          ),
        );
      });
  };
}
export const directSalesOrderByEmployeeAndItemReportRepository: DirectSalesOrderByEmployeeAndItemReportRepository = new DirectSalesOrderByEmployeeAndItemReportRepository();
