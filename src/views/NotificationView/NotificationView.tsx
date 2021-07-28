import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import NotificationDetail from './NotificationDetail/NotificationDetail';
import NotificationMaster from './NotificationMaster/NotificationMaster';
import './NotificationView.scss';

function NotificationView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { NotificationMaster, NotificationDetail };
export default withRouter(NotificationView);
