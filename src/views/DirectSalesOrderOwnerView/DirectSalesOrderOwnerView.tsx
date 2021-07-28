import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import DirectSalesOrderOwnerDetail from './DirectSalesOrderOwnerDetail/DirectSalesOrderOwnerDetail';
import DirectSalesOrderOwnerMaster from './DirectSalesOrderOwnerMaster/DirectSalesOrderOwnerMaster';

function DirectSalesOrderOwnerView(props: RouteConfigComponentProps) {
  const { route } = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { DirectSalesOrderOwnerMaster, DirectSalesOrderOwnerDetail };
export default withRouter(DirectSalesOrderOwnerView);
