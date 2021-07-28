import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import StoreScoutingTypeMaster from './StoreScoutingTypeMaster/StoreScoutingTypeMaster';

import './StoreScoutingTypeView.scss';

function StoreScoutingTypeView(props: RouteConfigComponentProps) {
  const { route } = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { StoreScoutingTypeMaster };
export default withRouter(StoreScoutingTypeView);
