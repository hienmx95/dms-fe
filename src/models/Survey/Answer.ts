import { Model } from 'core/models';
import { Store } from './Store';
import { StoreScouting } from './StoreScouting';
import { AppUser } from './AppUser';

export class Answer extends Model {
    public totalCounter?: number;
    public storeCounter?: number;
    public storeScoutingCounter?: number;
    public otherCounter?: number;

    public storeResults?: Store[];
    public storeScoutingResults?: StoreScouting[];
    public otherResults?: AppUser[];

}