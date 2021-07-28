import { Model } from 'core/models';
import { UnitOfMeasure } from './UnitOfMeasure';
import { UnitOfMeasureGrouping } from './UnitOfMeasureGrouping';

export class UnitOfMeasureGroupingContent extends Model {
  public id?: number;
  public unitOfMeasureGroupingId?: number;
  public unitOfMeasureId?: number;
  public factor?: number;
  public unitOfMeasure?: UnitOfMeasure;
  public unitOfMeasureGrouping?: UnitOfMeasureGrouping;
}
