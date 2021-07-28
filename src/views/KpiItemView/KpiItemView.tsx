import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import KpiItemMaster from './KpiItemMaster/KpiItemMaster';
import KpiItemDetail from './KpiItemDetail/KpiItemDetail';
function KpiItemView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { KpiItemMaster, KpiItemDetail };
export default withRouter(KpiItemView);