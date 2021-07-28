import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import RoleDetail from './RoleDetail/RoleDetail';
import RoleMaster from './RoleMaster/RoleMaster';
import AppUserRoleDetail from './RoleDetail/AppUserRoleDetail/AppUserRoleDetail';
import PermissionRoleDetail from './RoleDetail/PermissionRoleDetail/PermissionRoleDetail';

import './RoleView.scss';

function RoleView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { RoleMaster, RoleDetail, AppUserRoleDetail, PermissionRoleDetail };
export default withRouter(RoleView);
