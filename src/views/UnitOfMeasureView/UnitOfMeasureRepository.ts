import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { API_UNIT_OF_MEASURE_ROUTE } from 'config/api-consts';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class UnitOfMeasureRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_UNIT_OF_MEASURE_ROUTE));
  }

  public count = (
    unitOfMeasureFilter?: UnitOfMeasureFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), unitOfMeasureFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    unitOfMeasureFilter?: UnitOfMeasureFilter,
  ): Promise<UnitOfMeasure[]> => {
    return this.http
      .post<UnitOfMeasure[]>(kebabCase(nameof(this.list)), unitOfMeasureFilter)
      .then((response: AxiosResponse<UnitOfMeasure[]>) => {
        return response.data?.map(
          (unitOfMeasure: PureModelData<UnitOfMeasure>) =>
            UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure),
        );
      });
  };

  public get = (id: number | string): Promise<UnitOfMeasure> => {
    return this.http
      .post<UnitOfMeasure>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<UnitOfMeasure>) =>
        UnitOfMeasure.clone<UnitOfMeasure>(response.data),
      );
  };

  public create = (unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure> => {
    return this.http
      .post<UnitOfMeasure>(kebabCase(nameof(this.create)), unitOfMeasure)
      .then((response: AxiosResponse<PureModelData<UnitOfMeasure>>) =>
        UnitOfMeasure.clone<UnitOfMeasure>(response.data),
      );
  };

  public update = (unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure> => {
    return this.http
      .post<UnitOfMeasure>(kebabCase(nameof(this.update)), unitOfMeasure)
      .then((response: AxiosResponse<UnitOfMeasure>) =>
        UnitOfMeasure.clone<UnitOfMeasure>(response.data),
      );
  };

  public delete = (unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure> => {
    return this.http
      .post<UnitOfMeasure>(kebabCase(nameof(this.delete)), unitOfMeasure)
      .then((response: AxiosResponse<UnitOfMeasure>) =>
        UnitOfMeasure.clone<UnitOfMeasure>(response.data),
      );
  };

  public save = (unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure> => {
    return unitOfMeasure.id
      ? this.update(unitOfMeasure)
      : this.create(unitOfMeasure);
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
        return response.data.map(
          (productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
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

  public export = ( unitOfMeasureFilter?: UnitOfMeasureFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', unitOfMeasureFilter, {
      responseType: 'arraybuffer',
    });
  };
}

export const unitOfMeasureRepository: UnitOfMeasure = new UnitOfMeasureRepository();
