import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import AppUserDetail from './AppUserDetail/AppUserDetail';
import AppUserMaster from './AppUserMaster/AppUserMaster';

import './AppUserView.scss';

function AppUserView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { AppUserMaster, AppUserDetail };
export default withRouter(AppUserView);
