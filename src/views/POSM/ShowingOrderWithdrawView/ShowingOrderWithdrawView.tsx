import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import ShowingInventories from '../ShowingWarehouseView/Inventories/ShowingInventories';
import ShowingOrderWithdrawDetail from './ShowingOrderWithdrawDetail/ShowingOrderWithdrawDetail';
import ShowingOrderWithdrawMaster from './ShowingOrderWithdrawMaster/ShowingOrderWithdrawMaster';

import './ShowingOrderWithdrawView.scss';

function ShowingOrderWithdrawView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export {
  ShowingOrderWithdrawMaster,
  ShowingOrderWithdrawDetail,
  ShowingInventories,
};
export default withRouter(ShowingOrderWithdrawView);
