import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class WarehouseFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public address?: StringFilter = new StringFilter();
  public organizationId?: IdFilter = new IdFilter();
  public provinceId?: IdFilter = new IdFilter();
  public districtId?: IdFilter = new IdFilter();
  public wardId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
}
