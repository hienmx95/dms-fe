import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';

import './PriceListOwner.scss';
import PriceListOwnerDetail from './PriceListOwnerDetail/PriceListOwnerDetail';
import PriceListOwnerMaster from './PriceListOwnerMaster/PriceListOwnerMaster';

function PriceListView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { PriceListOwnerMaster, PriceListOwnerDetail };
export default withRouter(PriceListView);
