import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import WarehouseDetail from './WarehouseDetail/WarehouseDetail';
import WarehouseMaster from './WarehouseMaster/WarehouseMaster';
import './WarehouseView.scss';

function WarehouseView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { WarehouseMaster, WarehouseDetail };
export default withRouter(WarehouseView);
