import { AxiosResponse } from 'axios';
import { API_NOTIFICATION} from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Notification } from 'models/Notification';
import { NotificationFilter } from 'models/NotificationFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { NotificationStatusFilter } from 'models/NotificationStatusFilter';
import { NotificationStatus } from 'models/NotificationStatus';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';


export class NotificationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_NOTIFICATION));
  }

  public count = (notificationFilter?: NotificationFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), notificationFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (notificationFilter?: NotificationFilter): Promise<Notification[]> => {
    return this.http
      .post<Notification[]>(kebabCase(nameof(this.list)), notificationFilter)
      .then((response: AxiosResponse<Notification[]>) => {
        return response.data?.map((notification: PureModelData<Notification>) =>
            Notification.clone<Notification>(notification),
        );
      });
  };

  public get = (id: number | string): Promise<Notification> => {
    return this.http
      .post<Notification>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Notification>) =>
        Notification.clone<Notification>(response.data),
      );
  };
  public singleListAppUser = (filter: AppUserFilter) => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), filter, {
        baseURL: url(API_BASE_URL, API_NOTIFICATION),
      })
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public create = (notification: Notification): Promise<Notification> => {
    return this.http
      .post<Notification>(kebabCase(nameof(this.create)), notification)
      .then((response: AxiosResponse<PureModelData<Notification>>) =>
      Notification.clone<Notification>(response.data),
      );
  };

  public createDraft = (notification: Notification): Promise<Notification> => {
    return this.http
      .post<Notification>(kebabCase(nameof(this.createDraft)), notification)
      .then((response: AxiosResponse<PureModelData<Notification>>) =>
      Notification.clone<Notification>(response.data),
      );
  };
  public send = (notification: Notification): Promise<Notification> => {
    return this.http
      .post<Notification>(kebabCase(nameof(this.send)), notification)
      .then((response: AxiosResponse<PureModelData<Notification>>) =>
      Notification.clone<Notification>(response.data),
      );
  };

  public update = (notification: Notification): Promise<Notification> => {
    return this.http
      .post<Notification>(kebabCase(nameof(this.update)), notification)
      .then((response: AxiosResponse<Notification>) =>
        Notification.clone<Notification>(response.data),
      );
  };

  public delete = (notification: Notification): Promise<Notification> => {
    return this.http
      .post<Notification>(kebabCase(nameof(this.delete)), notification)
      .then((response: AxiosResponse<Notification>) =>
        Notification.clone<Notification>(response.data),
      );
  };

  public save = (notification: Notification): Promise<Notification> => {
    return notification.id ? this.update(notification) : this.create(notification);
  };

  public filterListOrganization = (
    filter?: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        filter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Organization>) =>
            Organization.clone<Organization>(item),
          ),
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
  public singleListOrganization = (organizationFilter: OrganizationFilter): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(kebabCase(nameof(this.singleListOrganization)), organizationFilter)
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree( response.data.map((organization: PureModelData<Organization>) =>
        Organization.clone<Organization>(organization),
        ));
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };
  public filterListNotificationStatus = (): Promise<NotificationStatus[]> => {
    return this.http
      .post<NotificationStatus[]>(
        kebabCase(nameof(this.filterListNotificationStatus)),
        new NotificationStatusFilter(),
      )
      .then((response: AxiosResponse<NotificationStatus[]>) => {
        return response.data.map((status: PureModelData<NotificationStatus>) =>
        NotificationStatus.clone<NotificationStatus>(status),
        );
      });
  };

}
 export const notificationRepository: NotificationRepository = new NotificationRepository();
