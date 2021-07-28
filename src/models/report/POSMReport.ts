import { Model } from 'core/models';
import { Store } from 'models/Store';

export class POSMReport extends Model {
  organizationName?: string;
  stores?: Store[];
}
