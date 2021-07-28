import { AppUser } from './AppUser';
import { Moment } from 'moment';
import { Model } from 'core/models/Model';

export class UserNotification extends Model {
  public id?: number;

  public titleWeb?: string;

  public titleMobile?: string;

  public contentWeb?: string;

  public contentMobile?: string;

  public linkWebsite?: string;

  public linkMobile?: string;

  public senderId?: number;

  public recipientId?: number;

  public unread?: boolean;

  public time?: Moment;

  public sender?: AppUser;

  public recipient?: AppUser;
  public siteId?: number;
}
