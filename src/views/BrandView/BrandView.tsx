import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import BrandDetail from './BrandDetail/BrandDetail';
import BrandMaster from './BrandMaster/BrandMaster';

import './BrandView.scss';

function BrandView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { BrandMaster, BrandDetail };
export default withRouter(BrandView);
