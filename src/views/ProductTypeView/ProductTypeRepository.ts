import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_PRODUCT_TYPE_ROUTE } from 'config/api-consts';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
// import { Brand } from 'models/Brand';
// import { BrandFilter } from 'models/BrandFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
// import { TaxType } from 'models/TaxType';
// import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class ProductTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PRODUCT_TYPE_ROUTE));
  }

  public count = (productTypeFilter?: ProductTypeFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), productTypeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    productTypeFilter?: ProductTypeFilter,
  ): Promise<ProductType[]> => {
    return this.http
      .post<ProductType[]>(kebabCase(nameof(this.list)), productTypeFilter)
      .then((response: AxiosResponse<ProductType[]>) => {
        return response.data?.map((productType: PureModelData<ProductType>) =>
          ProductType.clone<ProductType>(productType),
        );
      });
  };

  public get = (id: number | string): Promise<ProductType> => {
    return this.http
      .post<ProductType>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ProductType>) =>
        ProductType.clone<ProductType>(response.data),
      );
  };

  public create = (productType: ProductType): Promise<ProductType> => {
    return this.http
      .post<ProductType>(kebabCase(nameof(this.create)), productType)
      .then((response: AxiosResponse<PureModelData<ProductType>>) =>
        ProductType.clone<ProductType>(response.data),
      );
  };

  public update = (productType: ProductType): Promise<ProductType> => {
    return this.http
      .post<ProductType>(kebabCase(nameof(this.update)), productType)
      .then((response: AxiosResponse<ProductType>) =>
        ProductType.clone<ProductType>(response.data),
      );
  };

  public delete = (productType: ProductType): Promise<ProductType> => {
    return this.http
      .post<ProductType>(kebabCase(nameof(this.delete)), productType)
      .then((response: AxiosResponse<ProductType>) =>
        ProductType.clone<ProductType>(response.data),
      );
  };

  public save = (productType: ProductType): Promise<ProductType> => {
    return productType.id ? this.update(productType) : this.create(productType);
  };

  // public singleListBrand = (brandFilter: BrandFilter): Promise<Brand[]> => {
  //     return this.http.post<Brand[]>(kebabCase(nameof(this.singleListBrand)), brandFilter)
  //       .then((response: AxiosResponse<Brand[]>) => {
  //         return response.data.map((brand: PureModelData<Brand>) => Brand.clone<Brand>(brand));
  //       });
  // };
  public singleListProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.singleListProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return response.data.map(
          (productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
        );
      });
  };
  public singleListSupplier = (
    supplierFilter: SupplierFilter,
  ): Promise<Supplier[]> => {
    return this.http
      .post<Supplier[]>(
        kebabCase(nameof(this.singleListSupplier)),
        supplierFilter,
      )
      .then((response: AxiosResponse<Supplier[]>) => {
        return response.data.map((supplier: PureModelData<Supplier>) =>
          Supplier.clone<Supplier>(supplier),
        );
      });
  };

  public singleListUnitOfMeasure = (
    unitOfMeasureFilter: UnitOfMeasureFilter,
  ): Promise<UnitOfMeasure[]> => {
    return this.http
      .post<UnitOfMeasure[]>(
        kebabCase(nameof(this.singleListUnitOfMeasure)),
        unitOfMeasureFilter,
      )
      .then((response: AxiosResponse<UnitOfMeasure[]>) => {
        return response.data.map(
          (unitOfMeasure: PureModelData<UnitOfMeasure>) =>
            UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure),
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
    productTypeFilter?: ProductTypeFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', productTypeFilter, {
      responseType: 'arraybuffer',
    });
  };
}

export const productTypeRepository: ProductType = new ProductTypeRepository();
