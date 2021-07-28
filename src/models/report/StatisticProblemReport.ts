import { Model } from 'core/models';
import { Store } from 'models/Store';
export class StatisticProblemReport extends Model{
    public organizationName?: string;
    public store?: Store;
}