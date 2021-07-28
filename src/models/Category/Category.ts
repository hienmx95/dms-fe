import { Model } from 'core/models';
import { Image } from 'models/Image';
import { Status } from 'models/Status';
import { Moment } from 'moment';

export class Category extends Model {
  id?: number;
  name?: string;
  code?: string;
  parentId?: number;
  parent?: Category;
  path?: string;
  level?: number;
  statusId?: number = 1;
  status?: Status;
  rowId?: string;
  image?: Image;
  createdAt?: Moment;
  updatedAt?: Moment;
}
