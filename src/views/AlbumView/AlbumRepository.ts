import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_ALBUM_ROUTE } from 'config/api-consts';
import { Album } from 'models/Album';
import { AlbumFilter } from 'models/AlbumFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class AlbumRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_ALBUM_ROUTE));
  }

  public count = (albumFilter?: AlbumFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), albumFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (albumFilter?: AlbumFilter): Promise<Album[]> => {
    return this.http.post<Album[]>(kebabCase(nameof(this.list)), albumFilter)
      .then((response: AxiosResponse<Album[]>) => {
        return response.data?.map((album: PureModelData<Album>) => Album.clone<Album>(album));
      });
  };

  public get = (id: number | string): Promise<Album> => {
    return this.http.post<Album>
      (kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Album>) => Album.clone<Album>(response.data));
  };

  public create = (album: Album): Promise<Album> => {
    return this.http.post<Album>(kebabCase(nameof(this.create)), album)
      .then((response: AxiosResponse<PureModelData<Album>>) => Album.clone<Album>(response.data));
  };

  public update = (album: Album): Promise<Album> => {
    return this.http.post<Album>(kebabCase(nameof(this.update)), album)
      .then((response: AxiosResponse<Album>) => Album.clone<Album>(response.data));
  };

  public delete = (album: Album): Promise<Album> => {
    return this.http.post<Album>(kebabCase(nameof(this.delete)), album)
      .then((response: AxiosResponse<Album>) => Album.clone<Album>(response.data));
  };

  public save = (album: Album): Promise<Album> => {
    return album.id ? this.update(album) : this.create(album);
  };
  public singleListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };
  public filterListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http.post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };
}

export const albumRepository: Album = new AlbumRepository();
