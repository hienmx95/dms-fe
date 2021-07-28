import { Moment } from 'moment';
import { Model } from 'core/models';
import { AppUser } from './AppUser';
export class Post extends Model {
  id?: number;
  content?: string;
  discussionId?: string;
  creatorId?: number;
  createdAt?: Moment;
  upatedAt?: Moment;
  creator?: AppUser;
  comments?: any[];
  url?: string;
  isOwner?: boolean;
  isPopup?: boolean;
}
