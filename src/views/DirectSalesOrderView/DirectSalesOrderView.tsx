import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';

import DirectSalesOrderDetail from './DirectSalesOrderDetail/DirectSalesOrderDetail';
import DirectSalesOrderMaster from './DirectSalesOrderMaster/DirectSalesOrderMaster';
import './DirectSalesOrderView.scss';

function DirectSalesOrderView(props: RouteConfigComponentProps) {
  const { route } = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { DirectSalesOrderMaster, DirectSalesOrderDetail };
export default withRouter(DirectSalesOrderView);
