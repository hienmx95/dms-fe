import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import IndirectSalesOrderOwnerDetail from './IndirectSalesOrderDetailOwner/IndirectSalesOrderOwnerDetail';
import IndirectSalesOrderOwnerMaster from './IndirectSalesOrderOwnerMaster/IndirectSalesOrderOwnerMaster';

import './IndirectSalesOrderOwnerView.scss';

function IndirectSalesOrderOwnerView(props: RouteConfigComponentProps) {
  const { route } = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { IndirectSalesOrderOwnerMaster, IndirectSalesOrderOwnerDetail };
export default withRouter(IndirectSalesOrderOwnerView);
