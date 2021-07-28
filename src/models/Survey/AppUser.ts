import { Model } from 'core/models';

export class AppUser extends Model {
public id?: number;
  public displayName?: string;
  public phone?: string;
  public email?: string;
  public address?: string;
}
