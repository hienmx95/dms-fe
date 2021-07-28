import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_PERMISSION_ROUTE} from 'config/api-consts';
import { Permission } from 'models/Permission';
import { PermissionFilter } from 'models/PermissionFilter';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import { PermissionFieldMappingFilter } from 'models/PermissionFieldMappingFilter';
import { Field } from 'models/Field';
import { FieldFilter } from 'models/FieldFilter';
import { PermissionPageMapping } from 'models/PermissionPageMapping';
import { PermissionPageMappingFilter } from 'models/PermissionPageMappingFilter';
import { Page } from 'models/Page';
import { PageFilter } from 'models/PageFilter';

export class PermissionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PERMISSION_ROUTE));
  }

  public count = (permissionFilter?: PermissionFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), permissionFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (permissionFilter?: PermissionFilter): Promise<Permission[]> => {
    return this.http.post<Permission[]>(kebabCase(nameof(this.list)), permissionFilter)
      .then((response: AxiosResponse<Permission[]>) => {
        return response.data?.map((permission: PureModelData<Permission>) =>  Permission.clone<Permission>(permission));
    });
  };

  public get = (id: number | string): Promise<Permission> => {
    return this.http.post<Permission>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<Permission>) => Permission.clone<Permission>(response.data));
  };

  public create = (permission: Permission): Promise<Permission> => {
    return this.http.post<Permission>(kebabCase(nameof(this.create)), permission)
      .then((response: AxiosResponse<PureModelData<Permission>>) => Permission.clone<Permission>(response.data));
  };

  public update = (permission: Permission): Promise<Permission> => {
    return this.http.post<Permission>(kebabCase(nameof(this.update)), permission)
      .then((response: AxiosResponse<Permission>) => Permission.clone<Permission>(response.data));
  };

  public delete = (permission: Permission): Promise<Permission> => {
      return this.http.post<Permission>(kebabCase(nameof(this.delete)), permission)
        .then((response: AxiosResponse<Permission>) => Permission.clone<Permission>(response.data));
  };

  public save = (permission: Permission): Promise<Permission> => {
      return permission.id ? this.update(permission) : this.create(permission);
  };

  public singleListMenu = (menuFilter: MenuFilter): Promise<Menu[]> => {
      return this.http.post<Menu[]>(kebabCase(nameof(this.singleListMenu)), menuFilter)
        .then((response: AxiosResponse<Menu[]>) => {
          return response.data.map((menu: PureModelData<Menu>) => Menu.clone<Menu>(menu));
        });
  };
  public singleListRole = (roleFilter: RoleFilter): Promise<Role[]> => {
      return this.http.post<Role[]>(kebabCase(nameof(this.singleListRole)), roleFilter)
        .then((response: AxiosResponse<Role[]>) => {
          return response.data.map((role: PureModelData<Role>) => Role.clone<Role>(role));
        });
  };
  public singleListStatus = (): Promise<Status[]> =>
  {
      return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
        .then((response: AxiosResponse<Status[]>) => {
          return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };
  public singleListPermissionFieldMapping = (permissionFieldMappingFilter: PermissionFieldMappingFilter): Promise<PermissionFieldMapping[]> => {
      return this.http.post<PermissionFieldMapping[]>(kebabCase(nameof(this.singleListPermissionFieldMapping)), permissionFieldMappingFilter)
        .then((response: AxiosResponse<PermissionFieldMapping[]>) => {
          return response.data.map((permissionFieldMapping: PureModelData<PermissionFieldMapping>) => PermissionFieldMapping.clone<PermissionFieldMapping>(permissionFieldMapping));
        });
  };
  public singleListField = (fieldFilter: FieldFilter): Promise<Field[]> => {
      return this.http.post<Field[]>(kebabCase(nameof(this.singleListField)), fieldFilter)
        .then((response: AxiosResponse<Field[]>) => {
          return response.data.map((field: PureModelData<Field>) => Field.clone<Field>(field));
        });
  };
  public singleListPermissionPageMapping = (permissionPageMappingFilter: PermissionPageMappingFilter): Promise<PermissionPageMapping[]> => {
      return this.http.post<PermissionPageMapping[]>(kebabCase(nameof(this.singleListPermissionPageMapping)), permissionPageMappingFilter)
        .then((response: AxiosResponse<PermissionPageMapping[]>) => {
          return response.data.map((permissionPageMapping: PureModelData<PermissionPageMapping>) => PermissionPageMapping.clone<PermissionPageMapping>(permissionPageMapping));
        });
  };
  public singleListPage = (pageFilter: PageFilter): Promise<Page[]> => {
      return this.http.post<Page[]>(kebabCase(nameof(this.singleListPage)), pageFilter)
        .then((response: AxiosResponse<Page[]>) => {
          return response.data.map((page: PureModelData<Page>) => Page.clone<Page>(page));
        });
  };

  public countField = (fieldFilter: FieldFilter):
      Promise<number> => {
        return this.http.post<number>(kebabCase(nameof(this.countField)), fieldFilter)
          .then((response: AxiosResponse<number>) =>  response.data);
    };

  public listField = (fieldFilter: FieldFilter): Promise<Field[]> => {
        return this.http.post<Field[]>(kebabCase(nameof(this.listField)), fieldFilter)
          .then((response: AxiosResponse<Field[]>) => {
            return response.data.map((field: PureModelData<Field>) => Field.clone<Field>(field));
          });
  };

  public countPage = (pageFilter: PageFilter):
      Promise<number> => {
        return this.http.post<number>(kebabCase(nameof(this.countPage)), pageFilter)
          .then((response: AxiosResponse<number>) =>  response.data);
    };

  public listPage = (pageFilter: PageFilter): Promise<Page[]> => {
        return this.http.post<Page[]>(kebabCase(nameof(this.listPage)), pageFilter)
          .then((response: AxiosResponse<Page[]>) => {
            return response.data.map((page: PureModelData<Page>) => Page.clone<Page>(page));
          });
  };


  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
    .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http.post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
    };
  }

  export const permissionRepository: Permission = new PermissionRepository();