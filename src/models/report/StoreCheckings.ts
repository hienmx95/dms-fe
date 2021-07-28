import { Model } from 'core/models';

export class StoreCheckings extends Model{
    public storeCode?: string;
    public storeName?: string;
    public storeAddress?: string;
    public saleEmployeeId?: number;
    public checkIn?: string;
    public checkOut?: string;
    public duaration?: string;
    public checkInDistance?: string;
    public checkOutDistance?: string;
    public deviceName?: string;
    public imageCounter?: number;
    public planned?: boolean;
    public salesOrder?: boolean;
}