import { AxiosResponse } from 'axios';
import kebabCase from 'lodash/kebabCase';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { httpConfig } from 'config/http';
import { Repository } from 'core/repositories/Repository';
import { API_MOBILE_BANNER_ROUTE } from 'config/api-consts';
import { Notification } from 'models/Notification';
import nameof from 'ts-nameof.macro';
export class NotificationMobileRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_MOBILE_BANNER_ROUTE));
  }
  public getNotification = (id: number | string): Promise<Notification> => {
    return this.http
      .post<Notification>(kebabCase(nameof(this.getNotification)), { id })
      .then((response: AxiosResponse<Notification>) =>
      Notification.clone<Notification>(response.data),
      );
  };
}

export const notificationMobileRepository: Notification = new NotificationMobileRepository();
