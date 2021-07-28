import { Model } from 'core/models';
import { Moment } from 'moment';
import { UnitOfMeasure } from './UnitOfMeasure';
import { UnitOfMeasureGroupingContent } from './UnitOfMeasureGroupingContent';

export class UnitOfMeasureGrouping extends Model {
  public id?: number;
  public name?: string;
  public code?: string;
  public unitOfMeasureId?: number;
  public statusId?: number = 1;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public description?: string;
  public unitOfMeasure?: UnitOfMeasure;
  public unitOfMeasureGroupingContents?: UnitOfMeasureGroupingContent[];
}
