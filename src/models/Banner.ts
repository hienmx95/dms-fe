import { Model } from 'core/models';
import { Moment } from 'moment';
import { Organization } from './Organization';

export class Banner extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public title?: string;
  public priority?: string;
  public c?: string;
  public imageId?: number;
  public creatorId?: number;
  public statusId?: number = 1;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public organization?: Organization;
  public organizationId?: number;
}
