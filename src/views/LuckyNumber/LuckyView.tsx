import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import LuckyNumberMaster from 'views/LuckyNumber/LuckyNumberMaster/LuckyNumberMaster';
export function LuckyView(props: RouteConfigComponentProps) {
  const { route } = props;
  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { LuckyNumberMaster };

export default withRouter(LuckyView);
