import { Item } from './../Item';
import { Model } from 'core/models';

export class KpiProductGroupingContentItemMapping extends Model {
  public kpiProductGroupingContentId?: number;
  public itemId?: number;
  public item?: Item;
}
