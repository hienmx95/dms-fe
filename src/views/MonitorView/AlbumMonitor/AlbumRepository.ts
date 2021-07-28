import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { API_ALBUMN_MONITOR_ROUTE } from 'config/api-consts';
import {
  AlbumnMonitorFilter,
  AlbumnMonitor,
} from 'models/monitor/AlbumMonitor';
import kebabCase from 'lodash/kebabCase';
import nameof from 'ts-nameof.macro';
import { AxiosResponse } from 'axios';
import { PureModelData } from 'react3l';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { AlbumFilter } from 'models/AlbumFilter';
import { Album } from 'models/Album';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUser } from 'models/AppUser';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import { StoreImageMapping } from 'models/StoreImageMapping';
import { buildTree } from 'helpers/tree';
import {
  StoreImagesMonitor,
} from 'models/monitor/StoreImagesMonitor';
export class AlbumRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_ALBUMN_MONITOR_ROUTE));
  }

  public count = (filter?: AlbumnMonitorFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    filter?: AlbumnMonitorFilter,
  ): Promise<StoreImageMapping[]> => {
    return this.http
      .post<StoreImageMapping>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<AlbumnMonitor>) => {
        if (response.data?.length > 0) {
          return response.data?.map((item: PureModelData<StoreImageMapping>) =>
            StoreImageMapping.clone<StoreImageMapping>(item),
          );
        }
        return [];
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

  public filterListAppUser = (filter?: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), filter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((item: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(item),
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

  /* build tree */
  public filterListAlbum = (filter?: AlbumFilter): Promise<Album[]> => {
    return this.http
      .post<Album[]>(kebabCase(nameof(this.filterListAlbum)), filter)
      .then((response: AxiosResponse<Album[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Album>) =>
            Album.clone<Album>(item),
          ),
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

  public updateAlbum = (storeImage: StoreImagesMonitor): Promise<StoreImagesMonitor> => {
    return this.http
      .post<StoreImagesMonitor>(kebabCase(nameof(this.updateAlbum)), storeImage)
      .then((response: AxiosResponse<StoreImagesMonitor>) =>
        StoreImagesMonitor.clone<StoreImagesMonitor>(response.data),
      );
  };
}

export const albumRepository = new AlbumRepository();
