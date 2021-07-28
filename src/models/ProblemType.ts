import { Model } from 'core/models';
import { Moment } from 'moment';
export class ProblemType extends Model {
    public id?: number;
    public code?: string;
    public name?: string;
    public statusId?: number = 1;
    public createdAt?: Moment;
    public updatedAt?: Moment;
}