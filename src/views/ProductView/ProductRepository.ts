import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_PRODUCT_ROUTE } from 'config/api-consts';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import { TaxType } from 'models/TaxType';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { ProductImageMapping } from 'models/ProductImageMapping';
import { ProductImageMappingFilter } from 'models/ProductImageMappingFilter';
import { Image } from 'models/Image';
import { ImageFilter } from 'models/ImageFilter';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { ProductProductGroupingMappingFilter } from 'models/ProductProductGroupingMappingFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { VariationGrouping } from 'models/VariationGrouping';
import { VariationGroupingFilter } from 'models/VariationGroupingFilter';
import { buildTree } from 'helpers/tree';
import { ChangePriceHistoryFilter } from 'models/ChangePriceHistoryFilter';
import { ChangePriceHistory } from 'models/ChangePriceHistory';
import { Category, CategoryFilter } from 'models/Category';

export class ProductRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PRODUCT_ROUTE));
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

  public countItemHistory = (
    changePriceHistoryFilter?: ChangePriceHistoryFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(
        kebabCase(nameof(this.countItemHistory)),
        changePriceHistoryFilter,
      )
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listItemHistory = (
    changePriceHistoryFilter?: ChangePriceHistoryFilter,
  ): Promise<ChangePriceHistory[]> => {
    return this.http
      .post<ChangePriceHistory[]>(
        kebabCase(nameof(this.listItemHistory)),
        changePriceHistoryFilter,
      )
      .then((response: AxiosResponse<ChangePriceHistory[]>) => {
        return response.data?.map(
          (changePriceHistory: PureModelData<ChangePriceHistory>) =>
            Product.clone<ChangePriceHistory>(changePriceHistory),
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

  public singleListBrand = (brandFilter: BrandFilter): Promise<Brand[]> => {
    return this.http
      .post<Brand[]>(kebabCase(nameof(this.singleListBrand)), brandFilter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data.map((brand: PureModelData<Brand>) =>
          Brand.clone<Brand>(brand),
        );
      });
  };
  public singleListProductType = (
    productTypeFilter: ProductTypeFilter,
  ): Promise<ProductType[]> => {
    return this.http
      .post<ProductType[]>(
        kebabCase(nameof(this.singleListProductType)),
        productTypeFilter,
      )
      .then((response: AxiosResponse<ProductType[]>) => {
        return response.data.map((productType: PureModelData<ProductType>) =>
          ProductType.clone<ProductType>(productType),
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

  public singleListUsedVariation = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListUsedVariation)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };
  public filterListUsedVariation = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListUsedVariation)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
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
  public singleListTaxType = (
    taxTypeFilter: TaxTypeFilter,
  ): Promise<TaxType[]> => {
    return this.http
      .post<TaxType[]>(kebabCase(nameof(this.singleListTaxType)), taxTypeFilter)
      .then((response: AxiosResponse<TaxType[]>) => {
        return response.data.map((taxType: PureModelData<TaxType>) =>
          TaxType.clone<TaxType>(taxType),
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
  public singleListUnitOfMeasureGrouping = (
    unitOfMeasureGroupingFilter: UnitOfMeasureGroupingFilter,
  ): Promise<UnitOfMeasureGrouping[]> => {
    return this.http
      .post<UnitOfMeasureGrouping[]>(
        kebabCase(nameof(this.singleListUnitOfMeasureGrouping)),
        unitOfMeasureGroupingFilter,
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
  public singleListItem = (itemFilter: ItemFilter): Promise<Item[]> => {
    return this.http
      .post<Item[]>(kebabCase(nameof(this.singleListItem)), itemFilter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data.map((item: PureModelData<Item>) =>
          Item.clone<Item>(item),
        );
      });
  };
  public singleListProductImageMapping = (
    productImageMappingFilter: ProductImageMappingFilter,
  ): Promise<ProductImageMapping[]> => {
    return this.http
      .post<ProductImageMapping[]>(
        kebabCase(nameof(this.singleListProductImageMapping)),
        productImageMappingFilter,
      )
      .then((response: AxiosResponse<ProductImageMapping[]>) => {
        return response.data.map(
          (productImageMapping: PureModelData<ProductImageMapping>) =>
            ProductImageMapping.clone<ProductImageMapping>(productImageMapping),
        );
      });
  };
  public singleListImage = (imageFilter: ImageFilter): Promise<Image[]> => {
    return this.http
      .post<Image[]>(kebabCase(nameof(this.singleListImage)), imageFilter)
      .then((response: AxiosResponse<Image[]>) => {
        return response.data.map((image: PureModelData<Image>) =>
          Image.clone<Image>(image),
        );
      });
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

  public normalListProductGrouping = (
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

  public singleListProductProductGroupingMapping = (
    productProductGroupingMappingFilter: ProductProductGroupingMappingFilter,
  ): Promise<ProductProductGroupingMapping[]> => {
    return this.http
      .post<ProductProductGroupingMapping[]>(
        kebabCase(nameof(this.singleListProductProductGroupingMapping)),
        productProductGroupingMappingFilter,
      )
      .then((response: AxiosResponse<ProductProductGroupingMapping[]>) => {
        return response.data.map(
          (
            productProductGroupingMapping: PureModelData<
              ProductProductGroupingMapping
            >,
          ) =>
            ProductProductGroupingMapping.clone<ProductProductGroupingMapping>(
              productProductGroupingMapping,
            ),
        );
      });
  };

  public singleListVariationGrouping = (
    variationGroupingFilter: VariationGroupingFilter,
  ): Promise<VariationGrouping[]> => {
    return this.http
      .post<VariationGrouping[]>(
        kebabCase(nameof(this.singleListVariationGrouping)),
        variationGroupingFilter,
      )
      .then((response: AxiosResponse<VariationGrouping[]>) => {
        return response.data.map(
          (variationGrouping: PureModelData<VariationGrouping>) =>
            VariationGrouping.clone<VariationGrouping>(variationGrouping),
        );
      });
  };

  public countImage = (imageFilter: ImageFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countImage)), imageFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listImage = (imageFilter: ImageFilter): Promise<Image[]> => {
    return this.http
      .post<Image[]>(kebabCase(nameof(this.listImage)), imageFilter)
      .then((response: AxiosResponse<Image[]>) => {
        return response.data.map((image: PureModelData<Image>) =>
          Image.clone<Image>(image),
        );
      });
  };

  public countProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(
        kebabCase(nameof(this.countProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.listProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return response.data.map(
          (productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
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

  public saveImage = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<Image> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post('/save-image', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<Image>) => response.data);
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

  public singleListCategory = (
    filter?: CategoryFilter,
  ): Promise<Category[]> => {
    return this.http
      .post<Category[]>(kebabCase(nameof(this.singleListCategory)), filter)
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Category>) =>
            Category.clone<Category>(item),
          ),
        );
      });
  };

  public saveItemImage = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<Image> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post(kebabCase(nameof(this.saveItemImage)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<Image>) => response.data);
  };

  public checkCodeGeneratorRule = (): Promise<boolean> => {
    return this.http
      .post(kebabCase(nameof(this.checkCodeGeneratorRule)))
      .then((response: AxiosResponse<boolean>) => response.data);
  };
}

export const productRepository: Product = new ProductRepository();
