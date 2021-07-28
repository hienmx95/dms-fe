import { Menu } from 'antd';
import {
  CHANGE_PASSWORD_ROUTE,
  PROFILE_ROUTE,
  USER_NOTIFICATION_ROUTE,
} from 'config/route-consts';
import { DEFAULT_TAKE } from 'core/config';
import { debounce } from 'core/helpers/debounce';
import { buildAbsoluteLink } from 'core/helpers/string';
import { notification } from 'helpers';
import { AppUser } from 'models/AppUser';
import { AppUserSiteMapping } from 'models/AppUserSiteMapping';
import { UserNotification } from 'models/UserNotication';
import { UserNoticationFilter } from 'models/UserNoticationFilter';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import authenticationService from 'services/AuthenticationService';
import { SignalRService } from 'services/SignalRService';
import './DefaultHeader.scss';
import userNotificationRepository from './UserNotificationRepository';
export default function useDefaultHeader(user: AppUser, service, channel) {
  const [translate] = useTranslation();

  const [visibleApp, setVisibleApp] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);

  const [visibleNotification, setVisibleNotification] = useState<boolean>(
    false,
  );

  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  const [notificationFilter, setNotificationFilter] = useState<
    UserNoticationFilter
  >(new UserNoticationFilter());

  const [fetchNotification, setFetchNotification] = useState<boolean>(false);

  const [loadingNotification, setLoadingNotification] = useState<boolean>(
    false,
  );

  const [unreadNotification, dispatchNotification] = useReducer(
    newNotificationReducer,
    0,
  );

  const [subcribe, setSubcribe] = useState<boolean>(true);

  const fetchUnreadNotification = useCallback(async () => {
    try {
      const total = await userNotificationRepository.countUnread(
        notificationFilter,
      );
      await dispatchNotification({ type: COUNT_UNREAD, payload: { total } });
    } catch (ex) {
      // tslint:disable-next-line:no-console
      console.log(`ex:`, ex);
    }
  }, [notificationFilter]);

  /* subcribe channel */
  const subcribeChannel = useCallback(
    (signalRService: SignalRService, channel: string) => {
      return signalRService.registerChannel(
        channel,
        (data: UserNotification) => {
          // tslint:disable-next-line:no-console
          console.log(`data`, data);
          // dispatch count unread
          fetchUnreadNotification();
          // fire toast to notice new notification
          notification.open(notificationConfig(data));
        },
      );
    },
    [fetchUnreadNotification],
  );

  useEffect(() => {
    fetchUnreadNotification();
  }, [fetchUnreadNotification]);

  /* refactor subcribe channel */
  useEffect(() => {
    if (subcribe) {
      subcribeChannel(service, channel);
      setSubcribe(false);
    }
  }, [channel, service, subcribe, subcribeChannel]);

  const [hasMore, setHasMore] = useState<boolean>(true);
  useEffect(() => {
    const cancelled = false;
    if (fetchNotification) {
      const fetchData = async () => {
        await setLoadingNotification(true);
        const data = await userNotificationRepository.list(notificationFilter);
        const count = await userNotificationRepository.count(
          notificationFilter,
        );
        if (!cancelled) {
          await setNotifications([...data]);
          await setTotal(count);
        }
        await setFetchNotification(false);
        await setLoadingNotification(false);
      };
      fetchData();
    }
  }, [fetchNotification, notificationFilter]);

  /* handleToggerNotification */
  const handleToggleNotification = useCallback(() => {
    /* if notification is closing, set fetch data = true */
    if (!visibleNotification) {
      setNotificationFilter({
        ...notificationFilter,
        skip: 0,
        take: DEFAULT_TAKE,
      });
      setHasMore(true);
      setFetchNotification(true);
    }
    setNotifications([]);
    setVisibleNotification(!visibleNotification);
  }, [notificationFilter, visibleNotification]);

  /* handleInfiniteOnLoad */
  const handleInfiniteOnLoad = useCallback(
    debounce(() => {
      if (notificationFilter.skip + 10 >= total) {
        setLoadingNotification(false);
        setHasMore(false);
        return;
      }
      /* fetch notification with effect */
      const fetch = async () => {
        await setLoadingNotification(true);
        const data = await userNotificationRepository.list({
          ...notificationFilter,
          skip: notificationFilter.skip + 10,
        });
        await setNotifications([...notifications, ...data]);
        await setNotificationFilter({
          ...notificationFilter,
          skip: notificationFilter.skip + 10,
        });
        await setLoadingNotification(false);
      };
      fetch();
    }),
    [total, notificationFilter, notifications],
  );

  const codeLanding = '/landing/';

  const handleClick = React.useCallback((project: string) => {
    return () => {
      // ev.preventDefault();
      if (user && user.appUserSiteMappings && user.appUserSiteMappings.length > 0) {
        user.appUserSiteMappings.map((item: AppUserSiteMapping) => {
          if (item.site.code === project) {
            window.location.href = `${item.site.code}`;
          }
          return window.location.href;
        });
        return;
      }
    };
  }, [user]);

  const handleShowApp = React.useCallback(() => {
    setVisibleApp(!visibleApp);
  }, [visibleApp]);

  const handleClickToProfile = React.useCallback(() => {
    window.location.href = PROFILE_ROUTE;
  }, []);

  const handleClickToChangePassword = React.useCallback(() => {
    window.location.href = CHANGE_PASSWORD_ROUTE;
  }, []);

  const handleClickToNotification = React.useCallback(() => {
    window.location.href = USER_NOTIFICATION_ROUTE;
  }, []);

  const handleLogout = React.useCallback(() => {
    setLoading(true);
    authenticationService
      .logout()
      .then(() => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="1" className="display-name mt-2">
        {user?.displayName} ({user?.username})
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <div onClick={handleClickToProfile}>
          {translate('general.defaultHeader.profile')}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <div onClick={handleClickToChangePassword}>
          {translate('general.defaultHeader.changePass')}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4">
        <div onClick={handleLogout}>
          {translate('general.defaultHeader.logout')}
        </div>
      </Menu.Item>
    </Menu>
  );

  const handleReadNotification = useCallback(
    (id: number, url: string) => {
      return async (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        ev.preventDefault();
        await userNotificationRepository.read(id);
        await fetchUnreadNotification();
        window.location.href = url;
      };
    },
    [fetchUnreadNotification],
  );

  return {
    handleClickToProfile,
    handleClickToChangePassword,
    handleLogout,
    setVisibleNotification,
    visibleNotification,
    loading,
    handleShowApp,
    handleClickToNotification,
    handleToggleNotification,
    visibleApp,
    setVisibleApp,
    menu,
    handleClick,
    codeLanding,
    subcribeChannel,
    loadingNotification,
    notifications,
    handleInfiniteOnLoad,
    hasMore,
    total,
    handleReadNotification,
    unreadNotification,
  };
}

const notificationConfig = (data: UserNotification) => ({
  message: (
    <div
      className="content-noti-ellipsis"
      dangerouslySetInnerHTML={{
        __html: data.titleWeb,
      }}
    ></div>
  ),
  description: (
    <div
      className="content-noti-ellipsis"
      dangerouslySetInnerHTML={{
        __html: data.contentWeb,
      }}
    ></div>
  ),
  icon: (
    <>
      {data?.siteId === 2 && (
        <div
          style={{
            background: '#a32f4a',
            width: 35,
            height: 35,
            lineHeight: '35px',
            borderRadius: '50%',
            margin: 'auto',
            textAlign: 'center',
            color: '#ffffff',
          }}
          className="icon-toast-dms ml-1 mr-3"
        >
          <i className="tio-shop_outlined" />
        </div>
      )}

      {data?.siteId === 1 && (
        <div
          style={{
            background: '#7d71f1',
            width: 35,
            height: 35,
            lineHeight: '35px',
            borderRadius: '50%',
            margin: 'auto',
            textAlign: 'center',
            color: '#ffffff',
          }}
          className="icon-toast-portal ml-1 mr-3"
        >
          <i className="tio-shop_outlined" />
        </div>
      )}

      {data?.siteId === 3 && (
        <div
          style={{
            background: '#0096c7',
            width: 35,
            height: 35,
            lineHeight: '35px',
            borderRadius: '50%',
            margin: 'auto',
            textAlign: 'center',
            color: '#ffffff',
          }}
          className="icon-toast-crm ml-1 mr-3"
        >
          <i className="tio-shop_outlined" />
        </div>
      )}

      {data?.siteId === 4 && (
        <div
          style={{
            background: '#23282c',
            width: 35,
            height: 35,
            lineHeight: '35px',
            borderRadius: '50%',
            margin: 'auto',
            textAlign: 'center',
            color: '#ffffff',
          }}
          className="icon-toast-report ml-1 mr-3"
        >
          <i className="tio-shop_outlined" />
        </div>
      )}
    </>
  ),
  onClick: async () => {
    await userNotificationRepository.read(data.id);
    setTimeout(() => {
      window.location.href = data.linkWebsite
        ? buildAbsoluteLink(data.linkWebsite)
        : '#';
    }, 0);
  },
});

export const COUNT_UNREAD = 'COUNT_UNREAD';

function newNotificationReducer(state: number, action) {
  switch (action.type) {
    case 'COUNT_UNREAD': {
      return action.payload.total;
    }
    default:
      return state;
  }
}
