import { Model } from 'core/models';
import { Moment } from 'moment';
export class LuckyNumber extends Model {
  id?: number;
  code?: string;
  name?: string;
  value?: string;
  used?: boolean;
  rewardStatusId?: number;
  rowId?: string;

  usedAt?: Moment;
  createdAt?: Moment;
  updatedAt?: Moment;
}
