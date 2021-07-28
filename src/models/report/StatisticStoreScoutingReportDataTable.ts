import { Model } from 'core/models';

export class StatisticStoreScoutingReportDataTable extends Model{
  public officalName?: string;
  public storeCounter?: number; // số đại lý cắm cờ
  public storeOpennedCounter?: number; // số đại lý cắm cờ đã mở
  public storeScoutingUnOpen?: number;
  public storeScoutingCounter?: number;
  public storeCoutingOpennedRate?: number;
  public storeCoutingRate?: number;
  public storeRate?: number;
  public title?: string;
    public rowSpan?: number = 1;
}
