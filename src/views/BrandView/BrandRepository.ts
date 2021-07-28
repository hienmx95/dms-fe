import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_BRAND_ROUTE } from 'config/api-consts';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class BrandRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_BRAND_ROUTE));
  }

  public count = (brandFilter?: BrandFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), brandFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (brandFilter?: BrandFilter): Promise<Brand[]> => {
    return this.http.post<Brand[]>(kebabCase(nameof(this.list)), brandFilter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data?.map((brand: PureModelData<Brand>) => Brand.clone<Brand>(brand));
      });
  };

  public get = (id: number | string): Promise<Brand> => {
    return this.http.post<Brand>
      (kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Brand>) => Brand.clone<Brand>(response.data));
  };

  public create = (brand: Brand): Promise<Brand> => {
    return this.http.post<Brand>(kebabCase(nameof(this.create)), brand)
      .then((response: AxiosResponse<PureModelData<Brand>>) => Brand.clone<Brand>(response.data));
  };

  public update = (brand: Brand): Promise<Brand> => {
    return this.http.post<Brand>(kebabCase(nameof(this.update)), brand)
      .then((response: AxiosResponse<Brand>) => Brand.clone<Brand>(response.data));
  };

  public delete = (brand: Brand): Promise<Brand> => {
    return this.http.post<Brand>(kebabCase(nameof(this.delete)), brand)
      .then((response: AxiosResponse<Brand>) => Brand.clone<Brand>(response.data));
  };

  public save = (brand: Brand): Promise<Brand> => {
    return brand.id ? this.update(brand) : this.create(brand);
  };

  public singleListStatus = (): Promise<Status[]> => {
    return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };
  public filterListStatus = (): Promise<Status[]> => {
    return this.http.post<Status[]>(kebabCase(nameof(this.filterListStatus)), new StatusFilter())
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
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

export const brandRepository: Brand = new BrandRepository();
