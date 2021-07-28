import { AxiosResponse } from 'axios';
import { API_STORE_IMAGES_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { EnumList } from 'models/EnumList';
import { EnumListFilter } from 'models/EnumListFilter';
import { StoreChecking } from 'models/monitor';
import {
  StoreImagesMonitor,
  StoreImagesMonitorFilter,
} from 'models/monitor/StoreImagesMonitor';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreImageMapping } from 'models/StoreImageMapping';
import { Moment } from 'moment';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { buildTree } from 'helpers/tree';
import { AlbumFilter } from 'models/AlbumFilter';
import { Album } from 'models/Album';
export class StoreImagesRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_IMAGES_ROUTE));
  }

  public get = (storeId: number, saleEmployeeId: number, date: Moment): Promise<StoreImageMapping[]> => {
    return this.http
      .post<StoreChecking>(kebabCase(nameof(this.get)), { storeId, saleEmployeeId, date })
      .then((response: AxiosResponse<StoreChecking>) => {
        if (response.data?.length > 0) {
          return response.data.map(
            (item: PureModelData<StoreImageMapping>) =>
              StoreImageMapping.clone<StoreImageMapping>(item),
          );
        }
        return [];
      });
  };

  public count = (
    storeImageMonitorFilter?: StoreImagesMonitorFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), storeImageMonitorFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    storeImageMonitorFilter?: StoreImagesMonitorFilter,
  ): Promise<StoreImagesMonitor[]> => {
    return this.http
      .post<StoreImagesMonitor[]>(
        kebabCase(nameof(this.list)),
        storeImageMonitorFilter,
      )
      .then((response: AxiosResponse<StoreImagesMonitor[]>) => {
        return response.data?.map((item: PureModelData<StoreImagesMonitor>) =>
          StoreImagesMonitor.clone<StoreImagesMonitor>(item),
        );
      });
  };

  public updateAlbum = (storeImgageMonitor: StoreImagesMonitor): Promise<StoreImagesMonitor> => {
    return this.http
      .post<StoreImagesMonitor>(kebabCase(nameof(this.updateAlbum)), storeImgageMonitor)
      .then((response: AxiosResponse<StoreImagesMonitor>) =>
        StoreImagesMonitor.clone<StoreImagesMonitor>(response.data),
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

  public filterListHasImage = (
    filter?: EnumListFilter,
  ): Promise<EnumList[]> => {
    return this.http
      .post<EnumList[]>(kebabCase(nameof(this.filterListHasImage)), filter)
      .then((response: AxiosResponse<EnumList[]>) => {
        return response.data.map((item: PureModelData<EnumList>) =>
          EnumList.clone<EnumList>(item),
        );
      });
  };
  public singleListAlbum = (albumFilter: AlbumFilter): Promise<Album[]> => {
    return this.http
      .post<Album[]>(kebabCase(nameof(this.singleListAlbum)), albumFilter)
      .then((response: AxiosResponse<Album[]>) => {
        return response.data.map((album: PureModelData<Album>) =>
          Album.clone<Album>(album),
        );
      });
  };

  public filterListHasOrder = (
    filter?: EnumListFilter,
  ): Promise<EnumList[]> => {
    return this.http
      .post<EnumList[]>(kebabCase(nameof(this.filterListHasOrder)), filter)
      .then((response: AxiosResponse<EnumList[]>) => {
        return response.data.map((item: PureModelData<EnumList>) =>
          EnumList.clone<EnumList>(item),
        );
      });
  };

  public filterListStore = (filter?: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), filter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((item: PureModelData<Store>) =>
          Store.clone<Store>(item),
        );
      });
  };

  public filterListAppUser = (filter?: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), filter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((item: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(item),
        );
      });
  };

  public export = (
    storeImagesMonitorFilter?: StoreImagesMonitorFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', storeImagesMonitorFilter, {
      responseType: 'arraybuffer',
    });
  };
}

export const storeImagesRepository: StoreImagesRepository = new StoreImagesRepository();
