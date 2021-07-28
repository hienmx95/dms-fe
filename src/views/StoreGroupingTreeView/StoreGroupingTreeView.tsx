import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import StoreGroupingTreeDetail from './StoreGroupingTreeDetail/StoreGroupingTreeDetail';
import StoreGroupingTreeMaster from './StoreGroupingTreeMaster/StoreGroupingTreeMaster';
import './StoreGroupingView.scss';


function StoreGroupingTreeView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { StoreGroupingTreeMaster, StoreGroupingTreeDetail };
export default withRouter(StoreGroupingTreeView);
