import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class StoreGroupingFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public parentStoreGroupingId?: IdFilter = new IdFilter();
  public path?: StringFilter = new StringFilter();
  public level?: NumberFilter = new NumberFilter();
  public address1?: StringFilter = new StringFilter();
  public address2?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
}
