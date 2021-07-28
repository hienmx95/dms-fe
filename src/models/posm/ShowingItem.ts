import { Model } from 'core/models';
import { Category } from 'models/Category';
import { Status } from 'models/Status';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { ShowingItemImageMapping } from './ShowingItemImageMapping';

export class ShowingItem extends Model {
  public id?: number;

  public code?: string;

  public name?: string;

  public showingCategoryId?: number;

  public unitOfMeasureId?: number;

  public salePrice?: number;

  public description?: string;

  public statusId?: number = 1;

  public used?: boolean;

  public rowId?: string;

  public showingCategory?: Category;

  public status?: Status;

  public unitOfMeasure?: UnitOfMeasure;

  public showingItemImageMappings?: ShowingItemImageMapping[];

  public saleStock?: number;

  public erpCode?: string;
}
