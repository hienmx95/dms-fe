import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { API_USER_NOTIFICATION_ROUTE } from 'config/api-consts';
import { UserNoticationFilter } from 'models/UserNoticationFilter';
import { UserNotification } from 'models/UserNotication';
import kebabCase from 'lodash/kebabCase';
import nameof from 'ts-nameof.macro';
import { AxiosResponse } from 'axios';
import { PureModelData } from 'react3l';

export class UserNotificationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_USER_NOTIFICATION_ROUTE));
  }

  public list = (filter: UserNoticationFilter): Promise<UserNotification[]> => {
    return this.http
      .post<UserNotification[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<UserNotification[]>) => {
        return response.data?.map(
          (notification: PureModelData<UserNotification>) =>
            UserNotification.clone<UserNotification>(notification),
        );
      });
  };
  public count = (filter: UserNoticationFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };
  public countUnread = (filter: UserNoticationFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countUnread)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };
  public update = (item: UserNotification): Promise<UserNotification> => {
    return this.http
      .post<UserNotification>(kebabCase(nameof(this.update)), item)
      .then((response: AxiosResponse<UserNotification>) =>
        UserNotification.clone<UserNotification>(response.data),
      );
  };

  public read = (id: number): Promise<void> => {
    return this.http
      .post<void>(kebabCase(nameof(this.read)), {id})
      .then((response: AxiosResponse<void>) => {
        // tslint:disable-next-line:no-console
        console.log(`id: `, response);
      });
  };
}

const userNotificationRepository = new UserNotificationRepository();
export default userNotificationRepository;
