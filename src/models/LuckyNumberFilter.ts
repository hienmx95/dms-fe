import { DateFilter } from './../core/filters/DateFilter';
import { ModelFilter } from 'core/models';
import { IdFilter, StringFilter } from 'core/filters';
export class LuckyNumberFilter extends ModelFilter {
  id?: IdFilter = new IdFilter();
  code?: StringFilter = new StringFilter();
  name?: StringFilter = new StringFilter();
  value?: StringFilter = new StringFilter();
  rewardStatusId?: IdFilter = new IdFilter();
  organizationId?: IdFilter = new IdFilter();

  usedAt?: DateFilter = new DateFilter();
  createdAt?: DateFilter = new DateFilter();
}
