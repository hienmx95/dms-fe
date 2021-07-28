import { Model } from 'core/models';

export class POSMReportDataTable extends Model {
  public organizationName?: string;
  public storeId?: string;
  public showingItemId: string;
  public showingItemCode: string;
  public showingItemName: string;
  public unitOfMeasure: string;
  public salePrice: number;
  public quantity: number;
  public amount: number;
  public rowSpan?: number = 0;
  public code?: string;
  public name?: string;
}
