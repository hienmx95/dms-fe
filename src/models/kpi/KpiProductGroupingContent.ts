import { Model } from 'core/models';
import { ProductGrouping } from '../ProductGrouping';
import { KpiProductGroupingContentItemMapping } from './KpiProductGroupingContentItemMapping';

export class KpiProductGroupingContent extends Model {
  public id?: number;
  public kpiProductGroupingId?: number;
  public productGroupingId?: number;
  public productGrouping?: ProductGrouping;
  public kpiProductGroupingContentCriteriaMappings?: Record<string, number>;
  public kpiProductGroupingContentItemMappings?: KpiProductGroupingContentItemMapping[];
  public indirectQuantity?: number;
  public indirectRevenue?: number;
  public indirectAmount?: number;
  public indirectStore?: number;
  public directQuantity?: number;
  public directRevenue?: number;
  public directAmount?: number;
  public directStore?: number;
}
