import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import StoreDetail from './StoreDetail/StoreDetail';
import StoreMaster from './StoreMaster/StoreMaster';

import './StoreView.scss';

function StoreView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { StoreMaster, StoreDetail };
export default withRouter(StoreView);
