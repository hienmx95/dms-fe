import { API_APP_USER_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { AppUserRoleMappingFilter } from 'models/AppUserRoleMappingFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { Sex } from 'models/Sex';
import { SexFilter } from 'models/SexFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Province } from 'models/Province';
import { PositionFilter } from 'models/PositionFilter';
import { Position } from 'models/Position';
import { AxiosResponse } from 'axios';
import { buildTree } from 'helpers/tree';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { StoreType } from 'models/StoreType';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreGrouping } from 'models/StoreGrouping';

export class AppUserRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_APP_USER_ROUTE));
  }

  public count = (appUserFilter?: AppUserFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), appUserFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (appUserFilter?: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.list)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data?.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public get = (id: number | string): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public create = (appUser: AppUser): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.create)), appUser)
      .then((response: AxiosResponse<PureModelData<AppUser>>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public update = (appUser: AppUser): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.update)), appUser)
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public updateRole = (appUser: AppUser): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.updateRole)), appUser)
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public delete = (appUser: AppUser): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.delete)), appUser)
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public save = (appUser: AppUser): Promise<AppUser> => {
    return appUser.id ? this.update(appUser) : this.create(appUser);
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
  public singleListSex = (): Promise<Sex[]> => {
    return this.http
      .post<Sex[]>(kebabCase(nameof(this.singleListSex)), new SexFilter())
      .then((response: AxiosResponse<Sex[]>) => {
        return response.data.map((sex: PureModelData<Sex>) =>
          Sex.clone<Sex>(sex),
        );
      });
  };
  public singleListAppUserRoleMapping = (
    appUserRoleMappingFilter: AppUserRoleMappingFilter,
  ): Promise<AppUserRoleMapping[]> => {
    return this.http
      .post<AppUserRoleMapping[]>(
        kebabCase(nameof(this.singleListAppUserRoleMapping)),
        appUserRoleMappingFilter,
      )
      .then((response: AxiosResponse<AppUserRoleMapping[]>) => {
        return response.data.map(
          (appUserRoleMapping: PureModelData<AppUserRoleMapping>) =>
            AppUserRoleMapping.clone<AppUserRoleMapping>(appUserRoleMapping),
        );
      });
  };
  public singleListRole = (roleFilter: RoleFilter): Promise<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.singleListRole)), roleFilter)
      .then((response: AxiosResponse<Role[]>) => {
        return response.data.map((role: PureModelData<Role>) =>
          Role.clone<Role>(role),
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
  public singleListStoreGrouping = (
    storeGroupingFilter: StoreGroupingFilter,
  ): Promise<StoreGrouping[]> => {
    return this.http
      .post<StoreGrouping[]>(
        kebabCase(nameof(this.singleListStoreGrouping)),
        storeGroupingFilter,
      )
      .then((response: AxiosResponse<StoreGrouping[]>) => {
        return response.data.map((storeGrouping: PureModelData<StoreGrouping>) =>
        StoreGrouping.clone<StoreGrouping>(storeGrouping),
        );
      });
  };

  public singleListPosition = (
    positionFilter: PositionFilter,
  ): Promise<Position[]> => {
    return this.http
      .post<Position[]>(
        kebabCase(nameof(this.singleListPosition)),
        positionFilter,
      )
      .then((response: AxiosResponse<Position[]>) => {
        return response.data.map((position: PureModelData<Position>) =>
          Position.clone<Position>(position),
        );
      });
  };

  public countRole = (roleFilter: RoleFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countRole)), roleFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listRole = (roleFilter: RoleFilter): Promise<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.listRole)), roleFilter)
      .then((response: AxiosResponse<Role[]>) => {
        return response.data.map((role: PureModelData<Role>) =>
          Role.clone<Role>(role),
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

  public export = (
    appUserFilter?: AppUserFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', appUserFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (
    appUserFilter?: AppUserFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template', appUserFilter, {
      responseType: 'arraybuffer',
    });
  };

  public countStore = (storeFilter: StoreFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countStore)), storeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.listStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
  };

  public importStore = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.importStore)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response: AxiosResponse<void>) => response.data);
  };

  public exportStore = (
    storeFilter?: StoreFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-store', storeFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplateStore = (
    storeFilter?: StoreFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template-store', storeFilter, {
      responseType: 'arraybuffer',
    });
  };

}

export const appUserRepository: AppUser = new AppUserRepository();
