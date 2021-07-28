import { Category } from 'models/Category';
import { Model } from 'core/models';
import { Brand } from './Brand';
import { ProductType } from './ProductType';
import { Status } from './Status';
import { Supplier } from './Supplier';
import { TaxType } from './TaxType';
import { UnitOfMeasure } from './UnitOfMeasure';
import { UnitOfMeasureGrouping } from './UnitOfMeasureGrouping';
import { Item } from './Item';
import { ProductImageMapping } from './ProductImageMapping';
import { ProductProductGroupingMapping } from './ProductProductGroupingMapping';
import { VariationGrouping } from './VariationGrouping';

export class Product extends Model {
  public id?: number;

  public code?: string;

  public supplierCode?: string;

  public name?: string;

  public description?: string;

  public scanCode?: string;

  public eRPCode?: string;

  public productTypeId?: number;

  public supplierId?: number;

  public brandId?: number;

  public unitOfMeasureId?: number;

  public unitOfMeasureGroupingId?: number;

  public salePrice?: number;

  public retailPrice?: number;

  public taxTypeId?: number;

  public statusId?: number = 1;

  public otherName?: string;

  public technicalName?: string;

  public note?: string;

  public brand?: Brand;

  public productType?: ProductType;

  public status?: Status;

  public supplier?: Supplier;

  public taxType?: TaxType;

  public unitOfMeasure?: UnitOfMeasure;

  public unitOfMeasureGrouping?: UnitOfMeasureGrouping;

  public items?: Item[];

  public productImageMappings?: ProductImageMapping[];

  public productProductGroupingMappings?: ProductProductGroupingMapping[];

  public variationGroupings?: VariationGrouping[];

  public usedVariationId?: number;

  public usedVariation?: Status;

  public variationCounter?: number;
  public canDelete?: boolean;
  public category?: Category;
  public categoryId?: number;
}
