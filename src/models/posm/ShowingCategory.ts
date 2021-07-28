import { Image } from 'models/Image';
import { Category } from 'models/Category';
import { Status } from 'models/Status';
import { Model } from 'core/models';

export class ShowingCategory extends Model {
  public id?: number;

  public code?: string;

  public name?: string;

  public parentId?: number;

  public path?: string;

  public level?: number;

  public statusId?: number = 1;

  public imageId?: number;

  public rowId?: string;

  public used?: boolean;

  public image?: Image;

  public parent?: Category;

  public status?: Status;
}
