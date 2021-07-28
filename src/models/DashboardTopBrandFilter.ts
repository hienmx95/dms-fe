import { IdFilter, NumberFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class DashboardTopBrandFilter extends ModelFilter {
  organizationId?: IdFilter = new IdFilter();
  brandId?: IdFilter = new IdFilter();
  provinceId?: IdFilter = new IdFilter();
  districtId?: IdFilter = new IdFilter();
  public top?: NumberFilter = new NumberFilter();
}
