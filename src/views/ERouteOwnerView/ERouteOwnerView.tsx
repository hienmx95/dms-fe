import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';

import ERouteOwnerDetail from './ERouteOwnerDetail/ERouteOwnerDetail';
import ERouteOwnerMaster from './ERouteOwnerMaster/ERouteOwnerMaster';
import './ERouteOwnerView.scss';

function ERouteView(props: RouteConfigComponentProps) {
  const { route } = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { ERouteOwnerMaster, ERouteOwnerDetail };
export default withRouter(ERouteView);
