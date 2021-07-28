import { AxiosResponse } from 'axios';
import { API_ORGANIZATION_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class OrganizationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_ORGANIZATION_ROUTE));
  }

  public count = (organizationFilter?: OrganizationFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), organizationFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    organizationFilter?: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(kebabCase(nameof(this.list)), organizationFilter)
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data?.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };

  public countAppUser = (appUserFilter?: AppUserFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countAppUser)), appUserFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listAppUser = (appUserFilter?: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return buildTree(
          response.data?.map((appUser: PureModelData<AppUser>) =>
            AppUser.clone<AppUser>(appUser),
          ),
        );
      });
  };

  public get = (
    id: number | string,
    filterType: number,
  ): Promise<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.get)), { id, filterType })
      .then((response: AxiosResponse<Organization>) =>
        Organization.clone<Organization>(response.data),
      );
  };

  public create = (organization: Organization): Promise<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.create)), organization)
      .then((response: AxiosResponse<PureModelData<Organization>>) =>
        Organization.clone<Organization>(response.data),
      );
  };

  public update = (organization: Organization): Promise<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.update)), organization)
      .then((response: AxiosResponse<Organization>) =>
        Organization.clone<Organization>(response.data),
      );
  };

  public delete = (organization: Organization): Promise<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.delete)), organization)
      .then((response: AxiosResponse<Organization>) =>
        Organization.clone<Organization>(response.data),
      );
  };

  public deleteAppUser = (appUser: AppUser): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.deleteAppUser)), appUser)
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public save = (organization: Organization): Promise<Organization> => {
    return organization.id
      ? this.update(organization)
      : this.create(organization);
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
  public singleListStoreGrouping = (
    storeGroupingFilter: StoreGroupingFilter,
  ): Promise<StoreGrouping[]> => {
    return this.http
      .post<StoreGrouping[]>(
        kebabCase(nameof(this.singleListStoreGrouping)),
        storeGroupingFilter,
      )
      .then((response: AxiosResponse<StoreGrouping[]>) => {
        return response.data.map(
          (storeGrouping: PureModelData<StoreGrouping>) =>
            StoreGrouping.clone<StoreGrouping>(storeGrouping),
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

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public exportAppUser = (
    appUserFilter?: AppUserFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-app-user', appUserFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (
    organizationFilter?: OrganizationFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template', organizationFilter, {
      responseType: 'arraybuffer',
    });
  };

  public updateIsDisplay = (
    organization: Organization,
  ): Promise<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.updateIsDisplay)), organization)
      .then((response: AxiosResponse<Organization>) =>
        Organization.clone<Organization>(response.data),
      );
  };
}

export const organizationRepository: Organization = new OrganizationRepository();
