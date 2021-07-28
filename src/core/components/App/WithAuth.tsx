import Spin from 'antd/lib/spin';
import { FORBIDENT_ROUTE } from 'config/route-consts';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.scss';
import { MenuRouteContext } from './AppContext';
export interface WithAuthProps {
  children?: any;
  path?: string;
}
export interface AuthState {
  isAuth: boolean;
}

export default function WithAuth(WrappedComponent: any, pathName: string) {
  return class extends React.Component<{}, {}> {
    render() {
      return (
        <WithCheckAuth path={pathName}>
          <WrappedComponent />
        </WithCheckAuth>
      );
    }
  };
}

export function WithCheckAuth(props: WithAuthProps) {
  const [translate] = useTranslation();
  const { children, path } = props;
  const mapper = useContext<Record<string, number>>(MenuRouteContext);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    if (!_.isEmpty(mapper)) {
      if (!mapper.hasOwnProperty(path)) {
        window.location.href = FORBIDENT_ROUTE;
        return;
      }
      if (mapper.hasOwnProperty('hasAnyPermission')) {
        window.location.href = FORBIDENT_ROUTE; // if route mapper is empty which means they does not have any permission, return forbident
      }
      setIsAuth(true);
      return;
    }
  }, [mapper, path]);

  return (
    <>
      {isAuth ? (
        <>{children}</>
      ) : (
        <Spin
          className="checking"
          tip={translate('pages.checking.authority')}
        />
      )}
    </>
  );
}
