import { Model } from 'core/models';
import { ERoute } from './ERoute';
import { Store } from './Store';

export class ERouteContent extends Model
{
    public id?: number;

    public eRouteId?: number;

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


    public eRoute?: ERoute;

    public store?: Store;
}
