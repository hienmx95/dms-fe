import { AxiosResponse } from 'axios';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { API_SALES_ORDER_BY_ITEM_REPORT_ROUTE } from 'config/api-consts';
import { SalesOrderByItemsReportFilter } from 'models/report/SalesOrderByItemsReportFilter';
import { SalesOrderByItemsReport } from 'models/report/SalesOrderByItemsReport';
import { Items } from 'models/report/Items';
import { ProductType } from 'models/report/ProductType';
import { ProductGrouping } from 'models/report/ProductGrouping';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { buildTree } from 'helpers/tree';
import { SalesOrderByItemsReportDataTable } from 'models/report/SalesOrderByItemsReportDataTable';
export class SalesOrderByItemsRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SALES_ORDER_BY_ITEM_REPORT_ROUTE));
  }
  public count = (filter?: SalesOrderByItemsReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: SalesOrderByItemsReportFilter): Promise<SalesOrderByItemsReport[]> => {
    return this.http
      .post<SalesOrderByItemsReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<SalesOrderByItemsReport[]>) => {
        return response.data?.map((model: PureModelData<SalesOrderByItemsReport>) =>
          SalesOrderByItemsReport.clone<SalesOrderByItemsReport>(model),
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
  public total = (filter?: SalesOrderByItemsReportFilter): Promise<SalesOrderByItemsReportDataTable> => {
    return this.http
      .post<SalesOrderByItemsReportDataTable>(kebabCase(nameof(this.total)), filter)
      .then((response: AxiosResponse<SalesOrderByItemsReportDataTable>) => response.data);
  };
  public get = (id: number | string): Promise<SalesOrderByItemsReport> => {
    return this.http
      .post<SalesOrderByItemsReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<SalesOrderByItemsReport>) =>
        SalesOrderByItemsReport.clone<SalesOrderByItemsReport>(response.data),
      );
  };

  public filterListItem = (
    filter?: SalesOrderByItemsReportFilter,
  ): Promise<Items[]> => {
    return this.http
      .post<Items[]>(
        kebabCase(nameof(this.filterListItem)),
        filter,
      )
      .then((response: AxiosResponse<Items[]>) => {
        return response.data.map((model: PureModelData<Items>) =>
          Items.clone<Items>(model),
        );
      });
  };
  public filterListProductType = (
    filter?: SalesOrderByItemsReportFilter,
  ): Promise<ProductType[]> => {
    return this.http
      .post<ProductType[]>(
        kebabCase(nameof(this.filterListProductType)),
        filter,
      )
      .then((response: AxiosResponse<ProductType[]>) => {
        return response.data.map((model: PureModelData<ProductType>) =>
          ProductType.clone<ProductType>(model),
        );
      });
  };
  public filterListProductGrouping = (
    filter?: SalesOrderByItemsReportFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.filterListProductGrouping)),
        filter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(response.data.map((model: PureModelData<ProductGrouping>) =>
          ProductGrouping.clone<ProductGrouping>(model),
        ));
      });
  };

  public export = (salesOrderByItemsReportFilter?: SalesOrderByItemsReportFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', salesOrderByItemsReportFilter, {
      responseType: 'arraybuffer',
    });
  };
}
export const salesOrderByItemsRepository: SalesOrderByItemsReport = new SalesOrderByItemsRepository();
