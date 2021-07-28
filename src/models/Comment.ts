import { Moment } from 'moment';
import { Model } from 'core/models';
import { AppUser } from './AppUser';
import { Post } from './Post';
export class Comment extends Model {
  public id?: number;
  public content?: string;
  public postId?: number;
  public creatorId?: number;
  public createdAt?: Moment;
  public upatedAt?: Moment;
  public creator?: AppUser;
  public post?: Post;
  public url?: string;
}
