import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_BANNER_ROUTE } from 'config/api-consts';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Banner } from 'models/Banner';
import { BannerFilter } from 'models/BannerFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Image } from 'models/Image';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { buildTree } from 'helpers/tree';

export class BannerRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_BANNER_ROUTE));
  }

  public count = (bannerFilter?: BannerFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), bannerFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (bannerFilter?: BannerFilter): Promise<Banner[]> => {
    return this.http
      .post<Banner[]>(kebabCase(nameof(this.list)), bannerFilter)
      .then((response: AxiosResponse<Banner[]>) => {
        return response.data?.map((banner: PureModelData<Banner>) =>
          Banner.clone<Banner>(banner),
        );
      });
  };

  public get = (id: number | string): Promise<Banner> => {
    return this.http
      .post<Banner>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Banner>) =>
        Banner.clone<Banner>(response.data),
      );
  };

  public create = (banner: Banner): Promise<Banner> => {
    return this.http
      .post<Banner>(kebabCase(nameof(this.create)), banner)
      .then((response: AxiosResponse<PureModelData<Banner>>) =>
        Banner.clone<Banner>(response.data),
      );
  };

  public update = (banner: Banner): Promise<Banner> => {
    return this.http
      .post<Banner>(kebabCase(nameof(this.update)), banner)
      .then((response: AxiosResponse<Banner>) =>
        Banner.clone<Banner>(response.data),
      );
  };

  public delete = (banner: Banner): Promise<Banner> => {
    return this.http
      .post<Banner>(kebabCase(nameof(this.delete)), banner)
      .then((response: AxiosResponse<Banner>) =>
        Banner.clone<Banner>(response.data),
      );
  };

  public save = (banner: Banner): Promise<Banner> => {
    return banner.id ? this.update(banner) : this.create(banner);
  };

  public singleListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public filterListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };
  public singleListAppUser = (): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(
        kebabCase(nameof(this.singleListAppUser)),
        new AppUserFilter(),
      )
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public filterListAppUser = (): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(
        kebabCase(nameof(this.filterListAppUser)),
        new AppUserFilter(),
      )
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (
    bannerFilter?: BannerFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', bannerFilter, {
      responseType: 'arraybuffer',
    });
  };

  public uploadImage = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<Image> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post('/save-image', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<Image>) => response.data);
  };

  public singleListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
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
}

export const bannerRepository: Banner = new BannerRepository();
