import { ProductGroupingFilter } from './../../../models/ProductGroupingFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { AxiosResponse } from 'axios';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { API_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE } from 'config/api-consts';
import { SalesOrderByStoreAndItemsReportFilter } from 'models/report/SalesOrderByStoreAndItemsReportFilter';
import { SalesOrderByStoreAndItemsReport } from 'models/report/SalesOrderByStoreAndItemsReport';
import { Store } from 'models/report/Store';
import { StoreType } from 'models/report/StoreType';
import { StoreGrouping } from 'models/report/StoreGrouping';
import { SalesOrderByStoreAndItemsReportDataTable } from 'models/report/SalesOrderByStoreAndItemsReportDataTable';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import { ItemFilter } from 'models/ItemFilter';
import { Item } from 'models/Item';

export class SalesOrderByStoreAndItemsRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(
      url(API_BASE_URL, API_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE),
    );
  }
  public count = (
    filter?: SalesOrderByStoreAndItemsReportFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    filter?: SalesOrderByStoreAndItemsReportFilter,
  ): Promise<SalesOrderByStoreAndItemsReport[]> => {
    return this.http
      .post<SalesOrderByStoreAndItemsReport[]>(
        kebabCase(nameof(this.list)),
        filter,
      )
      .then((response: AxiosResponse<SalesOrderByStoreAndItemsReport[]>) => {
        return response.data?.map(
          (model: PureModelData<SalesOrderByStoreAndItemsReport>) =>
            SalesOrderByStoreAndItemsReport.clone<
              SalesOrderByStoreAndItemsReport
            >(model),
        );
      });
  };
  public total = (
    filter?: SalesOrderByStoreAndItemsReportFilter,
  ): Promise<SalesOrderByStoreAndItemsReportDataTable> => {
    return this.http
      .post<SalesOrderByStoreAndItemsReportDataTable>(
        kebabCase(nameof(this.total)),
        filter,
      )
      .then(
        (response: AxiosResponse<SalesOrderByStoreAndItemsReportDataTable>) =>
          response.data,
      );
  };
  public get = (
    id: number | string,
  ): Promise<SalesOrderByStoreAndItemsReport> => {
    return this.http
      .post<SalesOrderByStoreAndItemsReport>(kebabCase(nameof(this.get)), {
        id,
      })
      .then((response: AxiosResponse<SalesOrderByStoreAndItemsReport>) =>
        SalesOrderByStoreAndItemsReport.clone<SalesOrderByStoreAndItemsReport>(
          response.data,
        ),
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
    filter?: SalesOrderByStoreAndItemsReportFilter,
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
    filter?: SalesOrderByStoreAndItemsReportFilter,
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
    filter?: SalesOrderByStoreAndItemsReportFilter,
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
    salesOrderByStoreAndItemsReportFilter?: SalesOrderByStoreAndItemsReportFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', salesOrderByStoreAndItemsReportFilter, {
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
}
export const salesOrderByStoreAndItemsRepository: SalesOrderByStoreAndItemsReport = new SalesOrderByStoreAndItemsRepository();
