import { Model } from 'core/models';

export class StoreStateChangeReportDataTable extends Model {
  public organizationName?: string;
  public problemTypeName?: string;
  public problemTypeId?: number;
  public waitingCounter?: number;
  public processCounter?: number;
  public completedCounter?: number;
  public total?: number;
  public rowSpan?: number = 1;
}
