import { PromotionCodeOrganizationMapping } from './PromotionCodeOrganizationMapping';
import { PromotionCodeStoreMapping } from './PromotionCodeStoreMapping';
import { Model } from 'core/models';
import { Moment } from 'moment';
import { Organization } from './Organization';
import { PromotionDiscountType } from './PromotionDiscountType';
import { PromotionProductAppliedType } from './PromotionProductAppliedType';
import { PromotionType } from './PromotionType';
import { Status } from './Status';
import { PromotionCodeHistory } from './PromotionCodeHistory';
import { PromotionCodeProductMapping } from './PromotionCodeProductMapping';

export class PromotionCode extends Model {
  public id?: number;

  public code?: string;

  public name?: string;

  public quantity?: number;

  public promotionDiscountTypeId?: number;

  public value?: number;

  public maxValue?: number;

  public promotionTypeId?: number;

  public promotionProductAppliedTypeId?: number;

  public organizationId?: number;

  public startDate?: Moment;

  public endDate?: Moment;

  public statusId?: number = 1;

  public organization?: Organization;

  public promotionDiscountType?: PromotionDiscountType;

  public promotionProductAppliedType?: PromotionProductAppliedType;

  public promotionType?: PromotionType;

  public status?: Status;

  public promotionCodeHistories?: PromotionCodeHistory[];

  public promotionCodeProductMappings?: PromotionCodeProductMapping[];

  public promotionCodeStoreMappings?: PromotionCodeStoreMapping[];

  public promotionCodeOrganizationMappings?: PromotionCodeOrganizationMapping[];
}
