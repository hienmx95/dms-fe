import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductFilter } from 'models/ProductFilter';
import { buildTree } from 'helpers/tree';
import { Product } from 'models/Product';

export class ProductGroupingRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PRODUCT_GROUPING_ROUTE));
  }

  public count = (
    productGroupingFilter?: ProductGroupingFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), productGroupingFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    productGroupingFilter?: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.list)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data?.map(
            (productGrouping: PureModelData<ProductGrouping>) =>
              ProductGrouping.clone<ProductGrouping>(productGrouping),
          ),
        );
      });
  };

  public countProduct = (productFilter?: ProductFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countProduct)), productFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listProduct = (productFilter?: ProductFilter): Promise<Product[]> => {
    return this.http
      .post<Product[]>(kebabCase(nameof(this.listProduct)), productFilter)
      .then((response: AxiosResponse<Product[]>) => {
        return response.data?.map((product: PureModelData<Product>) =>
          Product.clone<Product>(product),
        );
      });
  };

  public get = (id: number | string): Promise<ProductGrouping> => {
    return this.http
      .post<ProductGrouping>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ProductGrouping>) =>
        ProductGrouping.clone<ProductGrouping>(response.data),
      );
  };

  public create = (
    productGrouping: ProductGrouping,
  ): Promise<ProductGrouping> => {
    return this.http
      .post<ProductGrouping>(kebabCase(nameof(this.create)), productGrouping)
      .then((response: AxiosResponse<PureModelData<ProductGrouping>>) =>
        ProductGrouping.clone<ProductGrouping>(response.data),
      );
  };

  public update = (
    productGrouping: ProductGrouping,
  ): Promise<ProductGrouping> => {
    return this.http
      .post<ProductGrouping>(kebabCase(nameof(this.update)), productGrouping)
      .then((response: AxiosResponse<ProductGrouping>) =>
        ProductGrouping.clone<ProductGrouping>(response.data),
      );
  };

  public delete = (
    productGrouping: ProductGrouping,
  ): Promise<ProductGrouping> => {
    return this.http
      .post<ProductGrouping>(kebabCase(nameof(this.delete)), productGrouping)
      .then((response: AxiosResponse<ProductGrouping>) =>
        ProductGrouping.clone<ProductGrouping>(response.data),
      );
  };

  public save = (
    productGrouping: ProductGrouping,
  ): Promise<ProductGrouping> => {
    return productGrouping.id
      ? this.update(productGrouping)
      : this.create(productGrouping);
  };

  public singleListProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.singleListProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data.map((productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
          ),
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

export const productGroupingRepository: ProductGrouping = new ProductGroupingRepository();
