import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class AlbumFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
}
