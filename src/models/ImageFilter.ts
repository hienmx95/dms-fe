import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ImageFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public url?: StringFilter = new StringFilter();
}
