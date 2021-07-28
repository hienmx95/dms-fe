import { AxiosResponse } from 'axios';
import { API_DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { DirectSalesOrderByItemsReport } from 'models/report/DirectSalesOrderByItemsReport';
import { DirectSalesOrderByItemsReportDataTable } from 'models/report/DirectSalesOrderByItemsReportDataTable';
import { DirectSalesOrderByItemsReportFilter } from 'models/report/DirectSalesOrderByItemsReportFilter';
import { Items } from 'models/report/Items';
import { ProductGrouping } from 'models/report/ProductGrouping';
import { ProductType } from 'models/report/ProductType';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
export class DirectSalesOrderByItemsRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE));
  }
  public count = (filter?: DirectSalesOrderByItemsReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: DirectSalesOrderByItemsReportFilter): Promise<DirectSalesOrderByItemsReport[]> => {
    return this.http
      .post<DirectSalesOrderByItemsReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<DirectSalesOrderByItemsReport[]>) => {
        return response.data?.map((model: PureModelData<DirectSalesOrderByItemsReport>) =>
        DirectSalesOrderByItemsReport.clone<DirectSalesOrderByItemsReport>(model),
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
  public total = (filter?: DirectSalesOrderByItemsReportFilter): Promise<DirectSalesOrderByItemsReportDataTable> => {
    return this.http
      .post<DirectSalesOrderByItemsReportDataTable>(kebabCase(nameof(this.total)), filter)
      .then((response: AxiosResponse<DirectSalesOrderByItemsReportDataTable>) => response.data);
  };
  public get = (id: number | string): Promise<DirectSalesOrderByItemsReport> => {
    return this.http
      .post<DirectSalesOrderByItemsReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<DirectSalesOrderByItemsReport>) =>
      DirectSalesOrderByItemsReport.clone<DirectSalesOrderByItemsReport>(response.data),
      );
  };

  public filterListItem = (
    filter?: DirectSalesOrderByItemsReportFilter,
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
    filter?: DirectSalesOrderByItemsReportFilter,
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
    filter?: DirectSalesOrderByItemsReportFilter,
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

  public export = (directSalesOrderByItemsReportFilter?: DirectSalesOrderByItemsReportFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', directSalesOrderByItemsReportFilter, {
      responseType: 'arraybuffer',
    });
  };
}
export const directSalesOrderByItemsRepository: DirectSalesOrderByItemsRepository = new DirectSalesOrderByItemsRepository();
