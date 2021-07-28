import { FieldType } from './FieldType';
import { Model } from 'core/models';

export class PermissionOperator extends Model{
    public id?: number;
    public code?: string;
    public name?: string;
    public fieldTypeId?: number;
    public fieldType?: FieldType;
}