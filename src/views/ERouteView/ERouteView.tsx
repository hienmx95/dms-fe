import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import ERouteDetail from './ERouteDetail/ERouteDetail';
import ERouteMaster from './ERouteMaster/ERouteMaster';
import './ERouteView.scss';

function ERouteView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { ERouteMaster, ERouteDetail };
export default withRouter(ERouteView);
