import { AxiosResponse } from 'axios';
import { API_STORE_SCOUTING_ROUTE, POST_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { FileModel } from 'models/ChatBox/FileModel';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Post } from 'models/Post';
import { PostFilter } from 'models/PostFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { StoreScouting } from 'models/StoreScouting';
import { StoreScoutingFilter } from 'models/StoreScoutingFilter';
import { StoreScoutingStatus } from 'models/StoreScoutingStatus';
import { StoreScoutingStatusFilter } from 'models/StoreScoutingStatusFilter';
import { StoreScoutingType } from 'models/StoreScoutingType';
import { StoreScoutingTypeFilter } from 'models/StoreScoutingTypeFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class StoreScoutingRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_SCOUTING_ROUTE));
  }

  public count = (
    storeScoutingFilter?: StoreScoutingFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), storeScoutingFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    storeScoutingFilter?: StoreScoutingFilter,
  ): Promise<StoreScouting[]> => {
    return this.http
      .post<StoreScouting[]>(kebabCase(nameof(this.list)), storeScoutingFilter)
      .then((response: AxiosResponse<StoreScouting[]>) => {
        return response.data?.map(
          (storeScouting: PureModelData<StoreScouting>) =>
            StoreScouting.clone<StoreScouting>(storeScouting),
        );
      });
  };

  public get = (id: number | string): Promise<StoreScouting> => {
    return this.http
      .post<StoreScouting>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StoreScouting>) =>
        StoreScouting.clone<StoreScouting>(response.data),
      );
  };

  public create = (storeScouting: StoreScouting): Promise<StoreScouting> => {
    return this.http
      .post<StoreScouting>(kebabCase(nameof(this.create)), storeScouting)
      .then((response: AxiosResponse<PureModelData<StoreScouting>>) =>
        StoreScouting.clone<StoreScouting>(response.data),
      );
  };

  public update = (storeScouting: StoreScouting): Promise<StoreScouting> => {
    return this.http
      .post<StoreScouting>(kebabCase(nameof(this.update)), storeScouting)
      .then((response: AxiosResponse<StoreScouting>) =>
        StoreScouting.clone<StoreScouting>(response.data),
      );
  };
  public reject = (storeScouting: StoreScouting): Promise<StoreScouting> => {
    return this.http
      .post<StoreScouting>(kebabCase(nameof(this.reject)), storeScouting)
      .then((response: AxiosResponse<StoreScouting>) =>
        StoreScouting.clone<StoreScouting>(response.data),
      );
  };

  public delete = (storeScouting: StoreScouting): Promise<StoreScouting> => {
    return this.http
      .post<StoreScouting>(kebabCase(nameof(this.delete)), storeScouting)
      .then((response: AxiosResponse<StoreScouting>) =>
        StoreScouting.clone<StoreScouting>(response.data),
      );
  };

  public save = (storeScouting: StoreScouting): Promise<StoreScouting> => {
    return storeScouting.id
      ? this.update(storeScouting)
      : this.create(storeScouting);
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
  public singleListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };
  public singleListDistrict = (
    districtFilter: DistrictFilter,
  ): Promise<District[]> => {
    return this.http
      .post<District[]>(
        kebabCase(nameof(this.singleListDistrict)),
        districtFilter,
      )
      .then((response: AxiosResponse<District[]>) => {
        return response.data.map((district: PureModelData<District>) =>
          District.clone<District>(district),
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
  public filterListStoreScoutingStatus = (
    storeScoutingStatusFilter: StoreScoutingStatusFilter,
  ): Promise<StoreScoutingStatus[]> => {
    return this.http
      .post<StoreScoutingStatus[]>(
        kebabCase(nameof(this.filterListStoreScoutingStatus)),
        storeScoutingStatusFilter,
      )
      .then((response: AxiosResponse<StoreScoutingStatus[]>) => {
        return response.data.map(
          (storeScoutingStatus: PureModelData<StoreScoutingStatus>) =>
            StoreScoutingStatus.clone<StoreScoutingStatus>(storeScoutingStatus),
        );
      });
  };
  public filterListWard = (wardFilter: WardFilter): Promise<Ward[]> => {
    return this.http
      .post<Ward[]>(kebabCase(nameof(this.filterListWard)), wardFilter)
      .then((response: AxiosResponse<Ward[]>) => {
        return response.data.map((ward: PureModelData<Ward>) =>
          Ward.clone<Ward>(ward),
        );
      });
  };

  public filterListStoreScoutingType = (
    storeScoutingTypeFilter: StoreScoutingTypeFilter,
  ): Promise<StoreScoutingType[]> => {
    return this.http
      .post<StoreScoutingType[]>(
        kebabCase(nameof(this.filterListStoreScoutingType)),
        storeScoutingTypeFilter,
      )
      .then((response: AxiosResponse<StoreScoutingType[]>) => {
        return response.data.map(
          (storeScoutingType: PureModelData<StoreScoutingType>) =>
            Province.clone<StoreScoutingType>(storeScoutingType),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };
  public createPost = (model: Post) => {
    return this.http
      .post<Post>(kebabCase(nameof(this.create)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post>) => Post.clone<Post>(response.data));
  };

  public listPost = (filter: PostFilter) => {
    return this.http
      .post<Post[]>(kebabCase(nameof(this.list)), filter, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post[]>) => {
        return response.data.map((item: PureModelData<Post>) =>
          Post.clone<Post>(item),
        );
      });
  };
  public countPost = (filter: PostFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public deletePost = (model: Post): Promise<Post> => {
    return this.http
      .post<Post>(kebabCase(nameof(this.delete)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post>) => Post.clone<Post>(response.data));
  };

  public saveFile = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<FileModel> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post<Post>(kebabCase(nameof(this.saveFile)), formData, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<FileModel>) => response.data);
  };
  public export = (
    storeScoutingFilter?: StoreScoutingFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', storeScoutingFilter, {
      responseType: 'arraybuffer',
    });
  };
  public exportTemplate = (
    storeScoutingFilter?: StoreScoutingFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template', storeScoutingFilter, {
      responseType: 'arraybuffer',
    });
  };
}

export const storeScoutingRepository: StoreScouting = new StoreScoutingRepository();
