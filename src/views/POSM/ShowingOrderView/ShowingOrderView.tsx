import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import ShowingInventories from '../ShowingWarehouseView/Inventories/ShowingInventories';
import ShowingOrderDetail from './ShowingOrderDetail/ShowingOrderDetail';
import ShowingOrderMaster from './ShowingOrderMaster/ShowingOrderMaster';

import './ShowingOrderView.scss';

function ShowingOrderView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { ShowingOrderMaster, ShowingOrderDetail, ShowingInventories };
export default withRouter(ShowingOrderView);
