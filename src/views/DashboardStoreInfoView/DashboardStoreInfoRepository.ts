import { AxiosResponse } from 'axios';
import { Place } from 'components/GoogleMap/CustomGoogleMap';
import { API_DASHBOARD_STORE_INFORMATION } from 'config/api-consts';
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
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { DashboardStoreInfoFilter } from 'models/DashboardStoreInfoFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { StoreCheckerMonitorFilter } from 'models/monitor';
import { StoreChecking } from 'models/monitor/StoreChecking';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';

export class DashboardStoreInfoRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DASHBOARD_STORE_INFORMATION));
  }

  public storeCounter = (filter: DashboardStoreInfoFilter) => {
    return this.http
      .post<any>(kebabCase(nameof(this.storeCounter)), filter)
      .then((response: AxiosResponse<any>) => response.data);
  };

  public brandStatistics = (filter: DashboardStoreInfoFilter) => {
    return this.http
      .post<any>(kebabCase(nameof(this.brandStatistics)), filter)
      .then((response: AxiosResponse<any>) => response.data);
  };

  public brandUnStatistics = (filter: DashboardStoreInfoFilter) => {
    return this.http
      .post<any>(kebabCase(nameof(this.brandUnStatistics)), filter)
      .then((response: AxiosResponse<any>) => response.data);
  };

  public productGroupingStatistics = (filter: DashboardStoreInfoFilter) => {
    return this.http
      .post<any>(kebabCase(nameof(this.productGroupingStatistics)), filter)
      .then((response: AxiosResponse<any>) => response.data);
  };

  public topBrand = (filter: DashboardStoreInfoFilter) => {
    return this.http
      .post<any>(kebabCase(nameof(this.topBrand)), filter)
      .then((response: AxiosResponse<any>) => response.data);
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

  public filterListBrand = (brandFilter: BrandFilter): Promise<Brand[]> => {
    return this.http
      .post<Brand[]>(kebabCase(nameof(this.filterListBrand)), brandFilter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data.map((brand: PureModelData<Brand>) =>
          Brand.clone<Brand>(brand),
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

  public filterListDistrict = (
    districtFilter: DistrictFilter,
  ): Promise<District[]> => {
    return this.http
      .post<District[]>(
        kebabCase(nameof(this.filterListDistrict)),
        districtFilter,
      )
      .then((response: AxiosResponse<District[]>) => {
        return response.data.map((district: PureModelData<District>) =>
          District.clone<District>(district),
        );
      });
  };

  public exportBrandStatistics = (
    filter?: DashboardStoreInfoFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post(kebabCase(nameof(this.exportBrandStatistics)), filter, {
      responseType: 'arraybuffer',
    });
  };
  public exportBrandUnStatistics = (
    filter?: DashboardStoreInfoFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post(kebabCase(nameof(this.exportBrandUnStatistics)), filter, {
      responseType: 'arraybuffer',
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
      storeCode: item?.code,
      topBrandName: item?.top1BrandName,
      phone: item?.phone,
    };
  };
}
export default new DashboardStoreInfoRepository();
