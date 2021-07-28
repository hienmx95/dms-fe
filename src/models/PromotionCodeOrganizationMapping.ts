import { Model } from 'core/models';
import { Organization } from './Organization';
import { PromotionCode } from './PromotionCode';

export class PromotionCodeOrganizationMapping extends Model {
  public promotionCodeId?: number;

  public organizationId?: number;

  public organization?: Organization;

  public promotionCode?: PromotionCode;
}
