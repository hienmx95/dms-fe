import { ModelFilter } from 'core/models';
import { IdFilter, StringFilter } from 'core/filters';
export class CategoryFilter extends ModelFilter {
  id?: IdFilter = new IdFilter();
  code?: StringFilter = new StringFilter();
  name?: StringFilter = new StringFilter();
  parentId?: IdFilter = new IdFilter();
}
