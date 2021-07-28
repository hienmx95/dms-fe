import { Model } from 'core/models';
import { Moment } from 'moment';
import { Product } from './Product';
import { UnitOfMeasureGroupingContent } from './UnitOfMeasureGroupingContent';
import { UnitOfMeasureGrouping } from './UnitOfMeasureGrouping';
import { Status } from './Status';

export class UnitOfMeasure extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public description?: string;
  public statusId?: number = 1;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public products?: Product[];
  public status?: Status;
  public unitOfMeasureGroupingContents?: UnitOfMeasureGroupingContent[];
  public unitOfMeasureGroupings?: UnitOfMeasureGrouping[];
}
