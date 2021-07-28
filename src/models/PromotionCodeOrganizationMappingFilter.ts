import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PromotionCodeOrganizationMappingFilter extends ModelFilter  {
  public promotionCodeId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
}
