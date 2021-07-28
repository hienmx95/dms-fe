import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PromotionCodeOrganizationFilter extends ModelFilter  {
  public promotionCodeId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
}
