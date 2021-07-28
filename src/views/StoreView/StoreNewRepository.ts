import { AxiosResponse } from 'axios';
import { API_STORE_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { kebabCase } from 'lodash';
import { Store } from 'models/Store';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class StoreNewRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_ROUTE));
  }

  public createDraft = (store: Store): Promise<Store> => {
    return this.http
      .post('create-draft', store)
      .then((response: AxiosResponse<PureModelData<Store>>) =>
        Store.clone<Store>(response.data),
      );
  };

  public resetPassword = (store: Store): Promise<Store> => {
    return this.http
      .post<Store>(kebabCase(nameof(this.resetPassword)), store)
      .then((response: AxiosResponse<Store>) =>
        Store.clone<Store>(response.data),
      );
  };

  public lockStoreUser = (store: any): Promise<Store> => {
    return this.http
      .post<Store>(kebabCase(nameof(this.lockStoreUser)), store)
      .then((response: AxiosResponse<PureModelData<Store>>) =>
        Store.clone<Store>(response.data),
      );
  };
}

export const storeNewRepository: Store = new StoreNewRepository();
