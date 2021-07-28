import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import StoreTypeDetail from './StoreTypeDetail/StoreTypeDetail';
import StoreTypeMaster from './StoreTypeMaster/StoreTypeMaster';

import './StoreTypeView.scss';

function StoreTypeView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { StoreTypeMaster, StoreTypeDetail };
export default withRouter(StoreTypeView);
