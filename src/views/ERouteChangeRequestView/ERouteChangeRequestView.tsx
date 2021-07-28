import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import ERouteChangeRequestDetail from './ERouteChangeRequestDetail/ERouteChangeRequestDetail';
import ERouteChangeRequestMaster from './ERouteChangeRequestMaster/ERouteChangeRequestMaster';
import './ERouteChangeRequestView.scss';

function ERouteChangeRequestView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { ERouteChangeRequestMaster, ERouteChangeRequestDetail };
export default withRouter(ERouteChangeRequestView);
