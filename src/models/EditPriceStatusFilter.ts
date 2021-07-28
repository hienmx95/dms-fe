import { ModelFilter } from 'core/models';
import { IdFilter, StringFilter } from 'core/filters';

export class EditPriceStatusFilter extends ModelFilter {
    public id?: IdFilter = new IdFilter();
    public code?: StringFilter = new StringFilter();
    public name?: StringFilter = new StringFilter();

}