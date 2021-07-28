import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class SupplierFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public taxCode?: StringFilter = new StringFilter();
  public phone?: StringFilter = new StringFilter();
  public email?: StringFilter = new StringFilter();
  public address?: StringFilter = new StringFilter();
  public provinceId?: IdFilter = new IdFilter();
  public districtId?: IdFilter = new IdFilter();
  public wardId?: IdFilter = new IdFilter();
  public ownerName?: StringFilter = new StringFilter();
  public personInChargeId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public description?: StringFilter = new StringFilter();
}
