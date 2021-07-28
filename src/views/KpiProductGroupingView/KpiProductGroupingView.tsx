import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import KpiProductGroupingMaster from './KpiProductGroupingMaster/KpiProductGroupingMaster';
import KpiProductGroupingDetail from './KpiProductGroupingDetail/KpiProductGroupingDetail';
function KpiItemView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { KpiProductGroupingMaster, KpiProductGroupingDetail };
export default withRouter(KpiItemView);
