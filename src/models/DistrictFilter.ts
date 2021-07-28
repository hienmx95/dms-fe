import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class DistrictFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public code?: StringFilter = new StringFilter();
  public priority?: NumberFilter = new NumberFilter();
  public provinceId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
}
