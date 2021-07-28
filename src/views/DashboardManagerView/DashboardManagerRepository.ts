import { AxiosResponse } from 'axios';
import { Place } from 'components/GoogleMap/CustomGoogleMap';
import { API_DASHBOARD_DIRECTOR } from 'config/api-consts';
import {
  draffStoreIconUrl,
  flaggedStoreIconUrl,
  normalStoreIcon,
  storeStatusIdEnums,
} from 'config/consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { DashboardDirectorFilter } from 'models/DashboardDirectorFilter';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { StoreCheckerMonitorFilter } from 'models/monitor';
import { StoreChecking } from 'models/monitor/StoreChecking';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { TopSaleEmployee } from 'models/TopSaleEmployee';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { TopSaleEmployeeFilter } from './../../models/TopSaleEmployeeFilter';

export class DashboardDirectorRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DASHBOARD_DIRECTOR));
  }

  public indirectSalesOrderCounter = (filter?: DashboardDirectorFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.indirectSalesOrderCounter)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public revenueTotal = (filter: DashboardDirectorFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.revenueTotal)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public storeHasCheckedCounter = (filter: DashboardDirectorFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.storeHasCheckedCounter)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public storeCheckingCouter = (filter: DashboardDirectorFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.storeCheckingCouter)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public countStore = (filter: DashboardDirectorFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.countStore)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public statisticToday = (
    filter?: DashboardDirectorFilter,
  ): Promise<StoreChecking> => {
    return this.http
      .post<StoreChecking>(kebabCase(nameof(this.statisticToday)), filter)
      .then((response: AxiosResponse<StoreChecking>) =>
        StoreChecking.clone<StoreChecking>(response.data),
      );
  };

  public statisticYesterday = (
    filter?: DashboardDirectorFilter,
  ): Promise<StoreChecking> => {
    return this.http
      .post<StoreChecking>(kebabCase(nameof(this.statisticYesterday)), filter)
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

  public top5RevenueByProduct = (
    filter?: DashboardDirectorFilter,
  ): Promise<TopSaleEmployee[]> => {
    return this.http
      .post<any[]>(kebabCase(nameof(this.top5RevenueByProduct)), filter)
      .then((response: AxiosResponse<any[]>) => {
        return response.data;
      });
  };

  public top5RevenueByEmployee = (
    filter?: DashboardDirectorFilter,
  ): Promise<TopSaleEmployee[]> => {
    return this.http
      .post<any[]>(kebabCase(nameof(this.top5RevenueByEmployee)), filter)
      .then((response: AxiosResponse<any[]>) => {
        return response.data;
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
  // public filterListTime2 = (): Promise<Status[]> => {
  //   return this.http
  //     .post<Status[]>(
  //       kebabCase(nameof(this.filterListTime2)),
  //       new StatusFilter(),
  //     )
  //     .then((response: AxiosResponse<Status[]>) => {
  //       return response.data.map((status: PureModelData<Status>) =>
  //         Status.clone<Status>(status),
  //       );
  //     });
  // };

  public revenueFluctuation = (
    filter?: DashboardDirectorFilter,
  ): Promise<any[]> => {
    return this.http
      .post<any[]>(kebabCase(nameof(this.revenueFluctuation)), filter)
      .then((response: AxiosResponse<any[]>) => {
        return response.data;
      });
  };

  public saledItemFluctuation = (
    filter?: TopSaleEmployeeFilter,
  ): Promise<any[]> => {
    return this.http
      .post<any[]>(kebabCase(nameof(this.saledItemFluctuation)), filter)
      .then((response: AxiosResponse<any[]>) => {
        return response.data;
      });
  };

  public indirectSalesOrderFluctuation = (
    filter?: DashboardDirectorFilter,
  ): Promise<any[]> => {
    return this.http
      .post<any[]>(
        kebabCase(nameof(this.indirectSalesOrderFluctuation)),
        filter,
      )
      .then((response: AxiosResponse<any[]>) => {
        return response.data;
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

  public filterListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public filterListProvince = (
    provinceFilter: ProvinceFilter,
  ): Promise<Province[]> => {
    return this.http
      .post<Province[]>(
        kebabCase(nameof(this.filterListProvince)),
        provinceFilter,
      )
      .then((response: AxiosResponse<Province[]>) => {
        return response.data.map((province: PureModelData<Province>) =>
          Province.clone<Province>(province),
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
      phone: item?.phone,
    };
  };
}
export default new DashboardDirectorRepository();
