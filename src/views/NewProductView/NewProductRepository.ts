import { AxiosResponse } from 'axios';
import { API_NEW_PRODUCT_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { Category, CategoryFilter } from 'models/Category';

export class NewProductRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_NEW_PRODUCT_ROUTE));
  }

  public count = (productFilter?: ProductFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), productFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (productFilter?: ProductFilter): Promise<Product[]> => {
    return this.http
      .post<Product[]>(kebabCase(nameof(this.list)), productFilter)
      .then((response: AxiosResponse<Product[]>) => {
        return response.data?.map((product: PureModelData<Product>) =>
          Product.clone<Product>(product),
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

  public get = (id: number | string): Promise<Product> => {
    return this.http
      .post<Product>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Product>) =>
        Product.clone<Product>(response.data),
      );
  };

  public create = (product: Product): Promise<Product> => {
    return this.http
      .post<Product>(kebabCase(nameof(this.create)), product)
      .then((response: AxiosResponse<PureModelData<Product>>) =>
        Product.clone<Product>(response.data),
      );
  };

  public update = (product: Product): Promise<Product> => {
    return this.http
      .post<Product>(kebabCase(nameof(this.update)), product)
      .then((response: AxiosResponse<Product>) =>
        Product.clone<Product>(response.data),
      );
  };

  public delete = (product: Product): Promise<Product> => {
    return this.http
      .post<Product>(kebabCase(nameof(this.delete)), product)
      .then((response: AxiosResponse<Product>) =>
        Product.clone<Product>(response.data),
      );
  };

  public save = (product: Product): Promise<Product> => {
    return product.id ? this.update(product) : this.create(product);
  };

  public filterListBrand = (brandFilter: BrandFilter): Promise<Brand[]> => {
    return this.http
      .post<Brand[]>(kebabCase(nameof(this.filterListBrand)), brandFilter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data.map((brand: PureModelData<Brand>) =>
          Brand.clone<Brand>(brand),
        );
      });
  };
  public filterListProductType = (
    productTypeFilter: ProductTypeFilter,
  ): Promise<ProductType[]> => {
    return this.http
      .post<ProductType[]>(
        kebabCase(nameof(this.filterListProductType)),
        productTypeFilter,
      )
      .then((response: AxiosResponse<ProductType[]>) => {
        return response.data.map((productType: PureModelData<ProductType>) =>
          ProductType.clone<ProductType>(productType),
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

  public filterListSupplier = (
    supplierFilter: SupplierFilter,
  ): Promise<Supplier[]> => {
    return this.http
      .post<Supplier[]>(
        kebabCase(nameof(this.filterListSupplier)),
        supplierFilter,
      )
      .then((response: AxiosResponse<Supplier[]>) => {
        return response.data.map((supplier: PureModelData<Supplier>) =>
          Supplier.clone<Supplier>(supplier),
        );
      });
  };
  public filterListProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.filterListProductGrouping)),
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
      .post<void>(kebabCase(nameof(this.import)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (
    productFilter?: ProductFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', productFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (
    productFilter?: ProductFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template', productFilter, {
      responseType: 'arraybuffer',
    });
  };

  public filterListCategory = (
    filter?: CategoryFilter,
  ): Promise<Category[]> => {
    return this.http
      .post<Category[]>(kebabCase(nameof(this.filterListCategory)), filter)
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Category>) =>
            Category.clone<Category>(item),
          ),
        );
      });
  };
}

export const newProductRepository: NewProductRepository = new NewProductRepository();
