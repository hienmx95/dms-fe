import { Model } from 'core/models';
import { StoreCheckings } from './StoreCheckings';

export class StoreCheckingGroupByDates extends Model{
    public date?: string;
    public storeCheckings?: StoreCheckings;
}