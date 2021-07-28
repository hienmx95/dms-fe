import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import IndirectSalesOrderDetail from './IndirectSalesOrderDetail/IndirectSalesOrderDetail';
import IndirectSalesOrderMaster from './IndirectSalesOrderMaster/IndirectSalesOrderMaster';
import './IndirectSalesOrderView.scss';

function IndirectSalesOrderView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { IndirectSalesOrderMaster, IndirectSalesOrderDetail };
export default withRouter(IndirectSalesOrderView);
