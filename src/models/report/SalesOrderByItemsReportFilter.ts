import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class SalesOrderByItemsReportFilter extends ModelFilter{
    public organizationId?: IdFilter = new IdFilter();
    public itemId?: IdFilter = new IdFilter();
    public productGroupingId?: IdFilter = new IdFilter();
    public productTypeId?: IdFilter = new IdFilter();
    public date?: DateFilter = new DateFilter();
}