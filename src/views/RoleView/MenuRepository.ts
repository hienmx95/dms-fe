import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_MENU_ROUTE } from 'config/api-consts';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { Field } from 'models/Field';
import { FieldFilter } from 'models/FieldFilter';
import { Page } from 'models/Page';
import { PageFilter } from 'models/PageFilter';

export class MenuRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_MENU_ROUTE));
  }

  public count = (menuFilter?: MenuFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), menuFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (menuFilter?: MenuFilter): Promise<Menu[]> => {
    return this.http
      .post<Menu[]>(kebabCase(nameof(this.list)), menuFilter)
      .then((response: AxiosResponse<Menu[]>) => {
        return response.data?.map((menu: PureModelData<Menu>) =>
          Menu.clone<Menu>(menu),
        );
      });
  };

  public get = (id: number | string): Promise<Menu> => {
    return this.http
      .post<Menu>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Menu>) => Menu.clone<Menu>(response.data));
  };

  public create = (menu: Menu): Promise<Menu> => {
    return this.http
      .post<Menu>(kebabCase(nameof(this.create)), menu)
      .then((response: AxiosResponse<PureModelData<Menu>>) =>
        Menu.clone<Menu>(response.data),
      );
  };

  public update = (menu: Menu): Promise<Menu> => {
    return this.http
      .post<Menu>(kebabCase(nameof(this.update)), menu)
      .then((response: AxiosResponse<Menu>) => Menu.clone<Menu>(response.data));
  };

  public delete = (menu: Menu): Promise<Menu> => {
    return this.http
      .post<Menu>(kebabCase(nameof(this.delete)), menu)
      .then((response: AxiosResponse<Menu>) => Menu.clone<Menu>(response.data));
  };

  public save = (menu: Menu): Promise<Menu> => {
    return menu.id ? this.update(menu) : this.create(menu);
  };

  public singleListField = (fieldFilter: FieldFilter): Promise<Field[]> => {
    return this.http
      .post<Field[]>(kebabCase(nameof(this.singleListField)), fieldFilter)
      .then((response: AxiosResponse<Field[]>) => {
        return response.data.map((field: PureModelData<Field>) =>
          Field.clone<Field>(field),
        );
      });
  };
  public singleListPage = (pageFilter: PageFilter): Promise<Page[]> => {
    return this.http
      .post<Page[]>(kebabCase(nameof(this.singleListPage)), pageFilter)
      .then((response: AxiosResponse<Page[]>) => {
        return response.data.map((page: PureModelData<Page>) =>
          Page.clone<Page>(page),
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
}

export const menuRepository: Menu = new MenuRepository();
