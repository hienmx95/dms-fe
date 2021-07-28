import { Model } from 'core/models';
import { ERouteChangeRequest } from './ERouteChangeRequest';
import { Store } from './Store';

export class ERouteChangeRequestContent extends Model
{
    public id?: number;

    public eRouteChangeRequestId?: number;

    public storeId?: number;

    public orderNumber?: number;

    public monday?: boolean;

    public tuesday?: boolean;

    public wednesday?: boolean;

    public thursday?: boolean;

    public friday?: boolean;

    public saturday?: boolean;

    public sunday?: boolean;

    public week1?: boolean;

    public week2?: boolean;

    public week3?: boolean;

    public week4?: boolean;
    public eRouteChangeRequest?: ERouteChangeRequest;
    public store?: Store;
}
