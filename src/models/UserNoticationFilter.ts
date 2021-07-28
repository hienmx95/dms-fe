import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class UserNoticationFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public senderId?: IdFilter = new IdFilter();

  public recipientId?: IdFilter = new IdFilter();

  public time?: StringFilter = new StringFilter();
}
