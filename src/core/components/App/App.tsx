import Spin from 'antd/lib/spin';
import { projectCode } from 'config/consts';
import { GlobalState } from 'core/config';
import { languageService } from 'core/services/LanguageService';
import * as Cookie from 'js-cookie';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  renderRoutes,
  RouteConfig,
  RouteConfigComponentProps,
} from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import { setGlobal } from 'reactn';
import authenticationService from 'services/AuthenticationService';
import signalRService from 'services/SignalRService';
import './App.scss';
import {
  MenuContext,
  SignalRContext,
  ActionContext,
  MenuRouteContext,
} from './AppContext';
import useAuthorizedApp from './AppHook';
import ErrorBoundary from './ErrorBoundary';
import { LOGIN_ROUTE, PORTAL_FORBIDENT_ROUTE } from 'config/route-consts';

export interface AppProps extends RouteConfigComponentProps {
  routes: RouteConfig[];
}

function App(props: AppProps) {
  const [translate] = useTranslation();
  const { routes } = props;
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const memorizedLoginPath = useMemo(
    () => `${LOGIN_ROUTE}?redirect=${window.location.pathname}`,
    [],
  );

  languageService.useLanguage();

  if (!Cookie.get('Token')) {
    window.location.href = memorizedLoginPath;
  }
  useEffect(() => {
    try {
      const fetch = async () => {
        const user = await authenticationService.checkAuth();
        if (!user) return (window.location.href = memorizedLoginPath); // if user is null or undefined, return login route
        const projects = user.appUserSiteMappings.filter(
          item => item.site.code === projectCode,
        ); // find matching project
        if (!projects.length)
          return (window.location.href = PORTAL_FORBIDENT_ROUTE); // if project not allowed to display, return forbident route
        if (!projects[0].enabled)
          return (window.location.href = PORTAL_FORBIDENT_ROUTE); // if project allowed to display, but not allowed to enable, return forbident route too
        await setGlobal<GlobalState>({
          user,
        });
        await setAuthChecking(false);
      };
      fetch();
    } catch (ex) {
      // tslint:disable-next-line:no-console
      console.log(`ex: `, ex);
      window.location.href = memorizedLoginPath;
    }
  }, [memorizedLoginPath]);

  return (
    <>
      {authChecking ? (
        <div id="app">
          <Spin tip={translate('pages.checking.authority')} />
        </div>
      ) : (
        <AuthorizedApp {...props} routes={routes} />
      )}
    </>
  );
}

const AuthorizedApp = (props: AppProps) => {
  const { routes } = props;
  const {
    authorizedMenus,
    authorizedAction,
    authorizedMenuMapper,
  } = useAuthorizedApp();
  return (
    <>
      <ErrorBoundary>
        <SignalRContext.Provider value={signalRService}>
          <MenuContext.Provider value={authorizedMenus}>
            <MenuRouteContext.Provider value={authorizedMenuMapper}>
              <ActionContext.Provider value={authorizedAction}>
                <Switch>{renderRoutes(routes)}</Switch>
              </ActionContext.Provider>
            </MenuRouteContext.Provider>
          </MenuContext.Provider>
        </SignalRContext.Provider>
      </ErrorBoundary>
    </>
  );
};

export default withRouter(App);
