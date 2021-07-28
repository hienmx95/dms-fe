import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class MenuFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public path?: StringFilter = new StringFilter();
}
