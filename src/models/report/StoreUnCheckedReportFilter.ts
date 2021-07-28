import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class StoreUnCheckedReportFilter extends ModelFilter{
    public organizationId?: IdFilter = new IdFilter();
    public appUserId?: IdFilter = new IdFilter();
    public eRouteId?: IdFilter = new IdFilter();
    public date?: DateFilter = new DateFilter();
    public storeStatusId?: IdFilter = new IdFilter();
}