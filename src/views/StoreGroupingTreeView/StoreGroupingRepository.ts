import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_STORE_GROUPING_ROUTE } from 'config/api-consts';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';

export class StoreGroupingRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_GROUPING_ROUTE));
  }

  public count = (
    storeGroupingFilter?: StoreGroupingFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), storeGroupingFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    storeGroupingFilter?: StoreGroupingFilter,
  ): Promise<StoreGrouping[]> => {
    return this.http
      .post<StoreGrouping[]>(kebabCase(nameof(this.list)), storeGroupingFilter)
      .then((response: AxiosResponse<StoreGrouping[]>) => {
        return response.data?.map(
          (storeGrouping: PureModelData<StoreGrouping>) =>
            StoreGrouping.clone<StoreGrouping>(storeGrouping),
        );
      });
  };

  public get = (id: number | string): Promise<StoreGrouping> => {
    return this.http
      .post<StoreGrouping>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StoreGrouping>) =>
        StoreGrouping.clone<StoreGrouping>(response.data),
      );
  };

  public create = (storeGrouping: StoreGrouping): Promise<StoreGrouping> => {
    return this.http
      .post<StoreGrouping>(kebabCase(nameof(this.create)), storeGrouping)
      .then((response: AxiosResponse<PureModelData<StoreGrouping>>) =>
        StoreGrouping.clone<StoreGrouping>(response.data),
      );
  };

  public update = (storeGrouping: StoreGrouping): Promise<StoreGrouping> => {
    return this.http
      .post<StoreGrouping>(kebabCase(nameof(this.update)), storeGrouping)
      .then((response: AxiosResponse<StoreGrouping>) =>
        StoreGrouping.clone<StoreGrouping>(response.data),
      );
  };

  public delete = (storeGrouping: StoreGrouping): Promise<StoreGrouping> => {
    return this.http
      .post<StoreGrouping>(kebabCase(nameof(this.delete)), storeGrouping)
      .then((response: AxiosResponse<StoreGrouping>) =>
        StoreGrouping.clone<StoreGrouping>(response.data),
      );
  };

  public save = (storeGrouping: StoreGrouping): Promise<StoreGrouping> => {
    return storeGrouping.id
      ? this.update(storeGrouping)
      : this.create(storeGrouping);
  };

  public singleListStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.singleListStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
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
  public singleListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return response.data.map((organization: PureModelData<Organization>) =>
          Organization.clone<Organization>(organization),
        );
      });
  };
  public singleListProvince = (
    provinceFilter: ProvinceFilter,
  ): Promise<Province[]> => {
    return this.http
      .post<Province[]>(
        kebabCase(nameof(this.singleListProvince)),
        provinceFilter,
      )
      .then((response: AxiosResponse<Province[]>) => {
        return response.data.map((province: PureModelData<Province>) =>
          Province.clone<Province>(province),
        );
      });
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
  public singleListStoreType = (
    storeTypeFilter: StoreTypeFilter,
  ): Promise<StoreType[]> => {
    return this.http
      .post<StoreType[]>(
        kebabCase(nameof(this.singleListStoreType)),
        storeTypeFilter,
      )
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data.map((storeType: PureModelData<StoreType>) =>
          StoreType.clone<StoreType>(storeType),
        );
      });
  };
  public singleListWard = (wardFilter: WardFilter): Promise<Ward[]> => {
    return this.http
      .post<Ward[]>(kebabCase(nameof(this.singleListWard)), wardFilter)
      .then((response: AxiosResponse<Ward[]>) => {
        return response.data.map((ward: PureModelData<Ward>) =>
          Ward.clone<Ward>(ward),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };
  public singleListParentStoreStore = (storeGroupingFilter: StoreGroupingFilter): Promise<StoreGrouping[]> => {
    return this.http
      .post<StoreGrouping[]>(kebabCase(nameof(this.singleListParentStoreStore)), storeGroupingFilter)
      .then((response: AxiosResponse<StoreGrouping[]>) => {
        return response.data.map((storeGrouping: PureModelData<StoreGrouping>) =>
        StoreGrouping.clone<StoreGrouping>(storeGrouping),
        );
      });
  };
  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (
    storeGroupingFilter?: StoreGroupingFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', storeGroupingFilter, {
      responseType: 'arraybuffer',
    });
  };
}

export const storeGroupingRepository: StoreGrouping = new StoreGroupingRepository();
