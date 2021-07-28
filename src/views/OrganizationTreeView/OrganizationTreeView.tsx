import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import OrganizationTreeDetail from './OrganizationTreeDetail/OrganizationTreeDetail';
import OrganizationTreeMaster from './OrganizationTreeMaster/OrganizationTreeMaster';

import './OrganizationView.scss';

function OrganizationTreeView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { OrganizationTreeMaster, OrganizationTreeDetail };
export default withRouter(OrganizationTreeView);
