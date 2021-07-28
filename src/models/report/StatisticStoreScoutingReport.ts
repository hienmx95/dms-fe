import { Model } from 'core/models';

export class StatisticStoreScoutingReport extends Model{
  public officalName?: string;
  public storeCounter?: number; // số đại lý cắm cờ
  public storeOpennedCounter?: number; // số đại lý cắm cờ đã mở
  public storeScoutingUnOpen?: number;
  public storeScoutingCounter?: number;
  public storeCoutingOpennedRate?: string;
  public storeCoutingRate?: string;
  public storeRate?: number;
}
