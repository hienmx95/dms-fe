import { TopSaleEmployeeFilter } from './../../models/TopSaleEmployeeFilter';
import { StatusFilter } from 'models/StatusFilter';
import { PureModelData } from 'react3l';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { StoreChecking } from 'models/monitor/StoreChecking';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { httpConfig } from 'config/http';
import { Repository } from 'core/repositories/Repository';
import { API_DASHBOARD } from 'config/api-consts';
import kebabCase from 'lodash/kebabCase';
import { Status } from 'models/Status';
import { TopSaleEmployee } from 'models/TopSaleEmployee';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { buildTree } from 'helpers/tree';
import { StoreCheckerMonitorFilter } from 'models/monitor';
import { Place } from 'components/GoogleMap/CustomGoogleMap';
import {
  draffStoreIconUrl,
  flaggedStoreIconUrl,
  normalStoreIcon,
  storeStatusIdEnums,
} from 'config/consts';

export class DashboardRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DASHBOARD));
  }

  public storeChecking = (): Promise<StoreChecking> => {
    return this.http
      .post<StoreChecking>(kebabCase(nameof(this.storeChecking)))
      .then((response: AxiosResponse<StoreChecking>) =>
        StoreChecking.clone<StoreChecking>(response.data),
      );
  };

  public statisticIndirectSalesOrder = (): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(
        kebabCase(nameof(this.statisticIndirectSalesOrder)),
      )
      .then((response: AxiosResponse<IndirectSalesOrder>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public imageStoreChecking = (): Promise<StoreChecking> => {
    return this.http
      .post<StoreChecking>(kebabCase(nameof(this.imageStoreChecking)))
      .then((response: AxiosResponse<StoreChecking>) =>
        StoreChecking.clone<StoreChecking>(response.data),
      );
  };

  public saleEmployeeOnline = (): Promise<StoreChecking> => {
    return this.http
      .post<StoreChecking>(kebabCase(nameof(this.saleEmployeeOnline)))
      .then((response: AxiosResponse<StoreChecking>) =>
        StoreChecking.clone<StoreChecking>(response.data),
      );
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

  public storeCoverage = (
    filter: StoreCheckerMonitorFilter,
  ): Promise<Place[]> => {
    return this.http
      .post<StoreChecking[]>(kebabCase(nameof(this.storeCoverage)), filter)
      .then((response: AxiosResponse<StoreChecking[]>) => {
        return response.data?.map((item: PureModelData<StoreChecking>) =>
          this.mapStoreCheckingtoPlace(item),
        );
      });
  };

  public saleEmployeeLocation = (
    filter: StoreCheckerMonitorFilter,
  ): Promise<Place[]> => {
    return this.http
      .post<StoreChecking[]>(
        kebabCase(nameof(this.saleEmployeeLocation)),
        filter,
      )
      .then((response: AxiosResponse<StoreChecking[]>) => {
        return response.data?.map((item: PureModelData<StoreChecking>) =>
          this.mapStoreCheckingtoPlace(item),
        );
      });
  };

  public topSaleEmployeeStoreChecking = (
    topSaleEmployeeFilter?: TopSaleEmployeeFilter,
  ): Promise<TopSaleEmployee[]> => {
    return this.http
      .post<TopSaleEmployee[]>(
        kebabCase(nameof(this.topSaleEmployeeStoreChecking)),
        topSaleEmployeeFilter,
      )
      .then((response: AxiosResponse<TopSaleEmployee[]>) => {
        return response.data?.map(
          (topSaleEmployee: PureModelData<TopSaleEmployee>) =>
            TopSaleEmployee.clone<TopSaleEmployee>(topSaleEmployee),
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

  private mapStoreCheckingtoPlace: (item: StoreChecking) => Place = (
    item: StoreChecking,
  ) => {
    let markerIcon;
    let zIndex = 1;
    if (item.isScouting) {
      markerIcon = flaggedStoreIconUrl;
      zIndex = 2;
    } else if (item.storeStatusId === storeStatusIdEnums.DRAFT) {
      markerIcon = draffStoreIconUrl;
    } else {
      markerIcon = normalStoreIcon;
    }
    return {
      key: uuidv4(),
      latitude: item.latitude,
      longitude: item.longitude,
      telephone: item.telephone,
      address: item.address,
      markerIcon,
      zIndex,
      imageUrl: item.image,
      storeName: item.name, // for store
      displayName: item.displayName, // for employee
    };
  };
}
export default new DashboardRepository();
