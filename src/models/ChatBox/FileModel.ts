import { Model } from 'core/models';

export class FileModel extends Model {
  id: number;
  key?: string;
  name?: string;
  content?: string;
  mimetype?: string;
  isFile?: boolean;
  path?: string;
  level?: number;
}
