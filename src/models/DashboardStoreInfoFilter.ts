import { IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class DashboardStoreInfoFilter extends ModelFilter {
  organizationId?: IdFilter = new IdFilter();
  brandId?: IdFilter = new IdFilter();
  provinceId?: IdFilter = new IdFilter();
  districtId?: IdFilter = new IdFilter();
}
