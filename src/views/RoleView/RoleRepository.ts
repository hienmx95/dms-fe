import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_ROLE_ROUTE } from 'config/api-consts';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Permission } from 'models/Permission';
import { PermissionFilter } from 'models/PermissionFilter';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUser } from 'models/AppUser';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Sex } from 'models/Sex';
import { SexFilter } from 'models/SexFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { StoreType } from 'models/StoreType';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { ProductType } from 'models/ProductType';
import { SupplierFilter } from 'models/SupplierFilter';
import { Supplier } from 'models/Supplier';
import { BrandFilter } from 'models/BrandFilter';
import { Brand } from 'models/Brand';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { TaxType } from 'models/TaxType';
import { RequestState } from 'models/RequestState';
import { RequestStateFilter } from 'models/RequestStateFilter';
import { FieldFilter } from 'models/FieldFilter';
import { Field } from 'models/Field';
import { PermissionOperatorFilter } from 'models/PermissionOperatorFilter';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { buildTree } from 'helpers/tree';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { ERouteType } from 'models/ERouteType';
import { EnumListFilter } from 'models/EnumListFilter';
import { EnumList } from 'models/EnumList';

export class RoleRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_ROLE_ROUTE));
  }

  public count = (roleFilter?: RoleFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), roleFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (roleFilter?: RoleFilter): Promise<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.list)), roleFilter)
      .then((response: AxiosResponse<Role[]>) => {
        return response.data?.map((role: PureModelData<Role>) =>
          Role.clone<Role>(role),
        );
      });
  };

  public get = (id: number | string): Promise<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Role>) => Role.clone<Role>(response.data));
  };

  public clone = (id: number | string): Promise<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.clone)), { id })
      .then((response: AxiosResponse<Role>) => Role.clone<Role>(response.data));
  };

  public create = (role: Role): Promise<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.create)), role)
      .then((response: AxiosResponse<PureModelData<Role>>) =>
        Role.clone<Role>(response.data),
      );
  };

  public update = (role: Role): Promise<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.update)), role)
      .then((response: AxiosResponse<Role>) => Role.clone<Role>(response.data));
  };

  public assignAppUser = (role: Role): Promise<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.assignAppUser)), role)
      .then((response: AxiosResponse<Role>) => Role.clone<Role>(response.data));
  };
  public delete = (role: Role): Promise<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.delete)), role)
      .then((response: AxiosResponse<Role>) => Role.clone<Role>(response.data));
  };

  public save = (role: Role): Promise<Role> => {
    return role.id ? this.update(role) : this.create(role);
  };

  public singleListStatus = (filter: StatusFilter): Promise<Status[]> => {
    return this.http
      .post<Status[]>(kebabCase(nameof(this.singleListStatus)), filter)
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public singleListMenu = (filter: MenuFilter): Promise<Menu[]> => {
    return this.http
      .post<Menu[]>(kebabCase(nameof(this.singleListMenu)), filter)
      .then((response: AxiosResponse<Menu[]>) => {
        return response.data.map((menu: PureModelData<Menu>) =>
          Menu.clone<Menu>(menu),
        );
      });
  };

  public singleListOrganization = (
    filter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        filter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };

  public singleListRole = (filter: RoleFilter): Promise<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.singleListRole)), filter)
      .then((response: AxiosResponse<Role[]>) => {
        return response.data.map((role: PureModelData<Role>) =>
          Role.clone<Role>(role),
        );
      });
  };

  public singleListSex = (filter: SexFilter): Promise<Sex[]> => {
    return this.http
      .post<Sex[]>(kebabCase(nameof(this.singleListSex)), filter)
      .then((response: AxiosResponse<Sex[]>) => {
        return response.data.map((sex: PureModelData<Sex>) =>
          Sex.clone<Sex>(sex),
        );
      });
  };

  public singleListProvince = (filter: ProvinceFilter): Promise<Province[]> => {
    return this.http
      .post<Province[]>(kebabCase(nameof(this.singleListProvince)), filter)
      .then((response: AxiosResponse<Province[]>) => {
        return response.data.map((province: PureModelData<Province>) =>
          Province.clone<Province>(province),
        );
      });
  };

  public singleListDistrict = (filter: DistrictFilter): Promise<District[]> => {
    return this.http
      .post<District[]>(kebabCase(nameof(this.singleListDistrict)), filter)
      .then((response: AxiosResponse<District[]>) => {
        return response.data.map((district: PureModelData<District>) =>
          District.clone<District>(district),
        );
      });
  };

  public singleListUnitOfMeasure = (
    filter: UnitOfMeasureFilter,
  ): Promise<UnitOfMeasure[]> => {
    return this.http
      .post<UnitOfMeasure[]>(
        kebabCase(nameof(this.singleListUnitOfMeasure)),
        filter,
      )
      .then((response: AxiosResponse<UnitOfMeasure[]>) => {
        return response.data.map(
          (unitOfMeasure: PureModelData<UnitOfMeasure>) =>
            UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure),
        );
      });
  };

  public singleListUnitOfMeasureGrouping = (
    filter: UnitOfMeasureGroupingFilter,
  ): Promise<UnitOfMeasureGrouping[]> => {
    return this.http
      .post<UnitOfMeasureGrouping[]>(
        kebabCase(nameof(this.singleListUnitOfMeasureGrouping)),
        filter,
      )
      .then((response: AxiosResponse<UnitOfMeasureGrouping[]>) => {
        return response.data.map(
          (unitOfMeasureGrouping: PureModelData<UnitOfMeasureGrouping>) =>
            UnitOfMeasureGrouping.clone<UnitOfMeasureGrouping>(
              unitOfMeasureGrouping,
            ),
        );
      });
  };

  public singleListTaxType = (filter: TaxTypeFilter): Promise<TaxType[]> => {
    return this.http
      .post<TaxType[]>(kebabCase(nameof(this.singleListTaxType)), filter)
      .then((response: AxiosResponse<TaxType[]>) => {
        return response.data.map((taxType: PureModelData<TaxType>) =>
          TaxType.clone<TaxType>(taxType),
        );
      });
  };

  public singleListRequestState = (
    filter: RequestStateFilter,
  ): Promise<RequestState[]> => {
    return this.http
      .post<RequestState[]>(
        kebabCase(nameof(this.singleListRequestState)),
        filter,
      )
      .then((response: AxiosResponse<RequestState[]>) => {
        return response.data.map((requestState: PureModelData<RequestState>) =>
          RequestState.clone<RequestState>(requestState),
        );
      });
  };

  public singleListWard = (filter: WardFilter): Promise<Ward[]> => {
    return this.http
      .post<Ward[]>(kebabCase(nameof(this.singleListWard)), filter)
      .then((response: AxiosResponse<Ward[]>) => {
        return response.data.map((ward: PureModelData<Ward>) =>
          Ward.clone<Ward>(ward),
        );
      });
  };

  public singleListAppUser = (filter: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), filter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public singleListCurrentUser = (filter: EnumListFilter): Promise<EnumList[]> => {
    return this.http
      .post<EnumList[]>(kebabCase(nameof(this.singleListCurrentUser)), filter)
      .then((response: AxiosResponse<EnumList[]>) => {
        return response.data.map((item: PureModelData<EnumList>) =>
        EnumList.clone<EnumList>(item),
        );
      });
  };

  public singleListStore = (filter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.singleListStore)), filter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
  };

  public singleListStoreType = (
    filter: StoreTypeFilter,
  ): Promise<StoreType[]> => {
    return this.http
      .post<StoreType[]>(kebabCase(nameof(this.singleListStoreType)), filter)
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data.map((storeType: PureModelData<StoreType>) =>
          StoreType.clone<StoreType>(storeType),
        );
      });
  };

  public singleListStoreGrouping = (
    filter: StoreGroupingFilter,
  ): Promise<StoreGrouping[]> => {
    return this.http
      .post<StoreGrouping[]>(
        kebabCase(nameof(this.singleListStoreGrouping)),
        filter,
      )
      .then((response: AxiosResponse<StoreGrouping[]>) => {
        return response.data.map(
          (storeGrouping: PureModelData<StoreGrouping>) =>
            StoreGrouping.clone<StoreGrouping>(storeGrouping),
        );
      });
  };

  public singleListProductType = (
    filter: ProductTypeFilter,
  ): Promise<ProductType[]> => {
    return this.http
      .post<ProductType[]>(
        kebabCase(nameof(this.singleListProductType)),
        filter,
      )
      .then((response: AxiosResponse<ProductType[]>) => {
        return response.data.map((productType: PureModelData<ProductType>) =>
          ProductType.clone<ProductType>(productType),
        );
      });
  };

  public singleListProductGrouping = (
    filter: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.singleListProductGrouping)),
        filter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data.map((productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
          ),
        );
      });
  };

  public singleListSupplier = (filter: SupplierFilter): Promise<Supplier[]> => {
    return this.http
      .post<Supplier[]>(kebabCase(nameof(this.singleListSupplier)), filter)
      .then((response: AxiosResponse<Supplier[]>) => {
        return response.data.map((supplier: PureModelData<Supplier>) =>
          Supplier.clone<Supplier>(supplier),
        );
      });
  };

  public singleListBrand = (filter: BrandFilter): Promise<Brand[]> => {
    return this.http
      .post<Brand[]>(kebabCase(nameof(this.singleListBrand)), filter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data.map((brand: PureModelData<Brand>) =>
          Brand.clone<Brand>(brand),
        );
      });
  };

  public singleListErouteType = (filter: ERouteTypeFilter): Promise<ERouteType[]> => {
    return this.http
      .post<ERouteType[]>(kebabCase(nameof(this.singleListErouteType)), filter)
      .then((response: AxiosResponse<ERouteType[]>) => {
        return response.data.map((eRouteType: PureModelData<ERouteType>) =>
        ERouteType.clone<ERouteType>(eRouteType),
        );
      });
  };

  public singleListPermission = (
    permissionFilter: PermissionFilter,
  ): Promise<Permission[]> => {
    return this.http
      .post<Permission[]>(
        kebabCase(nameof(this.singleListPermission)),
        permissionFilter,
      )
      .then((response: AxiosResponse<Permission[]>) => {
        return response.data.map((permission: PureModelData<Permission>) =>
          Permission.clone<Permission>(permission),
        );
      });
  };

  public countAppUser = (appUserFilter: AppUserFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countAppUser)), appUserFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listAppUser = (appUserFilter: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listAppUser)), appUserFilter)
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

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (roleFilter?: RoleFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', roleFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (
    roleFilter?: RoleFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template', roleFilter, {
      responseType: 'arraybuffer',
    });
  };

  public getMenu = (menuId: number): Promise<Role> => {
    return this.http
      .post<Menu>(kebabCase(nameof(this.getMenu)), { id: menuId })
      .then((response: AxiosResponse<Menu>) => Menu.clone<Menu>(response.data));
  };

  public listPermission = (
    permissionFilter?: PermissionFilter,
  ): Promise<Permission[]> => {
    return this.http
      .post<Permission[]>(
        kebabCase(nameof(this.listPermission)),
        permissionFilter,
      )
      .then((response: AxiosResponse<Permission[]>) => {
        return response.data?.map((permission: PureModelData<Permission>) =>
          Permission.clone<Permission>(permission),
        );
      });
  };

  public countPermission = (
    permissionFilter?: PermissionFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countPermission)), permissionFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public createPermission = (permission: Permission): Promise<Permission> => {
    return this.http
      .post<Permission>(kebabCase(nameof(this.createPermission)), permission)
      .then((response: AxiosResponse<Permission>) =>
        Permission.clone<Permission>(response.data),
      );
  };

  public updatePermission = (permission: Permission): Promise<Permission> => {
    return this.http
      .post<Permission>(kebabCase(nameof(this.updatePermission)), permission)
      .then((response: AxiosResponse<Permission>) =>
        Permission.clone<Permission>(response.data),
      );
  };

  public getPermission = (id: number): Promise<Permission> => {
    return this.http
      .post<Permission>(kebabCase(nameof(this.getPermission)), { id })
      .then((response: AxiosResponse<Permission>) =>
        Permission.clone<Permission>(response.data),
      );
  };

  public deletePermission = (permission: Permission): Promise<Permission> => {
    return this.http
      .post<Permission>(kebabCase(nameof(this.deletePermission)), permission)
      .then((response: AxiosResponse<Permission>) =>
        Permission.clone<Permission>(response.data),
      );
  };

  public singleListField = (filter: FieldFilter): Promise<Field[]> => {
    return this.http
      .post<Field[]>(kebabCase(nameof(this.singleListField)), filter)
      .then((response: AxiosResponse<Field[]>) => {
        return response.data.map((field: PureModelData<Field>) =>
          Field.clone<Field>(field),
        );
      });
  };

  public singleListPermissionOperator = (
    filter: PermissionOperatorFilter,
  ): Promise<PermissionOperatorFilter[]> => {
    return this.http
      .post<PermissionOperatorFilter[]>(
        kebabCase(nameof(this.singleListPermissionOperator)),
        filter,
      )
      .then((response: AxiosResponse<PermissionOperatorFilter[]>) => {
        return response.data.map(
          (field: PureModelData<PermissionOperatorFilter>) =>
            PermissionOperatorFilter.clone<PermissionOperatorFilter>(field),
        );
      });
  };
}
export const roleRepository: Role = new RoleRepository();
