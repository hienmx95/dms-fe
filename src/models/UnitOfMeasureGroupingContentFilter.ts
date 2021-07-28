import { IdFilter, NumberFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class UnitOfMeasureGroupingContentFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public unitOfMeasureGroupingId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public factor?: NumberFilter = new NumberFilter();
}
