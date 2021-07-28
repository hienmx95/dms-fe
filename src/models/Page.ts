import { Model } from 'core/models';
import { Menu } from './Menu';

export class Page extends Model {
  public id?: number;
  public name?: string;
  public path?: string;
  public menuId?: number;
  public isDeleted?: boolean;
  public menu?: Menu;
}
