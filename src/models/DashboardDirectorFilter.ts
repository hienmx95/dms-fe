import { IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class DashboardDirectorFilter extends ModelFilter {
  organizationId?: IdFilter = new IdFilter();
  appUserId?: IdFilter = new IdFilter();
  time?: IdFilter = new IdFilter();
  provinceId?: IdFilter = new IdFilter();
}
