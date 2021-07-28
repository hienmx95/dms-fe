import { Model } from 'core/models';
import { Menu } from './Menu';
import { FieldType } from './FieldType';

export class Field extends Model {
  public id?: number;
  public name?: string;
  public type?: string;
  public menuId?: number;
  public isDeleted?: boolean;
  public menu?: Menu;
  public fiedTypeId?: number;
  public fiedType?: FieldType;

}
