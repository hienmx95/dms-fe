import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import ShowingWarehouseDetail from './ShowingWarehouseDetail/ShowingWarehouseDetail';
import ShowingWarehouseMaster from './ShowingWarehouseMaster/ShowingWarehouseMaster';
import './ShowingWarehouseView.scss';

function ShowingWarehouseView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { ShowingWarehouseMaster, ShowingWarehouseDetail };
export default withRouter(ShowingWarehouseView);
