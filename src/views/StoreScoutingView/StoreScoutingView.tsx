import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import StoreScoutingMaster from './StoreScoutingMaster/StoreScoutingMaster';
import './StoreScoutingView.scss';

function StoreScoutingView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { StoreScoutingMaster };
export default withRouter(StoreScoutingView);
