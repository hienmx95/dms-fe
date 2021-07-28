import { Model } from 'core/models';

export class Problem extends Model{
    public id?: number;
    public problemTypeName?: string;
    public waitingCounter?: number;
    public processCounter?: number;
    public completedCounter?: number;

    public total?: number;
}