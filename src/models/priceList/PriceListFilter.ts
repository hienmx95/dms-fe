import { IdFilter, StringFilter, DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PriceListFilter extends ModelFilter {
  id?: IdFilter = new IdFilter();
  code?: StringFilter = new StringFilter();
  name?: StringFilter = new StringFilter();
  startDate?: DateFilter = new DateFilter();
  endDate?: DateFilter = new DateFilter();
  updatedAt?: DateFilter = new DateFilter();
  statusId?: IdFilter = new IdFilter();
  organizationId?: IdFilter = new IdFilter();
  priceListTypeId?: IdFilter = new IdFilter();
  salesOrderTypeId?: IdFilter = new IdFilter();
  requestStateId?: IdFilter = new IdFilter();
}
