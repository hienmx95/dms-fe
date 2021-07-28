import { TopSaleEmployeeFilter } from 'models/TopSaleEmployeeFilter';
import { Comment } from 'models/Comment';
import { StatusFilter } from 'models/StatusFilter';
import { PureModelData } from 'react3l';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { httpConfig } from 'config/http';
import { Repository } from 'core/repositories/Repository';
import { API_DASHBOARD_USER } from 'config/api-consts';
import kebabCase from 'lodash/kebabCase';
import { Status } from 'models/Status';
export class DashboardUserRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DASHBOARD_USER));
  }

  public salesQuantity = (filter?: TopSaleEmployeeFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.salesQuantity)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public storeChecking = (filter?: TopSaleEmployeeFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.storeChecking)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public revenue = (filter?: TopSaleEmployeeFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.revenue)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public statisticIndirectSalesOrder = (filter?: TopSaleEmployeeFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.statisticIndirectSalesOrder)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listIndirectSalesOrder = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<IndirectSalesOrder[]> => {
    return this.http
      .post<IndirectSalesOrder[]>(
        kebabCase(nameof(this.listIndirectSalesOrder)),
        indirectSalesOrderFilter,
      )
      .then((response: AxiosResponse<IndirectSalesOrder[]>) => {
        return response.data?.map(
          (indirectSalesOrder: PureModelData<IndirectSalesOrder>) =>
            IndirectSalesOrder.clone<IndirectSalesOrder>(indirectSalesOrder),
        );
      });
  };

  public listComment = (): Promise<Comment[]> => {
    return this.http
      .post<Comment[]>(kebabCase(nameof(this.listComment)))
      .then((response: AxiosResponse<Comment[]>) => {
        return response.data?.map((comment: PureModelData<Comment>) =>
          Comment.clone<Comment>(comment),
        );
      });
  };

  public filterListTime = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListTime)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };
}
export default new DashboardUserRepository();
